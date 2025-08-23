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
            // Vagas:
            const vagasMaximas = 2 // quantidades de vagas
            const totalAtivos = await Alunos.count({where: {status: 'ativo'}}) // contar alunos com status ativo

            // definir o status inicial como ativo
            let status = 'ativo'
            // se o total de alunos ativo já atingiu ou superou o limite de vagas, ele fica com status de espera
            if(totalAtivos >= vagasMaximas) {
                status = 'espera'
            }

            const alunos = {
                nome: req.body.nome,
                cpf: req.body.cpf.replace(/\D/g, ''),
                telefone: req.body.telefone.replace(/\D/g, ''),
                curso: req.body.curso,
                instituicao: req.body.instituicao,
                status
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
            
            // buscar alunos com status ativo
            const ativos = await Alunos.findAll({
                where: {status: 'ativo'},
                raw: true, 
                order: orderOption
            }) 

            ativos.forEach(aluno => {
                aluno.cpf = aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
                aluno.telefone = aluno.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'),
                aluno.data_cadastro = formatarData(aluno.data_cadastro)
            })

            const vagasMaximas = 2
            const totalAtivos = ativos.length
            const totalVagasDisponiveis = vagasMaximas - totalAtivos
            res.render('alunos/all', {ativos, totalVagasDisponiveis, vagasMaximas})

        } catch(error) {
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

    //* Lista de Espera 
    static async showEspera(req,res) {
        try {
            const { order } = req.query; 

            let orderOption = [['data_cadastro', 'DESC']]; // Padrão: mais recente primeiro

            if (order === 'antigo') {
                orderOption = [['data_cadastro', 'ASC']];
            }

            // buscar alunos com status 'espera'
            const espera = await Alunos.findAll({
                where: { status: 'espera' },
                raw: true,
                order: orderOption
            }); 
            
            // formatar a lista de espera
            espera.forEach(aluno => {
                aluno.cpf = aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                aluno.telefone = aluno.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                aluno.data_cadastro = formatarData(aluno.data_cadastro);
            });

            res.render('alunos/lista-espera', { espera })


        } catch(error) {
            console.log(error);
            res.status(500).render('partials/error', { message: 'Erro ao buscar a lista de espera. Tente mais tarde!' });
        }
    }

    //* Status (para ativar o aluno)
    static async ativarAluno(req,res) {
        try {
            const id = req.params.id
            const vagasMaximas = 2

            const totalAtivos = await Alunos.count({where: {status: 'ativo'}})

            if(totalAtivos >= vagasMaximas) {
                return res.status(400).render('partials/error', {message: 'Desculpe, mas todas as vagas foram preenchidas'})
            }

            const aluno = await Alunos.findByPk(id)
            if(!aluno) {
                return res.status(404).render('partials/error', {message: "Aluno não encontrado!"})
            }

            aluno.status = 'ativo'
            await aluno.save()

            res.redirect('/alunos')
        } catch(error) {
            console.log(error)
            res.status(500).render('partials/error', {message: 'Erro ao ativar aluno'})
        }
    }
}