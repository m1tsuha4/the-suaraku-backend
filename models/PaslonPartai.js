const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

const PaslonPartai = sequelize.define('PaslonPartai', {
    paslon_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Paslon', // Name of the Paslon model
            key: 'calon_id'
        }
    },
    partai_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Partai', // Name of the Partai model
            key: 'partai_id'
        }
    }
});

module.exports = PaslonPartai;