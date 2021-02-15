/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const express = require('express');
const router = express.Router();

const validation = require('../middleware/validation.js');

const urlController = require('../controllers/url.js');

router.get('/all',
  urlController.getAll
);

router.post('/new',
  validation.validateURL,
  validation.validationErrorReporterJSON,
  urlController.newURL
);

router.get('/:num',
  validation.validateNumber,
  validation.validationErrorReporterJSON,
  urlController.getURL
);

module.exports = router;
