'use strict';

/**
 * Module dependencies
 */
var carfindsPolicy = require('../policies/carfinds.server.policy'),
  carfinds = require('../controllers/carfinds.server.controller');

module.exports = function(app) {
  // Carfinds Routes
  app.route('/api/carfinds').all(carfindsPolicy.isAllowed)
    .get(carfinds.list)
    .post(carfinds.create);

  app.route('/api/carfinds/:carfindId').all(carfindsPolicy.isAllowed)
    .get(carfinds.read)
    .put(carfinds.update)
    .delete(carfinds.delete);

  // Finish by binding the Carfind middleware
  app.param('carfindId', carfinds.carfindByID);
};
