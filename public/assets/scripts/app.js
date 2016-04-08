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
    $scope.userName;
    $http.get('/user').then(function(response) {
        if(response.data) {
            $scope.userName = response.data.username;
            console.log('In Plan Controller, User Data: ', $scope.userName);
        } else {
            $window.location.href = '/index.html';
        }
    });
    // This happens after page load, which means it has authenticated if it was ever going to
    // NOT SECURE

    // meals variables
    $scope.arrBreakfasts = [];
    $scope.arrLunches = [];
    $scope.arrDinners = [];
    var arrMeals = [];

    // days variables
    //$scope.weekStart = now;
    if ($scope.weekStart == undefined){
        $scope.weekStart = new Date();
    }
    $scope.test = 5;
    console.log("scope.weekStart=", $scope.weekStart);








    getDays();
    getMeals();

    $scope.grabBreakfast = function(mealDate, dayId){
        console.log("I am going to try and stick a breakfast into this date", mealDate, "with meal id", $scope.breakfast_id, "day id", dayId);
        var day = {};
        day.meal_date = mealDate;
        day.breakfast_id = $scope.breakfast_id;
        if (dayId == undefined){
            console.log("going to insert a day");
            $http.post("/day", day).then(function(response){
                console.log("day saved", response);
                getDays();
            });
        } else {
            day.id = dayId;
            $http.put("/day", day).then(function(response){
                console.log("day updated", response);
                getDays();
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
                getDays();
            });
        } else {
            day.id = dayId;
            $http.put("/day", day).then(function(response){
                console.log("day updated", response);
                getDays();
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
                getDays();
            });
        } else {
            day.id = dayId;
            $http.put("/day", day).then(function(response){
                console.log("day updated", response);
                getDays();
            });
        };
    };


    function getDays(){
        $scope.arrWeek = [];
        // TODO loop through days, add a date to each meal WITHOUT messing up weekstart.
        var mealDate = $scope.weekStart.toDateString();
        var workDate = new Date(mealDate);
        for (var i=0; i<7; i++){
            workDate.setDate(workDate.getDate() + 1);


            var day = {};
            day.meal_date = workDate.toDateString();

            $scope.arrWeek.push(day);
        };
        var start = mealDate;
        var end = $scope.arrWeek[6].meal_date;

        // get days from database that match. Update array accordingly.
        //-------------------------------
        $http.get("/day/" + start + "/" + end ).then(function(response){
            console.log("got some days", response.data);
            //loop through response.data and put each one into scoped variable to
            // feed select dropdowns



            response.data.forEach(function(day){
                    // taskArray.push(task);
                    console.log("day = ", day);

                    // stick a day into the array

                    //console.log(meal);
            });

        });




        //-----------------------------

    };
    $scope.prevWeek = function(){
        $scope.weekStart.setDate($scope.weekStart.getDate() - 7);
        getDays();
    };

    $scope.nextWeek = function(){
        $scope.weekStart.setDate($scope.weekStart.getDate() + 7);
        getDays();
    };




    $scope.newMeal= function(mealType){
        $scope.meal = {};
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
                getMeals();



            });
        };

    };
    $scope.clearBreakfast = function(){
        console.log("Clear breakfast ID");
        $scope.breakfast_id="";
    };
    $scope.editMeal = function(mealId, mealType){
        $scope.meal = {};
        console.log("should we clear", mealType);
        console.log("mealid length", mealId.length);
        if (mealId.length == 0){
            if (mealType =="breakfast"){
                $scope.breakfast_id="";
            }
            if (mealType =="lunch"){
                $scope.lunch_id="";
            }
            if (mealType =="dinner"){
                $scope.dinner_id="";
            }
        }


        console.log("going to edit meal with id:", mealId);
        for (var i= 0; i<arrMeals.length; i++){
            // console.log("checking meal", arrMeals[i]);
            if (arrMeals[i].id == parseInt(mealId)){
                // console.log("got match");
                $scope.meal.id = mealId;
                $scope.meal.label = arrMeals[i].fld_meal_label;
                $scope.meal.dishes = arrMeals[i].fld_meal_dishes;
                $scope.meal.ingredients = arrMeals[i].fld_meal_ingredients;
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

        if ($scope.meal.id == undefined){
            console.log("going to insert");
            $http.post("/meal", meal).then(function(response){
                console.log("meal saved", response);
                $scope.showMealForm = false;
                getMeals();
            });
        } else {
            meal.id = $scope.meal.id;
            $http.put("/meal", meal).then(function(response){
                console.log("meal updated", response);
                $scope.showMealForm = false;
                getMeals();
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

        });

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
