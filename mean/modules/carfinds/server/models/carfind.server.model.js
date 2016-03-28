'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Carfind Schema
 */
var CarfindSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Carfind name',
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

mongoose.model('Carfind', CarfindSchema);
