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

describe('GET /api/shorturl/all not deleted', async function() {
  let goodURLs = [...fixtureURLs];

  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      await createURL({'url': goodURLs[i].url});
    }

    return;
  });

  after('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should list all URLs', async function() {
    try {
      const response = await chai.request(server)
        .get('/api/shorturl/all');

      expect(response).to.have.status(200);
      expect(response.body.length).to.be.equal(goodURLs.length);
      expect(response.body).to.be.a('array');

      expect(response.body.map((url) => {
        return url.original_url;
      }).sort()).to.be.eql(goodURLs.map((url) => {
        return url.url;
      }).sort());

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});

describe('GET /api/shorturl/all deleted', async function() {
  let goodURLs = [...fixtureURLs];

  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      await createURL({'url': goodURLs[i].url, 'deleted': true});
    }

    return;
  });

  after('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should list all URLs', async function() {
    try {
      const response = await chai.request(server)
        .get('/api/shorturl/all');

      expect(response).to.have.status(200);
      expect(response.body.length).to.be.equal(goodURLs.length);
      expect(response.body).to.be.a('array');

      expect(response.body.map((url) => {
        return url.original_url;
      }).sort()).to.be.eql(goodURLs.map((url) => {
        return url.url;
      }).sort());

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});

describe('GET /api/shorturl/all mixed', async function() {
  let goodURLs = [...fixtureURLs];

  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});
    let del = false;

    for (let i = 0; i < goodURLs.length; i++) {
      if (Math.random() >= 0.5) {
        // Deleted.
        del = true;
      } else {
        // Not deleted.
        del = false;
      }
      // eslint-disable-next-line security/detect-object-injection
      await createURL({'url': goodURLs[i].url, 'deleted': del});
    }

    return;
  });

  after('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should list all URLs', async function() {
    try {
      const response = await chai.request(server)
        .get('/api/shorturl/all');

      expect(response).to.have.status(200);
      expect(response.body.length).to.be.equal(goodURLs.length);
      expect(response.body).to.be.a('array');

      expect(response.body.map((url) => {
        return url.original_url;
      }).sort()).to.be.eql(goodURLs.map((url) => {
        return url.url;
      }).sort());

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});

describe('GET /api/shorturl/visible not deleted', async function() {
  let goodURLs = [...fixtureURLs];

  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      await createURL({'url': goodURLs[i].url});
    }

    return;
  });

  after('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should list all URLs', async function() {
    try {
      const response = await chai.request(server)
        .get('/api/shorturl/visible');

      expect(response).to.have.status(200);
      expect(response.body.length).to.be.equal(goodURLs.length);
      expect(response.body).to.be.a('array');

      expect(response.body.map((url) => {
        return url.original_url;
      }).sort()).to.be.eql(goodURLs.map((url) => {
        return url.url;
      }).sort());

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});

describe('GET /api/shorturl/visible deleted', async function() {
  let goodURLs = [...fixtureURLs];

  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    for (let i = 0; i < goodURLs.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      await createURL({'url': goodURLs[i].url, 'deleted': true});
    }

    return;
  });

  after('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should list no URLs', async function() {
    try {
      const response = await chai.request(server)
        .get('/api/shorturl/visible');

      expect(response).to.have.status(200);
      expect(response.body.length).to.be.equal(0);
      expect(response.body).to.be.a('array');

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});

describe('GET /api/shorturl/visible mixed', async function() {
  let goodURLs = [...fixtureURLs];

  // Count the undeleted URLs.
  let count = 0;

  before('add some test URLs', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});
    let del = false;

    for (let i = 0; i < goodURLs.length; i++) {
      if (Math.random() >= 0.5) {
        // Deleted.
        del = true;
      } else {
        // Not deleted.
        del = false;
        count += 1;
      }
      // eslint-disable-next-line security/detect-object-injection
      await createURL({'url': goodURLs[i].url, 'deleted': del});
      // eslint-disable-next-line security/detect-object-injection
      goodURLs[i].deleted = del;
    }

    return;
  });

  after('clear the test database', async function() {
    const urlModel = URL();
    await urlModel.deleteMany({});

    return;
  });

  it('should list undeleted URLs', async function() {
    try {
      const response = await chai.request(server)
        .get('/api/shorturl/visible');

      expect(response).to.have.status(200);
      expect(response.body.length).to.be.equal(count);
      expect(response.body).to.be.a('array');

      expect(response.body.map((url) => {
        return url.original_url;
      }).sort()).to.be.eql(goodURLs.filter((url) => {
        if (! url.deleted) {
          return url;
        }
      }).map((url) => {
        return url.url;
      }).sort());

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
