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

exports.getURL = async function(request, response) {
  let num = parseInt(request.params.num);

  const urlModel = URL();

  try {
    const url = await urlModel.findOne({'num': num}).exec();

    // Redirect to the found URL.
    return response.redirect(url.url);
  } catch {
    return response.json({'error': 'invalid URL'});
  }
};

exports.newURL = async function(request, response) {
  // Get the URL.
  let url = request.body.url;
  console.log(`url:  ${request.body.url}`);

  // DNS fails with protocol prefix.
  let host;
  if (/:\/\//.test(url)) {
    [, host] = url.split('://');
  } else {
    // Edge case at best, since validation should block any URLs
    // without a valid protocol.
    // console.log('should not fail here');
    return response.json({'error': 'invalid URL'});
  }

  // Split route from host.
  // console.log(`host:  ${host}`);
  [host,] = host.split(/\/(.*)/);
  // console.log(`host:  ${host}`);

  try {
    await lookup(host);
    try {
    // Good URL; store it in the database and report the shortened version.
      const urlModel = URL();
      const shortURL = await urlModel.create({'url': url});

      return response
        .json({
          'original_url': url,
          'short_url': shortURL.num
        });
    } catch {
      // console.log('mongoDB failure');
      return response
        .status(500)
        .json({
          'error': 'server error'
        });
    }
  } catch {
    // Bad host; report back.
    console.log('dns failure');
    return response.json({'error': 'invalid URL'});
  }
};
