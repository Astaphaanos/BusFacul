const Alunos = require('../models/Alunos')

module.exports = class AlunosController {
    
    //* CREATE
    static createAlunos(req,res) {
        res.render('alunos/create')
    }

    static async createAlunosSave(req,res) {
        const alunos = {
            nome: req.body.nome,
            cpf: req.body.cpf,
            telefone: req.body.telefone,
            curso: req.body.curso,
            intituicao: req.body.intituicao
        }

        await Alunos.create(alunos)

        res.redirect('/alunos')
    }

    //* HomePage
    static async showAlunos(req,res) {
        const alunos = await Alunos.findAll({raw: true})

        res.render('alunos/all', {alunos})
    }
}