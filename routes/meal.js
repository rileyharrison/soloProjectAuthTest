var express = require('express');
var router = express.Router();
var connectionString = require('../modules/connection');

var pg = require('pg');



router.post("/*", function(req,res){

    // post to insert new meal
    var meal_type = req.body.mealType;
    var meal_label = req.body.label;
    var meal_dishes = req.body.dishes;
    var meal_ingredients = req.body.ingredients;
    var meal_instructions = req.body.instructions;

    var strSql = '';
    var arrFields =[];

    console.log("in server meal.js, saving new meal:",req.body);
    pg.connect(connectionString, function(err, client, done){
        if (err){
          console.log('error connecting to DB:', err);
          res.status(500).send(err);
          done();
          return;
    }

    strSql = 'INSERT INTO tbl_meals ("fld_meal_type", "fld_meal_label", "fld_meal_dishes","fld_meal_ingredients", "fld_meal_instructions") '
    strSql += 'VALUES ($1,$2,$3,$4,$5);';
    arrFields = [meal_type, meal_label, meal_dishes, meal_ingredients, meal_instructions];
    var query = client.query(strSql,arrFields);
    console.log("strSql = ", strSql);
    console.log("arrFields = ", arrFields);
    query.on('end', function(){
      res.status(200).send("successful insert");
      done();
    });

    query.on('error', function(error){
      console.log("error inserting task into DB:", error);
      res.status(500).send(error);
      done();
    });
  })
});

router.put("/*", function(req,res){

    // update to save edited meal
    var meal_type = req.body.mealType;
    var meal_label = req.body.label;
    var meal_dishes = req.body.dishes;
    var meal_ingredients = req.body.ingredients;
    var meal_instructions = req.body.instructions;
    var meal_id = req.body.id;

    var strSql = '';
    var arrFields =[];

    console.log("in server meal.js, updating edited meal:",req.body);
    pg.connect(connectionString, function(err, client, done){
        if (err){
          console.log('error connecting to DB:', err);
          res.status(500).send(err);
          done();
          return;
    }

    strSql = "UPDATE tbl_meals SET fld_meal_type = '" + meal_type + "', fld_meal_label ='" + meal_label + "', fld_meal_dishes='" + meal_dishes + "',";
    strSql += " fld_meal_ingredients='" + meal_ingredients + "', fld_meal_instructions='" + meal_instructions + "' WHERE id = '" + meal_id + "';";
    var query = client.query(strSql);
    console.log("strSql = ", strSql);
    query.on('end', function(){
      res.status(200).send("successful UPDATE");
      done();
    });

    query.on('error', function(error){
      console.log("error updating meal in  DB:", error);
      res.status(500).send(error);
      done();
    });
    });
});

router.get("/*", function(req,res){

  console.log("hey you got some meals!");
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }
    var results=[];
    var query = client.query('SELECT tbl_meals.* FROM tbl_meals ORDER BY fld_meal_type, fld_meal_label;');
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
  })
});

router.delete("/:id", function(req,res){
    console.log("in app js for delete", req.params.id);
    var nukeId = req.params.id;

    pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }

    strSql = "DELETE FROM  tbl_meals  WHERE id = '" + nukeId + "';";
    console.log("strSql=", strSql)
    var query = client.query(strSql);
    query.on('end', function(){
      res.status(200).send("successful delete of meal");
      done();
    });
    query.on('error', function(error){
      console.log("error error delting meal:", error);
      res.status(500).send(error);
      done();
    });
    });

});











module.exports = router;
