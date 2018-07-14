var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fs = require('fs');
  fs.readFile('./public/api/chess.json', 'utf8', function(err, contents) {
    res.json(contents);
  });
});

module.exports = router;
