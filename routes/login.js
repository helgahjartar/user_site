'use strict';

var express = require('express');
var router = express.Router();
var users = require('../utils/db-user');

router.get('/', function (req, res) {
	res.render('login', {title: 'Innskráning'});
});


router.post('/', function (req, res) {

  var username = req.body.username;
  var password = req.body.password;

  users.auth(username, password, function (err, user) {
    if (user) {
      req.session.regenerate(function (){
        req.session.user = user;
        res.redirect('/profile');
      });
    } else {
      var data = { error: true };
      res.render('login', data);
    }
  });

});

module.exports = router;