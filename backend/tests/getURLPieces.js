/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const chai = require('chai');
const expect = chai.expect;

const {
  getURLPieces,
  getURLHost,
  getURLProtocol,
  getURLRoute,
} = require('../controllers/url.js');

const goodURLs = [
  {
    'url': 'https://www.freecodecamp.org/',
    'protocol': 'https',
    'host': 'www.freecodecamp.org',
    'route': ''
  },
  {
    'url': 'https://www.freecodecamp.org/learn',
    'protocol': 'https',
    'host': 'www.freecodecamp.org',
    'route': 'learn'
  },
  {
    'url': 'https://www.apple.com/',
    'protocol': 'https',
    'host': 'www.apple.com',
    'route': ''
  },
  {
    'url': 'https://www.apple.com/test/one',
    'protocol': 'https',
    'host': 'www.apple.com',
    'route': 'test/one'
  },
  {
    'url': 'https://www.amazon.com/',
    'protocol': 'https',
    'host': 'www.amazon.com',
    'route': ''
  },
  {
    'url': 'https://www.amazon.com/test/one/two',
    'protocol': 'https',
    'host': 'www.amazon.com',
    'route': 'test/one/two'
  },
  {
    'url': 'https://www.netflix.com/',
    'protocol': 'https',
    'host': 'www.netflix.com',
    'route': ''
  },
  {
    'url': 'https://www.netflix.com/test/one/two/three',
    'protocol': 'https',
    'host': 'www.netflix.com',
    'route': 'test/one/two/three'
  },
  {
    'url': 'https://www.google.com/',
    'protocol': 'https',
    'host': 'www.google.com',
    'route': ''
  },
  {
    'url': 'https://www.google.com/test?one=two',
    'protocol': 'https',
    'host': 'www.google.com',
    'route': 'test?one=two'
  }
];

const badProtocols = [
  'xyz://www.freecodecamp.org/',
  'abc://www.apple.com/',
  '123://www.amazon.com/'
];

const badInputs = [
  'https//www.netflix.com/',
  'https:/www.google.com/',
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

describe('getURLPieces', function() {
  it('should return protocol, host, and optional route on good URLs', async function() {
    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const [protocol, host, route] = getURLPieces(goodURLs[i].url);
      // eslint-disable-next-line security/detect-object-injection
      expect(protocol, `${goodURLs[i].url} protocol check failed: got ${protocol} but expected ${goodURLs[i].protocol}`).to.be.eql(goodURLs[i].protocol);
      // eslint-disable-next-line security/detect-object-injection
      expect(host, `${goodURLs[i].url} host check failed: got ${host} but expected ${goodURLs[i].host}`).to.be.eql(goodURLs[i].host);
      // eslint-disable-next-line security/detect-object-injection
      expect(route, `${goodURLs[i].url} route check failed: got ${route} but expected ${goodURLs[i].route}`).to.be.eql(goodURLs[i].route);
    }
  });

  it('should throw ProtocolError on bad protocol', async function() {
    for (let i = 0; i < badProtocols.length; i++) {
      const fn = function () {
        // eslint-disable-next-line security/detect-object-injection
        getURLPieces(badProtocols[i]);
      };
      expect(fn).to.throw('is not a valid protocol (http,https,ftp).');
    }
  });

  it('should throw URLError on bad inputs', async function() {
    for (let i = 0; i < badInputs.length; i++) {
      const fn = function () {
        // eslint-disable-next-line security/detect-object-injection
        getURLPieces(badInputs[i]);
      };
      expect(fn).to.throw(' is not a valid url.');
    }
  });
});

describe('getURLProtocol', function() {
  it('should return protocol on good URLs', async function() {
    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const protocol = getURLProtocol(goodURLs[i].url);
      // eslint-disable-next-line security/detect-object-injection
      expect(protocol, `${goodURLs[i].url} protocol check failed: got ${protocol} but expected ${goodURLs[i].protocol}`).to.be.eql(goodURLs[i].protocol);
    }
  });

  it('should throw ProtocolError on bad protocol', async function() {
    for (let i = 0; i < badProtocols.length; i++) {
      const fn = function () {
        // eslint-disable-next-line security/detect-object-injection
        getURLProtocol(badProtocols[i]);
      };
      expect(fn).to.throw('is not a valid protocol (http,https,ftp).');
    }
  });

  it('should throw URLError on bad inputs', async function() {
    for (let i = 0; i < badInputs.length; i++) {
      const fn = function () {
        // eslint-disable-next-line security/detect-object-injection
        getURLProtocol(badInputs[i]);
      };
      expect(fn).to.throw(' is not a valid url.');
    }
  });
});

describe('getURLHost', function() {
  it('should return host on good URLs', async function() {
    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const host = getURLHost(goodURLs[i].url);
      // eslint-disable-next-line security/detect-object-injection
      expect(host, `${goodURLs[i].url} host check failed: got ${host} but expected ${goodURLs[i].host}`).to.be.eql(goodURLs[i].host);
    }
  });

  it('should throw ProtocolError on bad protocol', async function() {
    for (let i = 0; i < badProtocols.length; i++) {
      const fn = function () {
        // eslint-disable-next-line security/detect-object-injection
        getURLHost(badProtocols[i]);
      };
      expect(fn).to.throw('is not a valid protocol (http,https,ftp).');
    }
  });

  it('should throw URLError on bad inputs', async function() {
    for (let i = 0; i < badInputs.length; i++) {
      const fn = function () {
        // eslint-disable-next-line security/detect-object-injection
        getURLHost(badInputs[i]);
      };
      expect(fn).to.throw(' is not a valid url.');
    }
  });
});

describe('getURLRoute', function() {
  it('should return optional route on good URLs', async function() {
    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      const route = getURLRoute(goodURLs[i].url);
      // eslint-disable-next-line security/detect-object-injection
      expect(route, `${goodURLs[i].url} route check failed: got ${route} but expected ${goodURLs[i].route}`).to.be.eql(goodURLs[i].route);
    }
  });

  it('should throw ProtocolError on bad protocol', async function() {
    for (let i = 0; i < badProtocols.length; i++) {
      const fn = function () {
        // eslint-disable-next-line security/detect-object-injection
        getURLRoute(badProtocols[i]);
      };
      expect(fn).to.throw('is not a valid protocol (http,https,ftp).');
    }
  });

  it('should throw URLError on bad inputs', async function() {
    for (let i = 0; i < badInputs.length; i++) {
      const fn = function () {
        // eslint-disable-next-line security/detect-object-injection
        getURLRoute(badInputs[i]);
      };
      expect(fn).to.throw(' is not a valid url.');
    }
  });
});
