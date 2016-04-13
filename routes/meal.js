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
    var arr_foods = req.body.foods;
    console.log("arr_foods = ", arr_foods);

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
    strSql += 'VALUES ($1,$2,$3,$4,$5) RETURNING id;';
    arrFields = [meal_type, meal_label, meal_dishes, meal_ingredients, meal_instructions];
    var query = client.query(strSql,arrFields);

    console.log("strSql = ", strSql);
    console.log("arrFields = ", arrFields);

    var mealId;

    query.on('row', function(row){
        console.log("got a row back hopefuly id", row);

        mealId = row.id;
        strSql = "INSERT INTO tbl_ingredients (fld_meal_id, fld_amount, fld_unit, fld_label) VALUES ";

        for (var i=0; i<arr_foods.length; i++){
            strSql += "  ('" + mealId + "','" + arr_foods[i].amount + "','"+ arr_foods[i].unit + "','" + arr_foods[i].label + "')";
            if (i<arr_foods.length-1){
                strSql += ",";
            } else {
                strSql += ";";
            }
        };

        strSql = strSql.replace("'undefined'","''");

        console.log("goint to insert ingredients", strSql);
        var query = client.query(strSql);
        query.on('end', function(){


          done();
        });

        query.on('error', function(error){
          console.log("error inserting ingredients into DB:", error);
          res.status(500).send(error);
          done();
        });


    });


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
    var arr_foods = req.body.foods;
    console.log("arr_foods = ", arr_foods);

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
    strSql += " DELETE FROM tbl_ingredients WHERE fld_meal_id = '"+ meal_id +"'; "
    // add in sql for insert ingredients

    strSql += "INSERT INTO tbl_ingredients (fld_meal_id, fld_amount, fld_unit, fld_label) VALUES ";

    for (var i=0; i<arr_foods.length; i++){
        strSql += "  ('" + meal_id + "','" + arr_foods[i].amount + "','"+ arr_foods[i].unit + "','" + arr_foods[i].label + "')";
        if (i<arr_foods.length-1){
            strSql += ",";
        } else {
            strSql += ";";
        }
    };


    strSql = strSql.replace("'undefined'","''");


    console.log("UPDATE MEAL ************ strSql = ", strSql);


    var query = client.query(strSql);

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
});
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
