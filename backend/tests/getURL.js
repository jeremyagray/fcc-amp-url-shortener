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

describe('GET /api/shorturl/:num', async function() {
  let goodURLs = [
    {
      'url': 'https://www.google.com/',
      'num': 0,
      'protocol': 'https',
      'title': 'Google',
      'visits': 0
    },
    {
      'url': 'https://www.cnn.com/',
      'num': 0,
      'protocol': 'https',
      'title': 'CNN',
      'visits': 0
    },
    {
      'url': 'https://www.freecodecamp.org/',
      'num': 0,
      'protocol': 'https',
      'title': 'freeCodeCamp',
      'visits': 0
    },
    {
      'url': 'http://www.grayfarms.org/',
      'num': 0,
      'protocol': 'http',
      'title': 'Gray Farms',
      'visits': 0
    },
    {
      'url': 'http://www.grayfarms.org/news/',
      'num': 0,
      'protocol': 'http',
      'title': 'Gray Farms:  News',
      'visits': 0
    },
    {
      'url': 'ftp://www.gentoo.org/',
      'num': 0,
      'protocol': 'ftp',
      'title': 'Gentoo FTP',
      'visits': 0
    },
  ];
  
  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    for (let i = 0; i < goodURLs.length; i++) {
      const response = await urlModel.create({
        // eslint-disable-next-line security/detect-object-injection
        'url': goodURLs[i].url,
        // eslint-disable-next-line security/detect-object-injection
        'protocol': goodURLs[i].protocol,
        'updatedAt': Date.now(),
        'lastVisitAt': Date.now()
      });

      // console.log(response);
      // eslint-disable-next-line security/detect-object-injection
      goodURLs[i].num = response.num;
    }

    return;
  });

  after('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should redirect to the correct URL', async function() {
    try {
      for (let i = 0; i < goodURLs.length; i++) {
        const response = await chai.request(server)
        // eslint-disable-next-line security/detect-object-injection
          .get(`/api/shorturl/${goodURLs[i].num}`)
          .redirects(0)
          .send();

        // console.log(response.header);
        console.log(response);
        expect(response).to.have.status(302);
        // eslint-disable-next-line security/detect-object-injection
        expect(response.header['location']).to.be.eql(goodURLs[i].url);
        expect(parseInt(response.header['visits'])).to.be.eql(1);
      }

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
