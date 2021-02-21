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

chai.use(chaiHttp);
chai.use(chaiDate);

const server = require('../server.js');
const URL = require('../models/url.js');
const {createURL} = require('../controllers/url.js');

describe('POST /api/shorturl/new', async function() {
  const goodURLs = [
    {
      'url': 'https://www.google.com/',
      'protocol': 'https',
      'title': 'Google'
    },
    {
      'url': 'https://www.cnn.com/',
      'protocol': 'https',
      'title': 'CNN'
    },
    {
      'url': 'https://www.freecodecamp.org/',
      'protocol': 'https',
      'title': 'freeCodeCamp'
    },
    {
      'url': 'http://www.grayfarms.org/',
      'protocol': 'http',
      'title': 'Gray Farms'
    },
    {
      'url': 'http://www.grayfarms.org/news/',
      'protocol': 'http',
      'title': 'Gray Farms:  News'
    },
    {
      'url': 'ftp://www.gentoo.org/',
      'protocol': 'ftp',
      'title': 'Gentoo FTP'
    },
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
    undefined
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

  it('should save good URLs without titles', async function() {
    try {
      for (let i = 0; i < goodURLs.length; i++) {
        const response = await chai.request(server)
          .post('/api/shorturl/new')
        // eslint-disable-next-line security/detect-object-injection
          .send({'url': goodURLs[i].url});

        expect(response).to.have.status(200);
        expect(response).to.have.json;
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('original_url');
        expect(response.body).to.have.property('original_url')
        // eslint-disable-next-line security/detect-object-injection
          .eql(goodURLs[i].url);
        expect(response.body).to.have.property('short_url');
        expect(response.body).to.have.property('url');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body).to.have.property('url').eql(goodURLs[i].url);
        expect(response.body).to.have.property('num');
        expect(response.body).to.have.property('protocol');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body).to.have.property('protocol').eql(goodURLs[i].protocol);
        expect(response.body).to.have.property('title');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body).to.have.property('title').eql(goodURLs[i].url);

        const now = new Date();

        expect(response.body).to.have.property('createdAt');
        const created = new Date(response.body.createdAt);
        expect(created).to.be.closeToTime(now, 5);

        expect(response.body).to.have.property('updatedAt');
        const updated = new Date(response.body.updatedAt);
        expect(updated).to.be.closeToTime(now, 5);
        expect(updated).to.be.afterOrEqualTime(created);

        expect(response.body).to.have.property('lastVisitAt');
        const lastVisit = new Date(response.body.lastVisitAt);
        expect(lastVisit).to.be.closeToTime(now, 5);
        expect(lastVisit).to.be.afterOrEqualTime(created);

        expect(response.body).to.have.property('visits');
        expect(response.body).to.have.property('visits').eql(0);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('should save good URLs with titles', async function() {
    try {
      for (let i = 0; i < goodURLs.length; i++) {
        const response = await chai.request(server)
          .post('/api/shorturl/new')
        // eslint-disable-next-line security/detect-object-injection
          .send({'url': goodURLs[i].url, 'title': goodURLs[i].title});

        expect(response).to.have.status(200);
        expect(response).to.have.json;
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('original_url');
        expect(response.body).to.have.property('original_url')
        // eslint-disable-next-line security/detect-object-injection
          .eql(goodURLs[i].url);
        expect(response.body).to.have.property('short_url');
        expect(response.body).to.have.property('url');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body).to.have.property('url').eql(goodURLs[i].url);
        expect(response.body).to.have.property('num');
        expect(response.body).to.have.property('protocol');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body).to.have.property('protocol').eql(goodURLs[i].protocol);
        expect(response.body).to.have.property('title');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body).to.have.property('title').eql(goodURLs[i].title);

        const now = new Date();

        expect(response.body).to.have.property('createdAt');
        const created = new Date(response.body.createdAt);
        expect(created).to.be.closeToTime(now, 10);

        expect(response.body).to.have.property('updatedAt');
        const updated = new Date(response.body.updatedAt);
        expect(updated).to.be.closeToTime(now, 10);
        expect(updated).to.be.afterOrEqualTime(created);

        expect(response.body).to.have.property('lastVisitAt');
        const lastVisit = new Date(response.body.lastVisitAt);
        expect(lastVisit).to.be.closeToTime(now, 10);
        expect(lastVisit).to.be.afterOrEqualTime(created);

        expect(response.body).to.have.property('visits');
        expect(response.body).to.have.property('visits').eql(0);
      }
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

  it('should add URLs only once', async function() {
    try {
      // eslint-disable-next-line security/detect-object-injection
      // const urlObj = await createURL({'url': goodURLs[i].url});
      const urlObj = await createURL({'url': 'https://www.google.com/'});

      const response = await chai.request(server)
        .post('/api/shorturl/new')
        .send({'url': 'https://www.google.com/'});

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('original_url');
      expect(response.body).to.have.property('original_url').eql(urlObj.url);
      expect(response.body).to.have.property('short_url');
      expect(response.body).to.have.property('short_url').eql(urlObj.num);
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
