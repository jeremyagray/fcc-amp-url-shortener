/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

exports.getNow = function(request, response) {
  let now = new Date;

  return response
    .status(200)
    .json({
      'unix': now.valueOf(),
      'utc': now.toUTCString()
    });
};

exports.getDateString = function(request, response) {
  let now;

  if (/^\d+$/.test(request.params.date_string)
      && ! isNaN(parseInt(request.params.date_string))) {
    now = new Date(parseInt(request.params.date_string));
  } else {
    now = new Date(request.params.date_string);
  }

  if (now.toString() === 'Invalid Date') {
    // FCC tests fail on status 400.
    return response
      // .status(400)
      .json({
        'error': 'Invalid Date'
      });
  } else {

    return response
      .status(200)
      .json({
        'unix': now.valueOf(),
        'utc': now.toUTCString()
      });
  }
};
