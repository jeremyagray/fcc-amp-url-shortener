/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const chai = require('chai');
const expect = chai.expect;

const {createURL, isShortURL} = require('../controllers/url.js');
const URL = require('../models/url.js');

const ins = [
  'https://www.freecodecamp.org/',
  'https://www.apple.com/',
  'https://www.amazon.com/',
  'https://www.netflix.com/',
  'https://www.google.com/',
];

const outs = [
  'https://www.freecodecamp.invalid/',
  'https://www.apple.invalid/',
  'https://www.amazon.invalid/',
  'https://www.netflix.invalid/',
  'https://www.google.invalid/',
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

describe('isShortURL', function() {
  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    for (let i = 0; i < ins.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      await createURL({'url': ins[i]});
    }

    return;
  });

  after('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should be truthy for existing URLs', async function() {
    for (let i = 0; i < ins.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      expect(await isShortURL(ins[i])).to.be.ok;
    }
  });

  it('should be falsy for non-existing URLs', async function() {
    for (let i = 0; i < outs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      expect(await isShortURL(outs[i])).to.be.not.ok;
    }
  });

  it('should return false for bad input', async function() {
    for (let i = 0; i < badInputs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      expect(await isShortURL(badInputs[i])).to.be.false;
    }
  });
});
