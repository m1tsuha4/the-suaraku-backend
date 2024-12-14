const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');
const { type } = require('jquery');

const Partai = sequelize.define('Partai', {
    partai_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_partai: {
        type: DataTypes.STRING,
        allowNull: false
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Partai;