const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const herokuUtils = require('heroku-utils');

/**
 * @returns http.Server
 */

async function startServer() {
  const app = express().disable('x-powered-by');
  const server = http.createServer(app);

  app.enable('trust proxy');

  //force HTTPS
  if (config.app.forceHttps) {
    app.use(herokuUtils.forceHttps);
  }

  if (process.env.DELAY) {
    console.log(`delaying requests by ${process.env.DELAY}ms`);

    app.use(function(req, res, next) {
      setTimeout(next, process.env.DELAY);
    });
  }

  app.use(
    require('body-parser').json({
      limit: '250kb'
    })
  );

  //Routes
  app.use('/v1/lessons', require('./controllers/lesson'));

  await new Promise((resolve, reject) =>
    server.listen(config.app.port, err => (err ? reject(err) : resolve()))
  );

  return server;
}

//Run the server if running as main app
if (!module.parent) {
  startServer().then(async server => {
    console.log('Express server listening on port %d', server.address().port);

    //Connect to MongoDB
    mongoose.connect(config.db.url, config.db.connect, function(err) {
      if (err) throw err;
    });

    //Notify of MongoDB events
    mongoose.connection.on('error', function(err) {
      console.error(err);
    });

    mongoose.connection.on('connected', function() {
      console.log('Connected to MongoDB');
    });

    mongoose.connection.on('disconnected', function() {
      console.log('Disconnected from MongoDB');

      server.close(function() {
        console.log('IMPORTANT: Disconnected; exiting');

        process.exit(0);
      });
    });

    mongoose.connection.on('close', function() {
      console.log('MongoDB connection closed');
    });
  });
}

module.exports = startServer;
