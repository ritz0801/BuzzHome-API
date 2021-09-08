# buzzhome-api

Step 1: Install dependencies: type "yarn" or "npm install" in command line

Step 2: Create file "config.js" in  buzzhome-api\database\config

Step 3: Copy all code in example.js to config.js => In obj development edit database: "your database name"

Step 4: Import database, use Postgresql database.
To generate table: npx sequelize-cli db:migrate
Then import seeder data: npx sequelize-cli db:seed:all

Step 5: To start project type "yarn start" or "npm start" in command line
