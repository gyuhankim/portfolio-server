'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Tag = require('../models/tag');
const Blog = require('../models/blog');

const router = express.Router();

// GET TAGS
router.get('/', (req, res, next) => {
  Tag.find()
    .sort('tag')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// GET ONE TAG
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findById(id)
    .then(result => {
      if (result) {
        res.json(result).status(200);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

// CREATE TAG
router.post('/', (req, res, next) => {
  const { tag } = req.body;

  if (!tag) {
    const err = new Error('Missing `tag` in request body');
    err.status = 400;
    return next(err);
  }

  const newTag = { tag };

  Tag.create(newTag)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag already exists!');
        err.status = 400;
      }
      next(err);
    });
});

// DELETE TAG
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const tagRemovePromise = Tag.findByIdAndRemove(id);
  const blogRemovePromise = Blog.updateMany(
    { tags: id },
    { $pull: { tags: id } }
  );

  Promise.all([tagRemovePromise, blogRemovePromise])
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;