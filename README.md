Meal Planning Database

This is a tool to allow users to plan meals for a household.

The user can create meals, add the ingredients needed for that meal, schedule meals for breakfast lunch or dinner on a given day, assign a person to prepare that meal, and view the ingredients needed for all planned meals in a shopping list.

This application is built using a modified mean stack, with PostgreSQL, Express, Angular, and NodeJS.

I chose to use PostgreSQL as the data structure called for a relational database.

Authorization is handled using Passport with a local authorization strategy using PostgeSQL.

The code base is designed so that the same code can be used locally for development, but will still function if hosted remotely on Heroku, by dynamically checking for port and database connection environment variables.

Future development:

1. Adding weather forecast information.  While using this, I've discovered that the temperature on a given day is a factor for meal preparation and what is a suitable meal on a given day.  I'm currently working on connecting with an open source weather API to add predicted high temperatures for at least a 5 day forecast to aid in meal planning.
2. Creating specific recipes and collecting them into meals.  Currently the ingredients, description, and instructions are for an entire meal, including any courses, sides, or main dishes.  I want to add an additional layer of abstraction where there are specific recipes, and recipes can be collected into meals, which can then be scheduled for a particular day.  This would give me the ability to have a recipe for tabouli that could be incorporated into multiple meals, i.e. kebabs and tabouli for one night, and mousakka and tabouli for another night.
3. storing recipes discovered remotely.  I want to give the user the ability to make a local copy of a recipe that they find online.  First step would be to support this with recipes in existing recipe markup languages, later goal would be to create a tool that analyzes a web page, searches for markers that indicate recipe content such as ingredients or units of measurement, and intelligently scrapes that data for import into my data structure.
4. dynamically create tables and database structure. Currently an installation of this app requires a manual copy of the PostgreSQL database. I want to have the app look for the tables it needs, and if they don't exist, create them.
