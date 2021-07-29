const express = require('express');
const route = express.Router();
const Instructor = require('../../Models/instructor');

// @type => POST
// @route => "/api/auth/instructor/signup"
// @desc => router for signup for User
// @access => public

route.post('/signup', (req, res) => {});

module.exports = route;
