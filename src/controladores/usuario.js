const bcrypt = require('bcrypt')
const conexao = require('../config/conexao')

const salvar = async (req, res, next) => {
    return res.status(201).json({ mensagem: "criou" })
}

const listar = async (req, res, next) => {
    return res.status(200).json({ mensagem: "listou" })
}

module.exports = {
    salvar,
    listar
}