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
    // meals variables
    $scope.arrBreakfasts = [];
    $scope.arrLunches = [];
    $scope.arrDinners = [];
    var arrMeals = [];

    // days variables
    //$scope.weekStart = now;
    var newDate = new Date();
    for (var i=0; i<7; i++){
        newDate.setDate(newDate.getDate() +1);
        console.log(newDate.toDateString());

    };



    $scope.arrWeek = [];
    $scope.arrWeek.push({"date":"Monday, 11 April","breakfast_label":"eggs"});
    $scope.arrWeek.push({"date":"Tuesday, 12 April","breakfast_label":"toast"});
    $scope.arrWeek.push({"date":"Wednesday, 13 April","breakfast_label":"pancakes"});
    $scope.arrWeek.push({"date":"Thursday, 14 April","breakfast_label":"cereal"});
    $scope.arrWeek.push({"date":"Friday, 15 April","breakfast_label":"maltomeal"});
    $scope.arrWeek.push({"date":"Saturday, 16 April","breakfast_label":"cereal"});
    $scope.arrWeek.push({"date":"Sunday, 17 April","breakfast_label":"toast, juice and eggs"});




    // This happens after page load, which means it has authenticated if it was ever going to
    // NOT SECURE
    getDays();
    getMeals();

    $http.get('/user').then(function(response) {
        if(response.data) {
            $scope.userName = response.data.username;
            console.log('In Plan Controller, User Data: ', $scope.userName);
        } else {
            $window.location.href = '/index.html';
        }
    });

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
        } ;

    };
    $scope.editMeal = function(mealId){
        $scope.meal = {};

        console.log("going to edit meal with id:", mealId);
        for (var i= 0; i<arrMeals.length; i++){
            // console.log("checking meal", arrMeals[i]);
            if (arrMeals[i].id == parseInt(mealId)){
                console.log("got match");
                $scope.meal.id = mealId;
                $scope.meal.label = arrMeals[i].fld_meal_label;
                $scope.meal.dishes = arrMeals[i].fld_meal_dishes;
                $scope.meal.ingredients = arrMeals[i].fld_meal_ingredients;
                $scope.meal.instructions = arrMeals[i].fld_meal_instructions;
                $scope.mealType= arrMeals[i].fld_meal_type;


            }
        }
        $scope.showMealForm = true;

    }

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
        }


    }

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
        }
        return result;
    };


}]);
