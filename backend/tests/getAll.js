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

describe('GET /api/shorturl/all', async function() {
  const goodURLs = [
    'https://www.google.com/',
    'https://www.cnn.com/',
    'https://www.freecodecamp.org/',
    'http://www.grayfarms.org/',
  ];

  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    // let protocol;
    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      await createURL({'url': goodURLs[i]});
    }

    return;
  });

  after('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should list the correct URLs', async function() {
    try {
      const response = await chai.request(server)
        .get('/api/shorturl/all');
      let returnedURLs = [];

      response.body.forEach(function(obj) {
        returnedURLs.push(obj.original_url);
      });
      expect(response).to.have.status(200);
      expect(response.body).to.be.a('array');
      expect(returnedURLs.length).to.be.equal(goodURLs.length);
      expect(returnedURLs.sort()).to.be.eql(goodURLs.sort());
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
