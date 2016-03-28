'use strict';

/**
 * Module dependencies
 */
var carsearchesPolicy = require('../policies/carsearches.server.policy'),
  carsearches = require('../controllers/carsearches.server.controller');

module.exports = function(app) {
  // Carsearches Routes
  app.route('/api/carsearches').all(carsearchesPolicy.isAllowed)
    .get(carsearches.list)
    .post(carsearches.create);

  app.route('/api/carsearches/:carsearchId').all(carsearchesPolicy.isAllowed)
    .get(carsearches.read)
    .put(carsearches.update)
    .delete(carsearches.delete);

  // Finish by binding the Carsearch middleware
  app.param('carsearchId', carsearches.carsearchByID);
};
