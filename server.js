/* SPDX-License-Identifier: MIT
 *
 * Copyright 2020 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

// Load the environment variables.
require('dotenv').config();

// Enable node express and body parser.
const dns = require('dns');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Enable mongoDB, mongoose, and mongoose-sequence, and then connect to database.
let mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// Mount middleware.
// Body Parser.
app.use('/', bodyParser.urlencoded({extended: false}));

// Serve static files.
app.use('/public', express.static(process.cwd() + '/public'));

// Default route.
app.get('/', (req, res) =>
{
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// Hello API endpoint. 
app.get("/api/hello", (req, res) =>
{
  res.json({greeting: 'hello API'});
});


// Establish a URL model.
const Schema = mongoose.Schema;
const urlSchema = new Schema(
{
  url: {type: String, required: true},
});
urlSchema.plugin(AutoIncrement, {inc_field: 'num'});
let URL = mongoose.model('URL', urlSchema);


// URL Shortener API endpoint.
app.post('/api/shorturl/new/', (req, res, next) =>
{
  // Get the POSTed URL.
  let orig = req.body.url;

  // Rudimentary URL validity check.
  // Turns out DNS fails with protocol prefix.
  let prefix, host;
  if (/:\/\//.test(orig))
  {
    [prefix, host] = orig.split('://');
  }
  else
  {
    [prefix, host] = ['', orig];
  }
  // Default to http:// if prefix is empty.
  if (prefix.length == 0)
  {
    prefix = 'http://';
  }
  else
  {
    prefix += '://';
  }
  // Rebuild URL.
  const url = prefix + host;

  dns.lookup(host, (error, address, family) =>
  {
    // Bad URL; report back.
    if (error)
    {
      res.json({'error': 'invalid URL'});
      return next(error);
    }

    // Good URL; store it in the database and report the shortened version.
    let shortURL = new URL({'url': url});

    shortURL.save((error, data) =>
    {
      if (error)
      {
        return next(error);
      }

      res.json({'original_url': orig, 'short_url': shortURL.num});
    });
  });
});


// URL Shortener Redirect API endpoint.
app.get('/api/shorturl/:num(\\d+)', (req, res, next) =>
{
  // Lookup the URL.
  let num = parseInt(req.params.num);
  URL.find({'num': num}, (error, myURL) =>
  {
    if (error)
    {
      return next(error);
    }
    else if (myURL.length == 0)
    {
      res.json({'error': 'invalid URL'});
      return next({message: 'Shortend URL ' + num + ' does not exist.'});
    }

    // Redirect to the URL.
    res.redirect(myURL[0].url);
  });
});


// Set the port.
const port = process.env.PORT || 3000;

app.listen(port, () =>
{
  console.log('Node.js listening on port ' + port + ' ...');
});
