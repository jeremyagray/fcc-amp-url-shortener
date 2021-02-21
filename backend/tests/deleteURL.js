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
let goodURLs = [...fixtureURLs];

const badInputs = [
  true,
  false,
  null,
  {},
  'test',
  undefined
];

describe('DELETE /api/shorturl/:num delete', async function() {
  beforeEach('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    // eslint-disable-next-line security/detect-object-injection
    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const urlObj = await createURL({'url': goodURLs[i].url});
      // eslint-disable-next-line security/detect-object-injection
      goodURLs[i].num = urlObj.num;
    }

    return;
  });

  afterEach('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should delete undeleted URLs', async function() {
    try {
      // eslint-disable-next-line security/detect-object-injection
      for (let i = 0; i < goodURLs.length; i++) {
        const response = await chai.request(server)
        // eslint-disable-next-line security/detect-object-injection
          .delete(`/api/shorturl/${goodURLs[i].num}`);

        expect(response).to.have.status(200);
        expect(response).to.have.json;
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('message');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body).to.have.property('message').eql(`${goodURLs[i].num} deleted`);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});

describe('DELETE /api/shorturl/:num undelete', async function() {
  beforeEach('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    // eslint-disable-next-line security/detect-object-injection
    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const urlObj = await createURL({'url': goodURLs[i].url, 'deleted': true});
      // eslint-disable-next-line security/detect-object-injection
      goodURLs[i].num = urlObj.num;
    }

    return;
  });

  afterEach('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should undelete deleted URLs', async function() {
    try {
      for (let i = 0; i < goodURLs.length; i++) {
        const response = await chai.request(server)
        // eslint-disable-next-line security/detect-object-injection
          .delete(`/api/shorturl/${goodURLs[i].num}`);

        expect(response).to.have.status(200);
        expect(response).to.have.json;
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('message');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body).to.have.property('message').eql(`${goodURLs[i].num} undeleted`);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('should fail on bad input', async function() {
    try {
      for (let i = 0; i < badInputs.length; i++) {
        const response = await chai.request(server)
        // eslint-disable-next-line security/detect-object-injection
          .delete(`/api/shorturl/${badInputs[i]}`);

        console.log(response.body);
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
