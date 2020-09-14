'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const _ = require('lodash');

module.exports = {
  async confirm(ctx) {
    const user = ctx.state.user;
    const submittedCode = ctx.request.body.code;

    const phoneNumber = await strapi.query('phone-number').findOne({ id: user.phoneNumber });
    const confirmation = await strapi.query('phone-number-confirmation').findOne({ id: user.phoneNumberConfirmation });

    if(confirmation && Number(submittedCode) === confirmation.code) {
      phoneNumber.confirmed = true;
      phoneNumber.user = user.id;

      await strapi.query('phone-number').update({ id: phoneNumber.id }, phoneNumber);
    }

    ctx.send({ phoneNumber });
  }
};
