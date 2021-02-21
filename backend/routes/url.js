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

router.get('/visible',
  urlController.getVisible
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

router.delete('/:num',
  validation.validateNumber,
  validation.validationErrorReporterJSON,
  urlController.deleteURL
);

module.exports = router;
