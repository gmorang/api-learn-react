const env = process.env;

const config = {
  app: {
    port: env.PORT || 7900,
    url: env.URL || 'http://localhost:7900',
    forceHttps: env.FORCE_HTTPS === '1'
  },

  accessToken: {
    lifetimeMins: 1440 // 1 day
  },

  db: {
    //Object to connect to mongodb instances
    url:
      env.DB_URI || env.MONGOLAB_URI || 'mongodb://localhost:27017/learn-react',
    //options to mongoose.conect
    connect: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  //object to connect to firebase, used for upload files TODO: CHANGE TO S3 - AMAZON
  firebaseConfig: {}
};

const dbInfo = require('url').parse(config.db.url);
console.log('');
console.log(`Using app: ${config.app.url}`);
console.log(`Using DB: ${dbInfo.host}${dbInfo.path}`);
console.log('');

module.exports = config;
