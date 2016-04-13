// connection.js
var connectionString = '';

var pg = require('pg');
if (process.env.DATABASE_URL){
    pg.defaults.ssl=true;
    connectionString = process.env.DATABASE_URL;
} else {
    connectionString = 'postgress://localhost:5432/db_meal_planner';
}

// if(process.env.DATABASE_URL != undefined) {
//     connectionString = process.env.DATABASE_URL + 'ssl';
// } else {
//     // connectionString = 'postgres://localhost:5432/passport-users';
//     connectionString = 'postgres://localhost:5432/db_meal_planner';
//
// }

module.exports = connectionString;
