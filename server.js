'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const blogRouter = require('./routes/blog');

const app = express();

const whitelist = ['http://www.ironworksdigital.com', 'http://www.josephkim.me', 'https://joseph-kim-portfolio.herokuapp.com/'];

// === MIDDLEWARE === ///

/* Create a static webserver */
app.use(express.static('public'));

/* Parse request body */
app.use(express.json());

/* Logger */
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

/* Enable CORS */
app.use(
  cors({
    origin: function(origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

// === ROUTERS === //
app.use('/api/register', usersRouter);
app.use('/api/login', authRouter);
app.use('/api/blog', blogRouter);

// Custom 404 Handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: err.message });
  }
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
