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
const {createURL} = require('../controllers/url.js');

// Fixtures.
const {fixtureURLs} = require('./fixtures.js');

describe('GET /api/shorturl/:num not deleted', async function() {
  let goodURLs = [...fixtureURLs];
  
  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const response = await createURL({'url': goodURLs[i].url});

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

describe('GET /api/shorturl/:num deleted', async function() {
  let goodURLs = [...fixtureURLs];
  
  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const response = await createURL({'url': goodURLs[i].url, 'deleted': true});
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

  it('should fail on deleted URLs', async function() {
    try {
      for (let i = 0; i < goodURLs.length; i++) {
        const response = await chai.request(server)
        // eslint-disable-next-line security/detect-object-injection
          .get(`/api/shorturl/${goodURLs[i].num}`);

        expect(response).to.have.status(400);
        expect(response).to.be.json;
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('error');
        expect(response.body).to.have.property('error').eql('invalid URL');
      }

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
