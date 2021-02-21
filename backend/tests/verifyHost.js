/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const chai = require('chai');
const expect = chai.expect;
// const chaiHttp = require('chai-http');

// chai.use(chaiHttp);

const {verifyHost} = require('../controllers/url.js');

const goodHosts = [
  'https://www.freecodecamp.org/',
  'https://www.apple.com/',
  'https://www.amazon.com/',
  'https://www.netflix.com/',
  'https://www.google.com/',
];

const goodHostsWithRoutes = [
  'https://www.freecodecamp.org/learn',
  'https://www.apple.com/test',
  'https://www.amazon.com/test',
  'https://www.netflix.com/test',
  'https://www.google.com/test',
];

const fakeHosts = [
  'https://www.freecodecamp.invalid/',
  'https://www.apple.invalid/',
  'https://www.amazon.invalid/',
  'https://www.netflix.invalid/',
  'https://www.google.invalid/',
];

const badProtocols = [
  'xyz://www.freecodecamp.org/',
  'abc://www.apple.com/',
  '123://www.amazon.com/',
  'https//www.netflix.com/',
  'https:/www.google.com/',
];

const badInputs = [
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
  undefined,
  NaN
];

describe('verifyHost', function() {
  it('should verify good hosts', async function() {
    for (let i = 0; i < goodHosts.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      expect(await verifyHost(goodHosts[i])).to.be.true;
    }
  });

  it('should verify good hosts with routes', async function() {
    for (let i = 0; i < goodHostsWithRoutes.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      expect(await verifyHost(goodHostsWithRoutes[i])).to.be.true;
    }
  });

  it('should not verify invalid hosts', async function() {
    for (let i = 0; i < fakeHosts.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      // eslint-disable-next-line security/detect-object-injection
      expect(await verifyHost(fakeHosts[i])).to.be.false;
    }
  });

  it('should not verify hosts with invalid protocols', async function() {
    for (let i = 0; i < badProtocols.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      expect(await verifyHost(badProtocols[i])).to.be.false;
    }
  });

  it('should not verify bad input', async function() {
    for (let i = 0; i < badInputs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      expect(await verifyHost(badInputs[i])).to.be.false;
    }
  });
});
