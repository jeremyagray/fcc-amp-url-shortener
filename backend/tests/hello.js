/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const chaiDate = require('chai-datetime');

chai.use(chaiDate);
chai.use(chaiHttp);

const server = require('../server.js');

describe('GET /api/hello', async function() {
  it('says hello', async function() {
    try {
      // Hello?
      const response = await chai.request(server)
        .get('/api/hello');

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.a('object');
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('message')
        .eql('Hello from the FCC AMP URL Shortener API.');
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
