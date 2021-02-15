/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const express = require('express');
const router = express.Router();

const logger = require('../middleware/logger.js');

// Hello API endpoint. 
router.get('', (request, response) => {
  logger.debug('GET /api/hello:  Hello!');
  return response
    .status(200)
    .json({
      'message': 'Hello from the FCC AMP URL Shortener API.'
    });
});

module.exports = router;
