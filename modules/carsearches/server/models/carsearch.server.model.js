'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Carsearch Schema
 */
var CarsearchSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Carsearch name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Carsearch', CarsearchSchema);
