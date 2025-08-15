const express = require('express')
const exphs = require('express-handlebars')

const app = express()

const conn = require('./db/conn')
const Alunos = require('./models/Alunos')
const alunosRoutes = require('./routes/alunosRoutes')


app.engine('handlebars', exphs.engine())
app.set('view engine', 'handlebars')

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(express.static('public'))

app.use('/alunos', alunosRoutes)

conn.sync().then(() => {
    console.log('Conectado ao Banco de Dados...')
    app.listen(3000)
}).catch((error) => console.log(error))
