'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Carfind = mongoose.model('Carfind'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Carfind
 */
exports.create = function(req, res) {
  var carfind = new Carfind(req.body);
  carfind.user = req.user;

  carfind.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carfind);
    }
  });
};

/**
 * Show the current Carfind
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var carfind = req.carfind ? req.carfind.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  carfind.isCurrentUserOwner = req.user && carfind.user && carfind.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(carfind);
};

/**
 * Update a Carfind
 */
exports.update = function(req, res) {
  var carfind = req.carfind ;

  carfind = _.extend(carfind , req.body);

  carfind.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carfind);
    }
  });
};

/**
 * Delete an Carfind
 */
exports.delete = function(req, res) {
  var carfind = req.carfind ;

  carfind.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carfind);
    }
  });
};

/**
 * List of Carfinds
 */
exports.list = function(req, res) { 
  Carfind.find().sort('-created').populate('user', 'displayName').exec(function(err, carfinds) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carfinds);
    }
  });
};

/**
 * Carfind middleware
 */
exports.carfindByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Carfind is invalid'
    });
  }

  Carfind.findById(id).populate('user', 'displayName').exec(function (err, carfind) {
    if (err) {
      return next(err);
    } else if (!carfind) {
      return res.status(404).send({
        message: 'No Carfind with that identifier has been found'
      });
    }
    req.carfind = carfind;
    next();
  });
};
