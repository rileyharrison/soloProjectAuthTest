var express = require('express');
var router = express.Router();
var connectionString = require('../modules/connection');

var pg = require('pg');

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
    strSql += "dinner.fld_meal_label AS dinner_label, breakfast.fld_meal_ingredients AS breakfast_ingredients,"
    strSql += "lunch.fld_meal_ingredients AS lunch_ingredients,"
    strSql += "dinner.fld_meal_ingredients AS dinner_ingredients"

    strSql +=" FROM tbl_days "
    strSql += "LEFT JOIN tbl_meals as breakfast ON tbl_days.breakfast_id = breakfast.id ";
    strSql += "LEFT JOIN tbl_meals as lunch ON tbl_days.lunch_id = lunch.id ";
    strSql += "LEFT JOIN tbl_meals as dinner ON tbl_days.dinner_id = dinner.id ";


    strSql += "WHERE in_list = 'TRUE' ORDER BY meal_date;";

    console.log("strSql=" , strSql);

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

module.exports = router;
