'use strict';

var pg = require('pg');
var database = process.env.DATABASE_URL;
var hash = require('../utils/pass').hash;
var xss = require('xss');
var html = xss('<script>alert("xss");</script>');
console.log(html);

function createUserSaltHash (username, salt, hash, cb) {
  pg.connect(database, function (error, client, done) {
    if (error) {
      return cb(error);
    }

    var values = [username, salt, hash, new Date()];
    var query = 'INSERT into users (username, salt, hash, date) VALUES($1, $2, $3, $4)';
    client.query(query, values, function (err, result) {
      done();

      if (err) {
        console.error(err);
        return cb(error);
      } else {
        return cb(null, true);
      }
    });
  });
}

function createUserText (username, date, text, cb) {
 pg.connect(database, function (error, client, done) {
    if (error) {
      return cb(error);
    }

    var values = [username, new Date(), text];
    var query = 'INSERT into entries (username, date, text) VALUES($1, $2, $3)';
    client.query(query, values, function (err, result) {
      done();
      
      if (err) {
        console.error(err);
        return cb(error);
      } else {
        return cb(null, true);
      }
      
    });
  });
}

function findUser (username, cb) {
  pg.connect(database, function (error, client, done) {
    if (error) {
      return cb(error);
    }

    var values = [username];
    var query = 'SELECT username, salt, hash FROM users WHERE username = $1';
    client.query(query, values, function (err, result) {
      done();

      if (err) {
        return cb(error);
      } else {
        return cb(null, result.rows);
      }
    });
  }); 
}

module.exports.createText = function createText (username, date, text, cb) {
   createUserText(username, date, text, cb);
};

module.exports.createUser = function createUser (username, password, cb) {
  hash(password, function (err, salt, hash) {
    if (err) {
      return cb(err);
    }

    createUserSaltHash(username, salt, hash, cb);
  });
};

module.exports.auth = function auth (name, pass, fn) {
  findUser(name, function (err, result) {
    var user = null;

    if (result.length === 1) {
      user = result[0];
    }

    if (!user) {
      return fn(new Error('user not found'));
    }

    hash(pass, user.salt, function(err, hash){
      if (err) {
        return fn(err);
      }
      
      if (hash === user.hash) {
        return fn(null, user);
      }

      fn(new Error('password is invalid'));
    });
  });
};

module.exports.listUserText = function listUserText (cb) {
  pg.connect(database, function (error, client, done) {
    if (error) {
      return cb(error, null);
    }

    var query = 'SELECT username, date, text FROM entries LIMIT 20';
    console.log(query);
    client.query(query, function (err, result) {
      done();

      if (err) {
        return cb(err,null);
      } else {
        return cb(null, result.rows);
      }
    });
  });
};