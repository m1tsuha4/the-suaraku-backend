const { DataTypes } = require ('sequelize');
const sequelize = require ('../database/database.js');
// const AccountEth = require ('./AccountEth.js');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nik: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// User.hasOne(AccountEth, { foreignKey: 'user_id' });

module.exports = User;