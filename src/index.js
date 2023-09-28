const express = require('express');
require('dotenv').config()

const rotas = require('./rotas/rotas');

const app = express();

app.use(express.json());
app.use(rotas);

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000')
});
