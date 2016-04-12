var express = require('express');
var router = express.Router();
var connectionString = require('../modules/connection');

var pg = require('pg');


router.get("/*", function(req,res){
  console.log("hey you got some FOODS!");
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }
    var results=[];
    var query = client.query('SELECT tbl_ingredients.* FROM tbl_ingredients  ORDER BY fld_label ;');
    query.on('row', function(row){
      results.push(row);
    });
    query.on('end', function(){
      res.send(results);
      done();
    });

    query.on('error', function(error){
      console.log("error returning tasks:", error);
      res.status(500).send(error);
      done();

    });
});
});



















module.exports = router;
