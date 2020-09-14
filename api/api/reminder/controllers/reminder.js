'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const moment = require('moment');
const Queue = require('bull');

const momentToCron = (m,repeat) => {
  const dayOfMonth = () => {
    if(repeat === 'monthly') {
      return m.date();
    }

    return '*';
  };

  return `${m.minute()} ${m.hour()} ${dayOfMonth()} * *`;
};

const enqueueReminder = async (number, reminder) => {
  const name = `reminder-${reminder.id}`;
  const data = {
    phoneNumber: number,
    reminder: reminder.message
  };
  let repeatOpts = {
    count: 0,
    cron: momentToCron(moment(reminder.time), reminder.repeat)
  };
  if( reminder.repeat === 'none' ) {
    repeatOpts.limit = 1;
  }

  const jobOpts = {
    repeat: repeatOpts
  };

  // Remove it if it's there
  await reminderQueue.removeRepeatable(name, repeatOpts);
  await reminderQueue.add(name, data, jobOpts);
};

const popReminder = async (reminder) => {
  const name = `reminder-${reminder.id}`;
  let repeatOpts = {
    count: 0,
    cron: momentToCron(moment(reminder.time), reminder.repeat)
  };
  if( reminder.repeat === 'none' ) {
    repeatOpts.limit = 1;
  }

  await reminderQueue.removeRepeatable(name, repeatOpts);
};

let reminderQueue;
const initQueue = () => {
  reminderQueue = new Queue('text-reminder', {
    redis: {
      port: 6379,
      host: process.env.REDIS_HOST
    }
  });

  reminderQueue.process('*', (job, done) => {
    const phoneNumber = job.data.phoneNumber;
    const reminder = job.data.reminder;

    strapi.services.sms.send(phoneNumber, `Text Reminder: \n${reminder}`);

    done();
  });
};

setTimeout(() => {
  initQueue();
}, 1000);

module.exports = {
  async find(ctx) {
    let entities;

    ctx.query.user = ctx.state && ctx.state.user ? ctx.state.user.id : -1;

    if (ctx.query._q) {
      entities = await strapi.services.reminder.search(ctx.query);
    } else {
      entities = await strapi.services.reminder.find(ctx.query);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.reminder }));
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const userId = ctx.state && ctx.state.user ? ctx.state.user.id : -1;

    const entity = await strapi.services.reminder.findOne({ id, user:userId });
    return sanitizeEntity(entity, { model: strapi.models.reminder });
  },

  async create(ctx) {
    let entity;

    const userId = ctx.state.user.id;

    const phoneNumberId = ctx.state.user.phoneNumber;
    const phoneNumber = await strapi.query('phone-number').findOne({ id: phoneNumberId });

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.user = userId;
      data.phone_number = phoneNumber.id;

      entity = await strapi.services.reminder.create(data, { files });
    } else {
      ctx.request.body.user = userId;
      ctx.request.body.phone_number = phoneNumber.id;

      entity = await strapi.services.reminder.create(ctx.request.body);
    }

    await enqueueReminder(phoneNumber.number, entity);
    return sanitizeEntity(entity, { model: strapi.models.reminder });
  },

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [reminder] = await strapi.services.reminder.find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });

    if (!reminder) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.reminder.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.reminder.update({ id }, ctx.request.body);
    }

    await enqueueReminder(reminder.phone_number.number, entity);
    return sanitizeEntity(entity, { model: strapi.models.reminder });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    const [reminder] = await strapi.services.reminder.find({
      id: ctx.params.id,
      'user.id': ctx.state.user.id,
    });

    if (!reminder) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    popReminder(reminder);

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      return await strapi.services.reminder.delete({ id }, data, {
        files,
      });
    } else {
      return await strapi.services.reminder.delete({ id }, ctx.request.body);
    }
  },
};
