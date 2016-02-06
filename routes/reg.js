'use strict';

var express = require('express');
var router = express.Router();
var users = require('../utils/db-user');
var xss = require('xss');


router.get('/', function (req, res) {
  res.render('reg', {title: 'Nýskráning'});
});

router.post('/', function (req, res) {
  var username = xss(req.body.username);
  var password = xss(req.body.password);

  users.createUser(username, password, function (err, status) {
    if (err) {
      console.error(err);
    }

    var success = true;

    if (err || !status) {
      success = false;
    }

    res.render('reg', { title: 'Nýskráning', infomsg: 'Skráning tókst!', post: true, success: success });
  });

});


module.exports = router;