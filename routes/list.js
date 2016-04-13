var express = require('express');
var router = express.Router();
var connectionString = require('../modules/connection');

var pg = require('pg');
router.get("/foods", function(req,res){



  console.log("fetching  INGREIDENTS with SUPER fancy SQL");

  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }
    var results=[];


    strNewSql = 'SELECT SUM (fld_amount) AS "count", fld_unit, fld_label FROM tbl_ingredients ';
    strNewSql += 'JOIN tbl_meals ON tbl_ingredients.fld_meal_id = tbl_meals.id JOIN tbl_days';
    strNewSql +=' ON (tbl_meals.id = tbl_days.breakfast_id OR tbl_meals.id = tbl_days.lunch_id ';
    strNewSql += ' OR tbl_meals.id = tbl_days.dinner_id) WHERE tbl_days.in_list = ';
    strNewSql += ' TRUE  GROUP BY fld_label, fld_unit ORDER BY fld_label;';

    console.log("strNewSql=" , strNewSql);

    var query = client.query(strNewSql);
    query.on('row', function(row){

      results.push(row);
    //   console.log("row=", row);
    });
    query.on('end', function(){
      res.send(results);
      done();
    });

    query.on('error', function(error){
      console.log("error returning days:", error);
      res.status(500).send(error);
      done();

  });
});
});

router.get("/*", function(req,res){


  var strSql = "";
  console.log("fetching meals for list with INGREIDENTS");

  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }
    var results=[];
    strSql = "SELECT tbl_days.id, meal_date, breakfast_id, lunch_id, dinner_id, breakfast_cook_id, lunch_cook_id, "
    strSql += "dinner_cook_id, in_list,  breakfast.fld_meal_label AS breakfast_label, lunch.fld_meal_label AS lunch_label, ";
    strSql += "dinner.fld_meal_label AS dinner_label "

    strSql +=" FROM tbl_days "
    strSql += "LEFT JOIN tbl_meals as breakfast ON tbl_days.breakfast_id = breakfast.id ";
    strSql += "LEFT JOIN tbl_meals as lunch ON tbl_days.lunch_id = lunch.id ";
    strSql += "LEFT JOIN tbl_meals as dinner ON tbl_days.dinner_id = dinner.id ";


    strSql += "WHERE in_list = 'TRUE' ORDER BY meal_date;";

    strNewSql = 'SELECT SUM (fld_amount) AS "count", fld_unit, fld_label FROM tbl_ingredients ';
    strNewSql += 'JOIN tbl_meals ON tbl_ingredients.fld_meal_id = tbl_meals.id JOIN tbl_days';
    strNewSql +=' ON (tbl_meals.id = tbl_days.breakfast_id OR tbl_meals.id = tbl_days.lunch_id ';
    strNewSql += ' OR tbl_meals.id = tbl_days.dinner_id) WHERE tbl_days.in_list = ';
    strNewSql += ' TRUE  GROUP BY fld_label, fld_unit ORDER BY fld_label;';

    console.log("strNewSql=" , strSql);

    var query = client.query(strSql);
    query.on('row', function(row){

      results.push(row);
    //   console.log("row=", row);
    });
    query.on('end', function(){
      res.send(results);
      done();
    });

    query.on('error', function(error){
      console.log("error returning days:", error);
      res.status(500).send(error);
      done();

  });
});
});



router.put("/*", function(req,res){
    console.log("in LIST.js, updating edited DAY:",req.body);
    var id = req.body.id;
    var action = req.body.action;
    var strSql = '';

    if (action =="unlist"){
        strSql = "UPDATE tbl_days SET in_list = 'FALSE' WHERE id = '" + id + "';";
    };
    if (action =="list"){
        strSql = "UPDATE tbl_days SET in_list = 'TRUE' WHERE id = '" + id + "';";
    };
    console.log("strSql = ", strSql);

    pg.connect(connectionString, function(err, client, done){
        if (err){
          console.log('error connecting to DB:', err);
          res.status(500).send(err);
          done();
          return;
    }


    var query = client.query(strSql);

    query.on('end', function(){
      res.status(200).send("successful UPDATE");
      done();
    });

    query.on('error', function(error){
      console.log("error updating DAY in  DB:", error);
      res.status(500).send(error);
      done();
    });
    });
});

module.exports = router;
