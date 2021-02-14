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

  // Bail on errors.
  // FCC tests fail on status 400.
  if (! errors.isEmpty()) {
    return response
      // .status(400)
      .json({'error': 'Invalid Date'});
  }

  // Continue if no errors.
  next();
};

// Validation rules.
exports.validateDateString = [
  check('date_string')
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .withMessage('date_string should be a string parseable by new Date(date_string).')
];
