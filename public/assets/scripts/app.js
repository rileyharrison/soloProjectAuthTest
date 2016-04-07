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
    $scope.arrBreakfasts = [];
    $scope.arrLunches = [];
    $scope.arrDinners = [];
    var arrMeals = [];

    // This happens after page load, which means it has authenticated if it was ever going to
    // NOT SECURE
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

        //check for new or update




        // send a post request to meal.js.
        // Figure out how to make sure that this is what I want to do, and that it knows
        // this is inserting a meal, not UPDATE a meal or INSERT something else.
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


}]);
