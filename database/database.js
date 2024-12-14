   // database.js
   const { Sequelize } = require('sequelize');

   // Create a new instance of Sequelize for SQLite
   const sequelize = new Sequelize({
       dialect: 'sqlite',
       storage: 'database.sqlite' // Path to your SQLite database file
   });

   module.exports = sequelize;
