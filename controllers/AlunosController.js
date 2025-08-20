const Alunos = require('../models/Alunos')
const formatarData = require('../public/js/formatarData')

module.exports = class AlunosController {
    
    //* CREATE
    static createAlunos(req,res) {
        res.render('alunos/create')
    }

    static async createAlunosSave(req,res) {
        try {
            const alunos = {
            nome: req.body.nome,
            cpf: req.body.cpf.replace(/\D/g, ''),
            telefone: req.body.telefone.replace(/\D/g, ''),
            curso: req.body.curso,
            instituicao: req.body.instituicao
        }

        await Alunos.create(alunos)

        res.redirect('/alunos')
        } catch(error) {
            console.log('Erro ao criar aluno:', error)
            res.status(500).send('Erro ao cadastrar aluno')
        }
    }

    //* HomePage
    static async showAlunos(req,res) {
        try {
            const alunos = await Alunos.findAll({raw: true})

            // formatação visual do cpf e telefone
            alunos.forEach(aluno => {
                aluno.cpf = aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
                aluno.telefone = aluno.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'),
                aluno.data_cadastro = formatarData(aluno.data_cadastro)
            })

            res.render('alunos/all', {alunos})
        }catch(error) {
            console.log(error)
            res.status(500).send('Erro ao buscar aluno')
        }
    }
}