var express = require('express');
var router = express.Router();
var connectionString = require('../modules/connection');

var pg = require('pg');



router.post("/*", function(req,res){

    // post to insert a new day
    console.log("in server day.js, inserting new day:",req.body);

    var meal_date = req.body.meal_date;
    var breakfast_id = req.body.breakfast_id;
    var lunch_id = req.body.lunch_id;
    var dinner_id = req.body.dinner_id;
    var strSql = '';
    var arrFields =[];

    pg.connect(connectionString, function(err, client, done){
        if (err){
          console.log('error connecting to DB:', err);
          res.status(500).send(err);
          done();
          return;
    }

    strSql = 'INSERT INTO tbl_days ("meal_date", "breakfast_id", "lunch_id", "dinner_id")';
    strSql += 'VALUES ($1,$2,$3,$4);';
    arrFields = [meal_date, breakfast_id, lunch_id, dinner_id];
    var query = client.query(strSql,arrFields);
    console.log("strSql = ", strSql);
    console.log("arrFields = ", arrFields);
    query.on('end', function(){
      res.status(200).send("successful insert");
      done();
    });

    query.on('error', function(error){
      console.log("error inserting day into DB:", error);
      res.status(500).send(error);
      done();
    });
  })
});

router.put("/*", function(req,res){
    console.log("in server DAY.js, updating edited DAY:",req.body);
    var id = req.body.id;
    var breakfast_id = req.body.breakfast_id;
    var lunch_id = req.body.lunch_id;
    var dinner_id = req.body.dinner_id;
    var breakfast_cook_id = req.body.breakfast_cook_id;
    var lunch_cook_id = req.body.lunch_cook_id;
    var dinner_cook_id = req.body.dinner_cook_id;
    var in_list = req.body.in_list;

    var strSql = '';
    var arrFields =[];

    console.log("hey Breakfast Id = ", breakfast_id);

    pg.connect(connectionString, function(err, client, done){
        if (err){
          console.log('error connecting to DB:', err);
          res.status(500).send(err);
          done();
          return;
    }

    strSql = "UPDATE tbl_days SET ";

    // if (breakfast_id){
    //     strSql += " breakfast_id = '" + breakfast_id + "' "
    // };

    var strFields = '';

    if (typeof breakfast_id !== 'undefined') {
        strFields += " breakfast_id = '" + breakfast_id + "' "
    }

    if (typeof lunch_id !== 'undefined'){
        if (strFields.length >0){
            strFields += ',';
        }
        strFields += " lunch_id = '" + lunch_id + "' "
    };
    if (typeof dinner_id !== 'undefined'){
        if (strFields.length >0){
            strFields += ',';
        }
        strFields += " dinner_id = '" + dinner_id + "'"
    };
    if (typeof breakfast_cook_id !== 'undefined'){
        if (strFields.length >0){
            strFields += ',';
        }
        strFields += " breakfast_cook_id = '" + breakfast_cook_id + "' "
    };
    if (typeof lunch_cook_id !== 'undefined'){
        if (strFields.length >0){
            strFields += ',';
        }
        strFields += " lunch_cook_id = '" + lunch_cook_id + "' "
    };
    if (typeof dinner_cook_id !== 'undefined'){
        if (strFields.length >0){
            strFields += ',';
        }
        strFields += " dinner_cook_id = '" + dinner_cook_id + "' "
    };
    if (typeof in_list !== 'undefined'){
        if (strFields.length >0){
            strFields += ',';
        }
        strFields += " in_list = '" + in_list + "' "
    };




    strSql += strFields +" WHERE id = '" + id + "';";
    console.log("strSql = ", strSql);

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

router.get("/:start/:end", function(req,res){

  var start_date = req.params.start;
  var end_date = req.params.end;
  var strSql = "";
  console.log("hey you will get some days from ", start_date, "to", end_date);

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
    strSql += "dinner.fld_meal_label AS dinner_label FROM tbl_days "
    strSql += "LEFT JOIN tbl_meals as breakfast ON tbl_days.breakfast_id = breakfast.id ";
    strSql += "LEFT JOIN tbl_meals as lunch ON tbl_days.lunch_id = lunch.id ";
    strSql += "LEFT JOIN tbl_meals as dinner ON tbl_days.dinner_id = dinner.id ";

//     SELECT animal.ID, breed1.BreedName as BreedName1, breed2.BreadName as BreadName2
// FROM animal
//    LEFT JOIN breed as breed1 ON animal.breedID=breed1.ID
//    LEFT JOIN breed as breed2 ON animal.breedID=breed2.ID
// WHERE animal.ID='7';
    strSql += "WHERE meal_date >= '" + start_date + "' AND meal_date <= '" + end_date + "';";

    console.log("strSql=" , strSql);

    var query = client.query(strSql);
    // var query = client.query("SELECT tbl_days.*  FROM tbl_days WHERE meal_date >= '" + start_date + "' AND meal_date <= '" + end_date + "';");
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
