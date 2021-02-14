/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const chaiDate = require('chai-datetime');

chai.use(chaiDate);
chai.use(chaiHttp);

const server = require('../server.js');
const URL = require('../models/url.js');

describe('GET /api/shorturl/:num', async function() {
  const goodURLs = [
    'https://www.google.com/',
    'https://www.cnn.com/',
    'https://www.freecodecamp.org/',
    'http://www.grayfarms.org/',
  ];

  before('add some test URLs', async function() {
    const urlModel = URL();
    goodURLs.forEach(async function(url) {
      await urlModel.create({'url': url});
    });

    return;
  });

  after('destroy the getURL test database', async function() {
    await URL().deleteMany().exec();

    return;
  });

  it('should redirect to the correct URL', async function() {
    try {
      goodURLs.forEach(async function(url, index) {
        const response = await chai.request(server)
          .get(`/api/shorturl/${index + 1}`);

        expect(response).to.have.status(302);
        expect(response.header['location']).to.be.eql(url);
      });

    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('should return an error with invalid input', async function() {
    try {
      const inputs = [
        100,
        '100',
        true,
        false,
        null,
        [],
        {},
        '',
        '   ',
        'test',
        'https://www.google.com/',
      ];

      inputs.forEach(async function(input) {
        const response = await chai.request(server)
          .get(`/api/shorturl/${input}`);

        expect(response).to.be.json;
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('error');
        expect(response.body).to.have.property('error')
          .eql('invalid URL');
      });

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
