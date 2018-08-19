'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const options = {session: false, failWithError: true};

const localAuth = passport.authenticate('local', options);

const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const jwtAuth = passport.authenticate('jwt', options);

const createAuthToken = user => {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username.toLowerCase(),
    expiresIn: JWT_EXPIRY
  });
};

router.post('/', localAuth, function(req, res) {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

router.post('/refresh', jwtAuth, function(req, res) {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

module.exports = router;