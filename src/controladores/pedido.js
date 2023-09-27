const conexao = require('../config/conexao')

const salvar = async (req, res, next) => {
    return res.status(200).json({ mensagem: "gerou pedido" })
}

module.exports = {
    salvar
}