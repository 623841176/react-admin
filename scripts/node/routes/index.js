var express = require('express');
var router = express.Router();
var db = require('../database/db.js');
var selectd = db.selectd;
var count = db.count;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/selectd', function(req, res, next) {
  selectd(req, res, next);
});
router.get('/count', function(req, res, next) {
  count(req, res, next);
});

module.exports = router;
