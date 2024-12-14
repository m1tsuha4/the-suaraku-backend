const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');
const User = require('./User'); 

const AccountEth = sequelize.define('AccountEth', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Reference the User model
            key: 'user_id' 
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Ensure that each address is unique
    },
    privateKey: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Establish the association
AccountEth.belongsTo(User, { foreignKey: 'user_id' });

module.exports = AccountEth;
