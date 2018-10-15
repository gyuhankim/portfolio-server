# Joseph Kim Portfolio Server

## Table of Contents
- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Blog Model](#blog-model)
  - [Post Schema](#post-schema)
- [Posts Endpoint](#posts-endpoint)

## Introduction
This is the server documentation for [My Portfolio](https://josephkim.me).

## Tech Stack
* Node
* Express
* MongoDB
* Mongoose
* Morgan
* Passport
* BCryptJS
* JSONWebToken
* Moment
* dotEnv

## Blog Model
The blog uses MongoDB / Mongoose to store and timestamp blog posts.

### Post Schema
```
title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  updatedAt: {
    type: String
  },
  dbTime: {
    type: Number,
    required: true
  }
```

## Posts Endpoint
All requests and responses are in JSON format.

Action | Path |
--- | --- |
GET | https://joes-portfolio-backend.herokuapp.com/api/blog |
POST | https://joes-portfolio-backend.herokuapp.com/api/blog |
PUT | https://joes-portfolio-backend.herokuapp.com/api/blog/:id |
DELETE | https://joes-portfolio-backend.herokuapp.com/api/blog/:id |