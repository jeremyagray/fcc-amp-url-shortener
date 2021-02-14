/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const {check, validationResult} = require('express-validator');

// Validation error handlers.  Reuse everywhere.
exports.validationErrorReporterJSON = function(request, response, next) {
  // Grab errors.
  const errors = validationResult(request);

  if (request.params.num) {
    console.log(`num:  ${request.params.num}`);
  } else {
    console.log('num:  no number');
  }

  if (request.body.url) {
    console.log(`url:  ${request.body.url}`);
  } else {
    console.log('url:  no URL');
  }

  // Bail on errors.
  if (! errors.isEmpty()) {
    return response
      .json({'error': 'invalid URL'});
  }

  // Continue if no errors.
  next();
};

// Validation rules.
exports.validateNumber = [
  check('num')
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isInt({'min': 1})
    .withMessage('`num` should be a number.')
];

exports.validateURL = [
  check('url')
    .notEmpty()
    .stripLow(true)
    .trim()
    .isURL({'require_valid_protocol': true})
    .withMessage('`url` should be a valid URL.')
];
