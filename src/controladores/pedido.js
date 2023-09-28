const knex = require('../config/conexao')
const pedidoSchema = require('../validacoes/pedidoSchema')

const salvar = async (req, res, next) => {
    try {
        console.log(req.body)
        const teste = await pedidoSchema.validate(req.body)
        const { observacao, pedido_produtos } = req.body
        
        return res.status(200).json(pedido_produtos)
    } catch (excessao) {
        return res.status(400).json({
            erro: excessao.message
        })
    }
}

module.exports = {
    salvar
}