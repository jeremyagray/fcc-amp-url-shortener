/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const server = require('../server.js');
const URL = require('../models/url.js');

describe('POST /api/shorturl/new', async function() {
  const goodURLs = [
    'https://www.google.com/',
    'https://www.cnn.com/',
    'https://www.freecodecamp.org/',
    'http://www.grayfarms.org/',
    'http://www.grayfarms.org/news/',
    'ftp://www.gentoo.org/',
  ];

  const noProtocolURLs = [
    'www.google.com/',
    'www.cnn.com/',
    'www.freecodecamp.org/',
    'www.grayfarms.org/',
    'www.gentoo.org/',
  ];

  const malformedURLs = [
    'htp://www.google.com/',
    'htps://www.google.com/',
    'http:/www.google.com/',
    'http/:/www.google.com/',
    'ftp:/www.gentoo.org/',
    'http://www.example.invalid/',
  ];

  const nonURLs = [
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
  ];

  beforeEach('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  afterEach('destroy the newURL test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should save good URLs', async function() {
    try {
      goodURLs.forEach(async function(url, index) {
        const response = await chai.request(server)
          .post('/api/shorturl/new')
          .send({'url': url});

        expect(response).to.have.status(200);
        expect(response).to.have.json;
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('original_url');
        expect(response.body).to.have.property('original_url')
          .eql(url);
        expect(response.body).to.have.property('short_url');
        expect(response.body).to.have.property('short_url').eql(index + 1);
      });

    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('should return an error on URLs without a protocol', async function() {
    try {
      noProtocolURLs.forEach(async function(url) {
        const response = await chai.request(server)
          .post('/api/shorturl/new')
          .send({'url': url});

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

  it('should return an error on malformed URLs', async function() {
    try {
      malformedURLs.forEach(async function(url) {
        const response = await chai.request(server)
          .post('/api/shorturl/new')
          .send({'url': url});

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

  it('should return an error on non-URLs', async function() {
    try {
      nonURLs.forEach(async function(url) {
        const response = await chai.request(server)
          .post('/api/shorturl/new')
          .send({'url': url});

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
