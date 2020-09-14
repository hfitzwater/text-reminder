'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  async findOne(ctx) {
    const { id } = ctx.params;
    const userId = ctx.state && ctx.state.user ? ctx.state.user.id : -1;

    const entity = await strapi.services['phone-number'].findOne({ id });

    if( entity.user.id === userId ) {
      return sanitizeEntity(entity, { model: strapi.models['phone-number'] });
    } else {
      throw new Error('No');
    }
  }
};
