const { DataTypes, Sequelize } = require('sequelize')

const db = require('../db/conn')

const Alunos = db.define('Alunos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
        validate: {
            is: /^\d{11}$/
        }
    },

    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    telefone: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
            is: /^\d{11}$/
        }
    },

    curso: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    instituicao: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    data_cadastro: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

    status: {
        type: DataTypes.ENUM('ativo', 'espera'),
        defaultValue: 'espera'
    }
}, {
    timestamps: false,
    indexes: [
        { unique: true, fields: ['cpf'] }
    ]
})

module.exports = Alunos;

