const express = require('express')
const router = express.Router()


const AlunosController = require('../controllers/AlunosController')

router.get('/add', AlunosController.createAlunos)
router.post('/add', AlunosController.createAlunosSave)
router.post('/delete', AlunosController.alunosDelete)
router.get('/edit/:id', AlunosController.alunosEdit)
router.post('/edit', AlunosController.alunosEditSave)
router.get('/search', AlunosController.searchAlunos)
router.get('/lista-espera', AlunosController.showEspera)
router.post('/ativar/:id', AlunosController.ativarAluno)
router.post('/lista-espera/delete', AlunosController.alunosEsperaDelete)
router.get('/', AlunosController.showAlunos)


module.exports = router