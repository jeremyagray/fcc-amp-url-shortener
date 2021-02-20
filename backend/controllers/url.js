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
  logger.debug(`request:  GET /api/shorturl/${request.params.num}`);

  const urlModel = URL();

  try {
    const filter = {'num': request.params.num};
    const update = {
      '$inc': {
        'visits': 1
      },
      'lastVisitAt': Date.now()
    };
    const options = {
      'new': true
    };

    const url = await urlModel.findOneAndUpdate(filter, update, options).exec();

    logger.debug(`GET /api/shorturl/${request.params.num} found ${url}`);

    // Set the number of visits in the header.
    response.set('visits', url.visits);
    // Redirect to the found URL.
    return response.redirect(url.url);
  } catch {
    logger.debug(`GET /api/shorturl/${request.params.num} could not find URL`);
    return response.json({'error': 'invalid URL'});
  }
};

exports.getAll = async function(request, response) {
  logger.debug('request:  GET /api/shorturl/all');

  const urlModel = URL();

  try {
    const urls = await urlModel.find({}).sort({'num': 1}).exec();
    let responseJSON = [];

    urls.forEach((url) => {
      responseJSON.push({
        'original_url': url.url,
        'short_url': url.num
      });
    });

    return response.json(responseJSON);
  } catch {
    logger.debug('GET /api/shorturl/all failed to return documents');
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

exports.newURL = async function(request, response) {
  logger.debug(`POST /api/shorturl/new ${request.body.url}`);

  // DNS fails with protocol prefix.
  let protocol, host;
  if (/:\/\//.test(request.body.url)) {
    [protocol, host] = request.body.url.split('://');
  } else {
    // Edge case at best, since validation should block any URLs
    // without a valid protocol.
    logger.debug(`POST /api/shorturl/new ${request.body.url} is invalid and should have been caught by validation`);
    return response.json({'error': 'invalid URL'});
  }

  // Check if shortened URL already exists.
  const urlModel = URL();

  try {
    const existingURL = await urlModel.findOne({'url': request.body.url}).exec();

    if (existingURL) {
      logger.debug(`POST /api/shorturl/new found existing ${request.body.url}:  ${existingURL.num}`);
      // Return the existing URL.
      return response
        .json({
          'original_url': existingURL.url,
          'short_url': existingURL.num,
          'url': existingURL.url,
          'num': existingURL.num,
          'protocol': existingURL.protocol,
          'title': existingURL.title || existingURL.url,
          'createdAt': existingURL.createdAt,
          'updatedAt': existingURL.updatedAt,
          'lastVisitAt': existingURL.lastVisitAt,
          'visits': existingURL.visits
        });
    }
  } catch(error) {
    logger.error(`POST /api/shorturl/new ${request.body.url}:  ${error.message}`);
  }

  // Split route from host.
  logger.debug(`POST /api/shorturl/new ${request.body.url} host without protocol:  ${host}`);
  [host,] = host.split(/\/(.*)/);
  logger.debug(`POST /api/shorturl/new ${request.body.url} host without route:  ${host}`);

  try {
    await lookup(host);
    try {
      // Good URL; store it in the database and report the shortened version.
      const shortURL = await urlModel.create({
        'url': request.body.url,
        'protocol': protocol,
        'title': request.body.title,
        'updatedAt': Date.now(),
        'lastVisitAt': Date.now()
      });

      logger.debug(`POST /api/shorturl/new response:  { 'original_url': ${shortURL.url}, 'short_url': ${shortURL.num} }`);
      return response
        .json({
          'original_url': shortURL.url,
          'short_url': shortURL.num,
          'url': shortURL.url,
          'num': shortURL.num,
          'protocol': shortURL.protocol,
          'title': shortURL.title || shortURL.url,
          'createdAt': shortURL.createdAt,
          'updatedAt': shortURL.updatedAt,
          'lastVisitAt': shortURL.lastVisitAt,
          'visits': shortURL.visits
        });
    } catch {
      logger.error(`POST /api/shorturl/new failed to create document for URL ${request.body.url}`);
      return response
        .status(500)
        .json({
          'error': 'server error'
        });
    }
  } catch(error) {
    // Bad host; report back.
    logger.debug(`POST /api/shorturl/new dns.lookup(${host}) failed`);
    logger.debug(`POST /api/shorturl/new errno:  ${error.errno} code:  ${error.code}`);
    return response.json({'error': 'invalid URL'});
  }
};
