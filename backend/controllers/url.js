/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

// DNS with promises.  Yay!
const dns = require('dns').promises;

const URL = require('../models/url.js');
const logger = require('../middleware/logger.js');

/*
 * Constants.
 *
 */

const ALLOWED_PROTOCOLS = [
  'http',
  'https',
  'ftp'
];

/*
 * Custom errors.
 *
 */

class ProtocolError extends Error {
  constructor(protocol, ...params) {
    // Call the super.
    super(...params);

    // Maintains proper stack trace.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProtocolError);
    }

    this.name = 'ProtocolError';
    this.protocol = protocol;
    this.message = `${protocol} is not a valid protocol (${ALLOWED_PROTOCOLS}).`;
    this.date = new Date();
  }
}

exports.ProtocolError;

class URLError extends Error {
  constructor(url, ...params) {
    // Call the super.
    super(...params);

    // Maintains proper stack trace.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, URLError);
    }

    this.name = 'URLError';
    this.url = url;
    this.message = `${url} is not a valid url.`;
    this.date = new Date();
  }
}

exports.URLError;

/*
 * Utility functions.
 *
 */

async function verifyHost(url) {
  try {
    if (await dns.resolve(getURLHost(url))) {
      return true;
    }
    return false;
  } catch(error) {
    if (error instanceof ProtocolError) {
      // Bad protocol.
      logger.debug(`verifyHost ${url}:  ${error.message}`);
    } else {
      // Bad host; report back.
      logger.debug(`verifyHost ${url} dns.lookup(${url}) failed; errno:  ${error.errno} code:  ${error.code}`);
    }
    return false;
  }
}

exports.verifyHost = verifyHost;

async function isShortURL(url) {
  try {
    const urlModel = URL();
    const urlObj = await urlModel.findOne({'url': url}).exec();

    if (urlObj) {
      logger.debug(`isShortURL ${url} exists:  ${urlObj.num}`);

      // Return the existing URL.
      return urlObj;
    }
    return false;
  } catch(error) {
    logger.error(`isShortURL ${url}:  ${error.message}`);
    return false;
  }
}

exports.isShortURL = isShortURL;

function getURLPieces (url) {
  if (! (url
         && typeof url === 'string'
         && url !== ''
         && /:\/\//.test(url))) {
    logger.error(`getURLProtocol failed:  invalid URL (${url})`);
    throw new URLError(url);
  }

  let protocol, host, route;

  // Split protocol.
  [protocol, host] = url.split('://');
  if (! ALLOWED_PROTOCOLS.includes(protocol)) {
    logger.error(`getURLHost ${url} invalid protocol:  ${protocol}`);
    throw new ProtocolError(protocol);
  }
  logger.debug(`getURLHost ${url} protocol:  ${protocol}`);

  // Split route.
  [host, route] = host.split(/\/(.*)/);
  logger.debug(`getURLHost ${url} host:  ${host}`);
  logger.debug(`getURLHost ${url} route:  ${route}`);

  return [protocol, host, route];
}

exports.getURLPieces = getURLPieces;

function getURLProtocol(url) {
  return getURLPieces(url)[0];
}

exports.getURLProtocol = getURLProtocol;

function getURLHost(url) {
  return getURLPieces(url)[1];
}

exports.getURLHost = getURLHost;

function getURLRoute(url) {
  return getURLPieces(url)[2];
}

exports.getURLRoute = getURLRoute;

async function createURL(urlObj) {
  if (! (urlObj
         && urlObj.url
         && typeof urlObj.url === 'string'
         && urlObj.url !== ''
         && /:\/\//.test(urlObj.url))) {
    logger.error('createURL failed:  invalid URL');
    throw new URLError(urlObj.url);
  }

  const urlModel = URL();
  let shortURL = await isShortURL(urlObj.url);

  if (shortURL) {
    // URL exists.
    logger.debug(`createURL found existing ${urlObj.url}:  ${shortURL.num}`);
    return shortURL;
  } else {
    // Create URL.
    try {
      logger.debug(`createURL created new URL ${urlObj.url}:  ${shortURL.num}`);
      return await urlModel.create({
        'url': urlObj.url,
        'protocol': getURLProtocol(urlObj.url),
        'title': urlObj.title || urlObj.url,
        'updatedAt': Date.now(),
        'lastVisitAt': Date.now()
      });
    } catch (error) {
      logger.error(`createURL ${urlObj.url} failed:  ${error.message}`);
      return;
    }
  }
}

exports.createURL = createURL;

// async function updateURL(urlObj) {
//   return;
// }

// exports.updateURL = updateURL;

/*
 * Route functions.
 *
 */

async function getURL(request, response) {
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
}

exports.getURL = getURL;

async function getAll(request, response) {
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
    logger.error('GET /api/shorturl/all failed to return documents');
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.getAll = getAll;

async function newURL(request, response) {
  logger.debug(`POST /api/shorturl/new ${request.body.url}`);

  try {
    // Verify the host and add the find/create URL.
    if (! await verifyHost(request.body.url)) {
      return response.json({'error': 'invalid URL'});
    }

    const urlObj = await createURL({
      'url': request.body.url,
      'title': request.body.title
    });

    // Return the URL.
    return response
      .json({
        'original_url': urlObj.url,
        'short_url': urlObj.num,
        'url': urlObj.url,
        'num': urlObj.num,
        'protocol': urlObj.protocol,
        'title': urlObj.title || urlObj.url,
        'createdAt': urlObj.createdAt,
        'updatedAt': urlObj.updatedAt,
        'lastVisitAt': urlObj.lastVisitAt,
        'visits': urlObj.visits
      });
  } catch(error) {
    logger.error(`POST /api/shorturl/new failed to find or create short URL for ${request.body.url}:  ${error.message}`);
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.newURL = newURL;
