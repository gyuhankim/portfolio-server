'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const router = express.Router();

// Check Users
router.get('/users', (req, res, next) => {
  User.find()
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// User Creation
router.post('/', (req, res, next) => {
  let { username, password } = req.body;

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username: username.toLowerCase(),
        password: digest
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('That username is unavailable!');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;