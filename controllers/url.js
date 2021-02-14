/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

// Ye gods.  Can't we just do promises yet?
const dns = require('dns');
const util = require('util');
const lookup = util.promisify(dns.lookup);

const URL = require('../models/url.js');
const logger = require('../middleware/logger.js');

exports.getURL = async function(request, response) {
  let num = parseInt(request.params.num);
  logger.debug(`request:  GET /api/shorturl/${num}}`);

  const urlModel = URL();

  try {
    const url = await urlModel.findOne({'num': num}).exec();

    logger.debug(`GET /api/shorturl/${num} found ${url}`);
    // Redirect to the found URL.
    return response.redirect(url.url);
  } catch {
    logger.debug(`GET /api/shorturl/${num} could not find URL`);
    return response.json({'error': 'invalid URL'});
  }
};

exports.newURL = async function(request, response) {
  // Get the URL.
  let url = request.body.url;
  logger.debug(`POST /api/shorturl url = ${url}`);

  // DNS fails with protocol prefix.
  let host;
  if (/:\/\//.test(url)) {
    [, host] = url.split('://');
  } else {
    // Edge case at best, since validation should block any URLs
    // without a valid protocol.
    logger.debug(`POST /api/shorturl ${url} is invalid and should have been caught by validation`);
    return response.json({'error': 'invalid URL'});
  }

  // Split route from host.
  logger.debug(`POST /api/shorturl ${url} host without protocol:  ${host}`);
  [host,] = host.split(/\/(.*)/);
  logger.debug(`POST /api/shorturl ${url} host without route:  ${host}`);

  try {
    await lookup(host);
    try {
    // Good URL; store it in the database and report the shortened version.
      const urlModel = URL();
      const shortURL = await urlModel.create({'url': url});

      logger.debug(`POST /api/shorturl response:  { 'original_url': ${url}, 'short_url': ${shortURL.num} }`);
      return response
        .json({
          'original_url': url,
          'short_url': shortURL.num
        });
    } catch {
      logger.error(`POST /api/shorturl failed to create document for URL ${url}`);
      return response
        .status(500)
        .json({
          'error': 'server error'
        });
    }
  } catch {
    // Bad host; report back.
    logger.debug(`POST /api/shorturl dns.lookup(${host}) failed`);
    return response.json({'error': 'invalid URL'});
  }
};
