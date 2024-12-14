const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

const Paslon = sequelize.define('Paslon', {
    calon_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gambar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nomor_urut: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nama_paslon: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nama_gubernur: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nama_wakil_gubernur: {
        type: DataTypes.STRING,
        allowNull: false
    },
    visi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    misi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    program_unggulan: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    biografi: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Paslon;