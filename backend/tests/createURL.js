/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const chai = require('chai');
const expect = chai.expect;

const URL = require('../models/url.js');
const {createURL} = require('../controllers/url.js');

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

describe('createURL', async function() {
  beforeEach('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  afterEach('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should create good URLs without titles', async function() {
    try {
      for (let i = 0; i < goodURLs.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        const urlObj = await createURL({'url': goodURLs[i].url});

        expect(urlObj).to.be.a('object');
        expect(urlObj).to.have.property('url');
        // eslint-disable-next-line security/detect-object-injection
        expect(urlObj).to.have.property('url').eql(goodURLs[i].url);
        expect(urlObj).to.have.property('protocol');
        // eslint-disable-next-line security/detect-object-injection
        expect(urlObj).to.have.property('protocol').eql(goodURLs[i].protocol);
        expect(urlObj).to.have.property('title');
        // eslint-disable-next-line security/detect-object-injection
        expect(urlObj).to.have.property('title').eql(goodURLs[i].url);
        expect(urlObj).to.have.property('num');
        expect(urlObj).to.have.property('createdAt');
        expect(urlObj).to.have.property('updatedAt');
        expect(urlObj).to.have.property('lastVisitAt');
        expect(urlObj).to.have.property('visits');
        expect(urlObj).to.have.property('visits').eql(0);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('should create good URLs with titles', async function() {
    try {
      for (let i = 0; i < goodURLs.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        const urlObj = await createURL({'url': goodURLs[i].url, 'title': goodURLs[i].title});

        expect(urlObj).to.be.a('object');
        expect(urlObj).to.have.property('url');
        // eslint-disable-next-line security/detect-object-injection
        expect(urlObj).to.have.property('url').eql(goodURLs[i].url);
        expect(urlObj).to.have.property('protocol');
        // eslint-disable-next-line security/detect-object-injection
        expect(urlObj).to.have.property('protocol').eql(goodURLs[i].protocol);
        expect(urlObj).to.have.property('title');
        // eslint-disable-next-line security/detect-object-injection
        expect(urlObj).to.have.property('title').eql(goodURLs[i].title);
        expect(urlObj).to.have.property('num');
        expect(urlObj).to.have.property('createdAt');
        expect(urlObj).to.have.property('updatedAt');
        expect(urlObj).to.have.property('lastVisitAt');
        expect(urlObj).to.have.property('visits');
        expect(urlObj).to.have.property('visits').eql(0);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
