'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Carsearch = mongoose.model('Carsearch'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Carsearch
 */
exports.create = function(req, res) {
  var carsearch = new Carsearch(req.body);
  carsearch.user = req.user;

  carsearch.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carsearch);
    }
  });
};

/**
 * Show the current Carsearch
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var carsearch = req.carsearch ? req.carsearch.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  carsearch.isCurrentUserOwner = req.user && carsearch.user && carsearch.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(carsearch);
};

/**
 * Update a Carsearch
 */
exports.update = function(req, res) {
  var carsearch = req.carsearch ;

  carsearch = _.extend(carsearch , req.body);

  carsearch.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carsearch);
    }
  });
};

/**
 * Delete an Carsearch
 */
exports.delete = function(req, res) {
  var carsearch = req.carsearch ;

  carsearch.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carsearch);
    }
  });
};

/**
 * List of Carsearches
 */
exports.list = function(req, res) { 
  Carsearch.find().sort('-created').populate('user', 'displayName').exec(function(err, carsearches) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(carsearches);
    }
  });
};

/**
 * Carsearch middleware
 */
exports.carsearchByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Carsearch is invalid'
    });
  }

  Carsearch.findById(id).populate('user', 'displayName').exec(function (err, carsearch) {
    if (err) {
      return next(err);
    } else if (!carsearch) {
      return res.status(404).send({
        message: 'No Carsearch with that identifier has been found'
      });
    }
    req.carsearch = carsearch;
    next();
  });
};
