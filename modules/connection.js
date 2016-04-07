// connection.js
var connectionString = '';

if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    // connectionString = 'postgres://localhost:5432/passport-users';
    connectionString = 'postgres://localhost:5432/db_meal_planner';

}

module.exports = connectionString;
