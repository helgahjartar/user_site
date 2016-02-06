'use strict';

var express = require('express');
var router = express.Router();
var users = require('../utils/db-user');

/* GET home page. */
router.get('/', ensureLogin);

function ensureLogin(req, res, next) {
  if (req.session.user) {
    res.render('blog', {
      greeting: 'Vertu velkomin/n á bloggsvæðið',
      title: 'Blogg'
    });
  } else {
    res.redirect('/login');
  }
}


module.exports = router;
