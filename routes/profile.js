'use strict';

var express = require('express');
var router = express.Router();
var users = require('../utils/db-user');
var xss = require('xss');

router.get('/', ensureLogin);

router.post('/', postEntry);

function listEntry(req, res) {

  users.listUserText(function (error, all) {
    res.render('profile', {
      greeting: 'Vertu velkomin/n á þitt svæði ' + req.session.user.username, 
      title: 'Prófíll',
      entries: all.reverse() });
  });
}

function postEntry(req, res) {
  var username = req.session.user.username;
  var date = new Date();
  var text = xss(req.body.entry);

  users.createText(username, date, text, function (err, status) {
   if (err) {
    console.error(err);
   } 
   
   var success = true;
   
   if (err || !status) {
     success = false;
   }
   listEntry(req,res);
  }); 

}

function ensureLogin(req, res) {

  if (req.session.user) {
    listEntry(req, res);
  } else {
    res.redirect('/login');
  }
}


module.exports = router;
