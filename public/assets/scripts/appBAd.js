var myApp = angular.module('myApp', []);

myApp.controller('UserController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.userName;

    // This happens after page load, which means it has authenticated if it was ever going to
    // NOT SECURE
    $http.get('/user').then(function(response) {
        if(response.data) {
            $scope.userName = response.data.username;
            console.log('User Data: ', $scope.userName);
        } else {
            $window.location.href = '/index.html';
        }
    });
}]);

myApp.controller('PlanController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    // $scope.userName;
    // $http.get('/user').then(function(response) {
    //     if(response.data) {
    //         $scope.userName = response.data.username;
    //         console.log('In Plan Controller, User Data: ', $scope.userName);
    //     } else {
    //         $window.location.href = '/index.html';
    //     }
    // });
    // This happens after page load, which means it has authenticated if it was ever going to
    // NOT SECURE

    // meals variables
    $scope.arrBreakfasts = [];
    $scope.arrLunches = [];
    $scope.arrDinners = [];

    $scope.arrList = [];
    var arrMeals = [];
    $scope.arrCooks = [];
    $scope.arrCooks.push({cook_label: "Select Cook", cook_id: "0"});

    $scope.arrCooks.push({cook_label: "Vanessa", cook_id: "1"});
    $scope.arrCooks.push({cook_label: "Riley", cook_id: "2"});

    var arrIngredients = [];

    $scope.arrFoods = [];

    $scope.arrShoppingFood = [];


    // days variables
    //$scope.weekStart = now;
    if ($scope.weekStart == undefined){
        $scope.weekStart = new Date();
    }
    console.log("scope.weekStart=", $scope.weekStart);

    // getDays();
    // getIngredients();
    // getMeals();

    // getList();
    $scope.addFood = function(amount, unit, label){

        console.log("goint to add amount unit label", amount, unit, label);
        var food = {"amount": amount, "unit": unit, "label":label};
        $scope.arrFoods.push(food);
        $scope.food = {};




    };

    function getIngredients(){
        arrIngredients = [];



        console.log("get ingredients");
        $http.get("/food").then(function(response){

            console.log("got ingredients", response.data);
            //loop through response.data and put each one into scoped variable to

            response.data.forEach(function(food_block){

                console.log("food block for arrIngredients", food_block);
                arrIngredients.push(food_block);

            });
            // getMeals();


        });
    };
    function popShopFoods(){
        console.log("in PopSHop FOods, getting ready to step through arrIngredients which has length", arrIngredients.length);

        // do it here?
        console.log("did I fill the list", $scope.arrList.length);
        $scope.arrShoppingFood = [];

            for (var a = 0; a<arrIngredients.length; a++){

                console.log("HEy I am stepping through arrLIst", $scope.arrList[i]);
                console.log("getting ready to step through arrIngredients which has length", arrIngredients.length);
                    for (var i=0; i<$scope.arrList.length; i++){

                // console.log("looping through INGREIDENTS the list", arrIngredients[a]);

                // chec if any of the meals hold these ingredients
                var listRow = $scope.arrList[i];
                var ingredientRow = arrIngredients[a];
                // console.log ("checking list items against ingredients for meal ids", listRow, ingredientRow);
                if (listRow.breakfast_id == ingredientRow.fld_meal_id){
                    console.log("Holy crap we have a food to put in the list", listRow,ingredientRow);
                    var newFood = {"fld_amount":ingredientRow.fld_amount, "fld_unit": ingredientRow.fld_unit, "fld_label":ingredientRow.fld_label};
                    $scope.arrShoppingFood.push(newFood);
                };
                if (listRow.lunch_id == ingredientRow.fld_meal_id){
                    console.log("Holy crap we have a food to put in the list", listRow,ingredientRow);
                    var newFood = {"fld_amount":ingredientRow.fld_amount, "fld_unit": ingredientRow.fld_unit, "fld_label":ingredientRow.fld_label};
                    $scope.arrShoppingFood.push(newFood);
                };
                if (listRow.dinner_id == ingredientRow.fld_meal_id){
                    console.log("Holy crap we have a food to put in the list", listRow,ingredientRow);
                    var newFood = {"fld_amount":ingredientRow.fld_amount, "fld_unit": ingredientRow.fld_unit, "fld_label":ingredientRow.fld_label};
                    $scope.arrShoppingFood.push(newFood);
                };
            };
        };
        // check arrShoppingFood

    };

    function getList(){

        $scope.arrList = [];
        console.log("get list");
        $http.get("/list").then(function(response){

            console.log("got days for list", response.data);
            //loop through response.data and put each one into scoped variable to

            response.data.forEach(function(list_day){

                list_day.meal_date = new Date(myFormatDate(list_day.meal_date)).toDateString();
                console.log("list day=", list_day);
                $scope.arrList.push(list_day);
            });
            // popShopFoods();

        });
        // pop shopping list here?
    };
    $scope.unlistDay = function(dayId){
        // set the day to unlisted
        console.log("getting ready to unlist day", dayId);
        var day = {};
        day.id = dayId;
        day.action = "unlist";
        $http.put("/list", day).then(function(response){
            console.log("day updated", response);
            // getDays();
        });

    };

    $scope.listDay = function(dayId){
        // set the day to unlisted
        console.log("getting ready to unlist day", dayId);
        var day = {};
        day.id = dayId;
        day.action = "list";
        $http.put("/list", day).then(function(response){
            console.log("day updated", response);
            // getDays();
        });

    };

    $scope.setBreakfastCook = function(cookId, dayId){
        console.log("trying to set breakfast cook id cook id day id", cookId, dayId);
        var day = {};
        day.breakfast_cook_id = cookId;
        day.id = dayId;
        $http.put("/day", day).then(function(response){
            console.log("day updated", response);
            // getDays();
        });

    };
    $scope.setLunchCook = function(cookId, dayId){
        console.log("trying to set lunch cook id cook id day id", cookId, dayId);
        var day = {};
        day.lunch_cook_id = cookId;
        day.id = dayId;
        $http.put("/day", day).then(function(response){
            console.log("day updated", response);
            // getDays();
        });

    };

    $scope.setDinnerCook = function(cookId, dayId){
        console.log("trying to set dinner cook id cook id day id", cookId, dayId);
        var day = {};
        day.dinner_cook_id = cookId;
        day.id = dayId;
        $http.put("/day", day).then(function(response){
            console.log("day updated", response);
            // getDays();
        });

    };

    $scope.grabBreakfast = function(mealDate, dayId){
        console.log("I am going to try and stick a breakfast into this date", mealDate, "with meal id", $scope.breakfast_id, "day id", dayId);
        var day = {};
        day.meal_date = mealDate;
        day.breakfast_id = $scope.breakfast_id;
        if (dayId == undefined){
            console.log("going to insert a day");
            $http.post("/day", day).then(function(response){
                console.log("day saved", response);
                // getDays();
            });
        } else {
            console.log("hey lets UPDATE a BREAKFST");
            day.id = dayId;
            $http.put("/day", day).then(function(response){
                console.log("day updated", response);
                // getDays();
            });
        };
    };

    $scope.grabLunch = function(mealDate, dayId){
        console.log("I am going to try and stick a lunch into this date", mealDate, "with id", $scope.lunch_id, "day id", dayId);
        var day = {};
        day.meal_date = mealDate;
        day.lunch_id = $scope.lunch_id;
        if (dayId == undefined){
            console.log("going to insert a day");
            $http.post("/day", day).then(function(response){
                console.log("day saved", response);
                // getDays();
            });
        } else {
            day.id = dayId;
            $http.put("/day", day).then(function(response){
                console.log("day updated", response);
                // getDays();
            });
        };
    };
    $scope.grabDinner = function(mealDate, dayId){
        console.log("I am going to try and stick a dinner into this date", mealDate, "with id", $scope.dinner_id, "day id", dayId);
        var day = {};
        day.meal_date = mealDate;
        day.dinner_id = $scope.dinner_id;
        if (dayId == undefined){
            console.log("going to insert a day");
            $http.post("/day", day).then(function(response){
                console.log("day saved", response);
                // getDays();
            });
        } else {
            day.id = dayId;
            $http.put("/day", day).then(function(response){
                console.log("day updated", response);
                // getDays();
            });
        };
    };

    function getDays(){
        $scope.arrWeek = [];
        $scope.arrDays = [];
        // days hold results
        // arrweek holds 7 days
        var start = $scope.weekStart.toDateString();
        var end = new Date(start);
        end.setDate(end.getDate()+6);
        end = end.toDateString();

        //  fill up days
        var workDate = new Date(start);
        for (var i=0; i<7; i++){
            var day = {};
            day.meal_date = workDate.toDateString();
            day.breakfast_cook_id = "0";
            day.lunch_cook_id = "0";
            day.dinner_cook_id = "0";

            $scope.arrWeek.push(day);
            workDate.setDate(workDate.getDate() + 1);

        };

        console.log("get days range", start, end);
        $http.get("/day/" + start + "/" + end ).then(function(response){
            console.log("got some days", response.data);
            //loop through response.data and put each one into scoped variable to
            // feed select dropdowns
            response.data.forEach(function(day){
                // var myDay = new Date(day.meal_date);
                // day.meal_date = myDay.toDateString();
                // console.log("day=", new Date(myFormatDate(day.meal_date)).toDateString());
                day.meal_date = new Date(myFormatDate(day.meal_date)).toDateString();
                console.log("day=", day);
                $scope.arrDays.push(day);

            });

            // after get successful
            for (a=0;a<$scope.arrWeek.length; a++){
                for (b=0;b<$scope.arrDays.length; b++){
                    if ($scope.arrWeek[a].meal_date == $scope.arrDays[b].meal_date){
                        console.log("match data!!!", $scope.arrWeek[a]);
                        $scope.arrWeek[a]=$scope.arrDays[b];
                    };
                };
            };
            for (a=0;a<$scope.arrWeek.length; a++){
                console.log("days in arrWeek after matching", $scope.arrWeek[a]);
            };
            // getList();


        });

    };



    $scope.prevWeek = function(){
        $scope.weekStart.setDate($scope.weekStart.getDate() - 7);
        // getDays();
    };

    $scope.nextWeek = function(){
        $scope.weekStart.setDate($scope.weekStart.getDate() + 7);
        // getDays();
    };




    $scope.newMeal= function(mealType){
        $scope.arrFoods = [];

        $scope.meal = {};
        $scope.food = {};
        $scope.showMealForm = true;
        $scope.mealType = mealType;
        console.log("we are going to make a new meal", mealType);

    };
    $scope.cancelMeal=function(){
        $scope.showMealForm = false;

    };
    $scope.deleteMeal = function(){
        var nukeId = $scope.meal.id;
        console.log("Fixing to delete meal with id: ", $scope.meal.id);

        // check if meal exists
        if ($scope.meal.id == undefined){
            // close the form
            $scope.showMealForm = false;
            return;
        };


        if($window.confirm('You are about to delete this meal. Are you sure?')) {
                console.log("gonna nuke", nukeId) ;
                $http.delete("/meal/" + nukeId).then(function(response){
                // getVillains();
                $scope.showMealForm = false;
                // getMeals();



            });
        };

    };
    $scope.clearBreakfast = function(){
        console.log("Clear breakfast ID");
        $scope.breakfast_id="";
    };

    $scope.popFood = function(index){
        console.log("going to take out the food with index", index);
        $scope.arrFoods.splice(index,1);

    };

    $scope.editMeal = function(mealId, mealType){
        $scope.meal = {};
        $scope.arrFoods =[];
        $scope.food = {};


        console.log("should we clear", mealType);
        console.log("mealid length", mealId.length);
        if (mealId.length == 0){
            if (mealType =="breakfast"){
                $scope.breakfast_id="";
            };
            if (mealType =="lunch"){
                $scope.lunch_id="";
            };
            if (mealType =="dinner"){
                $scope.dinner_id="";
            };
        };


        console.log("going to edit meal with id:", mealId);

        for (var i= 0; i<arrMeals.length; i++){
            // console.log("checking meal", arrMeals[i]);
            if (arrMeals[i].id == parseInt(mealId)){

                // TODO populate ingredients for this meal
                // console.log("got match");
                for (var a=0; a<arrIngredients.length; a++){
                    var foodRow = arrIngredients[a];
                    if (foodRow.fld_meal_id == parseInt(mealId)){

                        var food = {"amount": foodRow.fld_amount, "unit": foodRow.fld_unit, "label":foodRow.fld_label};

                        $scope.arrFoods.push(food);
                    };
                };
                $scope.meal.id = mealId;
                $scope.meal.label = arrMeals[i].fld_meal_label;
                $scope.meal.dishes = arrMeals[i].fld_meal_dishes;
                $scope.meal.instructions = arrMeals[i].fld_meal_instructions;
                $scope.mealType= arrMeals[i].fld_meal_type;

                // set scope selected breakfast, lunch, dinner
                if (arrMeals[i].fld_meal_type == "breakfast"){
                    $scope.breakfast_id = arrMeals[i].id;
                };
                if (arrMeals[i].fld_meal_type == "lunch"){
                    $scope.lunch_id = arrMeals[i].id;

                };
                if (arrMeals[i].fld_meal_type == "dinner"){
                    $scope.dinner_id = arrMeals[i].id;

                };


            };
        };
        $scope.showMealForm = true;

    };

    $scope.saveMeal = function(meal){
        console.log("fixing to save meal", meal);

        console.log("meal id=", $scope.meal.id);

        meal.mealType = $scope.mealType;
        meal.foods = $scope.arrFoods;
        $scope.arrFoods = [];

        if ($scope.meal.id == undefined){
            console.log("going to insert");
            $http.post("/meal", meal).then(function(response){
                console.log("meal saved", response);
                $scope.showMealForm = false;
                // getIngredients();

            });
        } else {
            console.log("Hey! I am going to  update a meal!!");
            meal.id = $scope.meal.id;
            $http.put("/meal", meal).then(function(response){
                console.log("meal updated", response);
                $scope.showMealForm = false;
                // getIngredients();
            });
        };


    };

    function getMeals(){
        //    //     // make a get call to the database to populate meal dropdowns
        console.log("in get meals");
        $http.get("/meal").then(function(response){
            console.log("got some meals", response.data);
            //loop through response.data and put each one into scoped variable to
            // feed select dropdowns
            $scope.arrBreakfasts = [];
            $scope.arrLunches = [];
            $scope.arrDinners = [];
            arrMeals = [];


            response.data.forEach(function(meal){
                    // taskArray.push(task);
                    if (meal.fld_meal_type=="breakfast"){
                        $scope.arrBreakfasts.push(meal);
                    };
                    if (meal.fld_meal_type=="lunch"){
                        $scope.arrLunches.push(meal);
                    };
                    if (meal.fld_meal_type=="dinner"){
                        $scope.arrDinners.push(meal);
                    };
                    arrMeals.push(meal);
                    //console.log(meal);
            });

            // getDays();
        });
        // getIngredients();



    };

    function myFormatDate(dateString){
        // get a given date string, if it's not empty, convert it to something sensible
        var arrMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        if (dateString != null){
            var result;
            var myDate = new Date(dateString);
            result =  (myDate.getDate()+1) +  arrMonths[myDate.getMonth()] + myDate.getFullYear();
        } else {
            result = '';
        };
        return result;
    };


}]);
