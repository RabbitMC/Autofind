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
  type: {
    type: String,
    default: 'used',
    trim: true
  },
 make: {
    type: String,
    default: '',
    trim: true,
    required: 'Choose a make' 
  },
  model: {
    type: String,
    default: '',
    trim: true,
    required: 'Choose a model' 
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true,
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
