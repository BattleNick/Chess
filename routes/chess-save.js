var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res) {
  console.log(req.body);
  var fs = require('fs');
  var positions = JSON.stringify(req.body.ChessPositionsDataState);
  console.log(req.body.ChessPositionsDataState);
  fs.writeFile("./public/api/chess-save.json", positions, function(err) {
      if(err) {
          return console.log(err);
      }
      res.end();
  }); 
});

module.exports = router;
