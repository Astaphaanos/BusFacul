const Alunos = require('../models/Alunos')
const formatarData = require('../public/js/formatarData')

module.exports = class AlunosController {
    
    //* CREATE (GET)
    static createAlunos(req,res) {
        res.render('alunos/create')
    }

    //* CREATE POST
    static async createAlunosSave(req,res) {
        try {
            // quantidades de vagas
            const vagasMaximas = 59

            //contando quantos alunos cadastrados
            const totalAlunos = await Alunos.count()

            // verificando se o total de alunos cadastrados ultrapassa a quantidade de vagas
            if(totalAlunos >= vagasMaximas) {
                return res.render('partials/error', {
                    message: 'Desculpe, todas as vagas para o ônibus foram preenchidas!'
                })
            }

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
            // Se tiver cpf duplicado, vai aparecer uma mensagem de erro
            if(error.name === 'SequelizeUniqueConstraintError') {
                const errorMessage = 'O CPF informado já está cadastrado. Por favor, verifique os dados.'
                res.render('alunos/create', {message: errorMessage, alunos: req.body})
            } else {
                console.log('Erro ao criar aluno:', error)
                res.status(500).send('Erro ao cadastrar aluno')
            }
        }
    }

    //* Mostrar Dados dos alunos
    static async showAlunos(req,res) {
        try {
            const {order} = req.query // pegar os parametros de ordenação pela URL

            let orderOption = [['data_cadastro', 'DESC']] // O padrão vai ser o mais recente (normal)
            if (order === 'antigo') { // se o parametro 'order' for 'antigo' altera a ordenação
                orderOption = [['data_cadastro', 'ASC']]
            }
            const alunos = await Alunos.findAll({raw: true, order: orderOption}) // aplica a ordenação

            const totalAlunos = await Alunos.count()

            // formatação visual do cpf e telefone
            alunos.forEach(aluno => {
                aluno.cpf = aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
                aluno.telefone = aluno.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'),
                aluno.data_cadastro = formatarData(aluno.data_cadastro)
            })

            res.render('alunos/all', {alunos, totalAlunos})
        }catch(error) {
            console.log(error)
            res.status(500).render('partials/error', {message: 'Erro ao buscar aluno. Tente mais tarde!'})
        }
    }

    //* UPDATE (GET)
    static async alunosEdit(req,res) {
        const id = req.params.id

        const alunos = await Alunos.findOne({where: {id:id}, raw:true})

        res.render('alunos/edit', {alunos})
    }

    //* UPDATE (POST)
    static async alunosEditSave(req,res) {
        try {
            const id = req.body.id

            const alunos = {
                nome: req.body.nome,
                cpf: req.body.cpf.replace(/\D/g, ''),
                telefone: req.body.telefone.replace(/\D/g, ''),
                curso: req.body.curso,
                instituicao: req.body.instituicao
            }

        await Alunos.update(alunos, { where: {id:id} })

        res.redirect('/alunos')
        } catch(error) {
            console.log('Erro ao editar aluno:', error)
            res.status(500).render('partials/error', {message: 'Erro ao editar cadastro. Tente mais tarde!'})
        }
    }

    //* DELETE
    static async alunosDelete(req, res) {
        const id = req.body.id

        await Alunos.destroy( { where: {id:id} })
        res.redirect('/alunos')
    }

    //* SEARCH ALUNOS (buscador por cpf)
    static async searchAlunos(req,res) {
        const cpf = (req.query.cpf).replace(/\D/g, "") 

        try{
            const alunos = await Alunos.findOne( { where: {cpf} })

            if(!alunos) {
                return res.render('partials/error', {message: "Aluno não encontrado"})
            }

            // para ficar na formatação que nem tem no showAlunos
            const alunosFormatado = {
                ...alunos.dataValues,
                cpf: alunos.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
                telefone: alunos.telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"),
                data_cadastro: formatarData(alunos.data_cadastro)
            }

            res.render('alunos/searchResult', {alunos: alunosFormatado})
        } catch (error) {
            console.log(error)
            res.status(500).send('Erro no servidor')
        }
    }
}