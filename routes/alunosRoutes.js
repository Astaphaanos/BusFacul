const express = require('express')
const router = express.Router()


const AlunosController = require('../controllers/AlunosController')

router.get('/add', AlunosController.createAlunos)
router.post('/add', AlunosController.createAlunosSave)
router.get('/', AlunosController.showAlunos)


module.exports = router