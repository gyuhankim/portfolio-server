'use strict';

const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

const Blog = require('../models/blog');

const router = express.Router();

// GET ALL POSTS
router.get('/', (req, res, next) => {
  Blog.find()
    .sort({ dbTime: -1 })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// GET ONE POST
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error(`Can't find the post with ID: ${id}`);
    err.status = 400;
    return next(err);
  }

  Blog.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// CREATE POST
router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const newPost = { title, content };
  newPost.createdAt = moment().format('ll');
  newPost.dbTime = new Date().getTime();

  Blog.create(newPost)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

// UPDATE POST
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (!content) {
    const err = new Error('Missing `content` in request body');
    err.status = 400;
    return next(err);
  }

  const updatedPost = { title, content };

  updatedPost.updatedAt = moment().format('llll');

  Blog.findByIdAndUpdate(id, updatedPost, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// DELETE POST
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Blog.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;