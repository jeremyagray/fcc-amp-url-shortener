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
    url: {type: String, required: true},
  });

urlSchema.plugin(AutoIncrement, {inc_field: 'num'});

function urlModel() {
  return mongoose.model('URL', urlSchema);
}

module.exports = urlModel;
