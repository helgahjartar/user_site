var express = require('express');
var router = express.Router();

/* Sækir heimasíðu með GET */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Notendasíða' });
});

module.exports = router;
