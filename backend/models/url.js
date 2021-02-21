/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Create a URL schema and model.
const urlSchema = new mongoose.Schema(
  {
    'url': {
      'type': String,
      'required': true
    },
    'protocol': {
      'type': String,
      'required': true,
      'enum': [
        'ftp',
        'http',
        'https'
      ]
    },
    'title': {
      'type': String
    },
    'createdAt': {
      'type': Date,
      'required': true,
      'immutable': true,
      'default': Date.now()
    },
    'updatedAt': {
      'type': Date,
      'required': true
    },
    'lastVisitAt': {
      'type': Date,
      'required': true
    },
    'visits': {
      'type': Number,
      'required': true,
      'default': 0,
      'min': 0
    },
    'deleted': {
      'type': Boolean,
      'required': true,
      'default': false
    }
  });

urlSchema.plugin(AutoIncrement, {'inc_field': 'num'});

function urlModel() {
  return mongoose.model('URL', urlSchema);
}

module.exports = urlModel;
