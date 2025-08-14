const { DataTypes, Sequelize } = require('sequelize')

const db = require('../db/conn')

const Alunos = db.define('Alunos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    
    cpf: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
        validate: {
            is: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
        }
    },

    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    telefone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
            is: /^(\+\d{1,3})?\d{10,15}$/
        }
    },

    curso: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    instituicao: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    data_cadastro: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    timestamps: false,
    indexes: [
        { unique: true, fields: ['cpf'] }
    ]
})

module.exports = Alunos;

