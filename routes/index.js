var express = require('express');
var router = express.Router();
var passport = require('passport');

// Handles login form POST from index.html
router.post('/',
    passport.authenticate('local', {
        successRedirect: '/views/planner.html',
        failureRedirect: '/views/failure.html'
    })
);
// riley added


router.get('/logout', function (req, res){
    console.log("Trying to logout, am I here");
    req.logout();
    res.redirect('/');

  });




module.exports = router;
