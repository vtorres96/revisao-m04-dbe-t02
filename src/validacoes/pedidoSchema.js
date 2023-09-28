const yup = require('yup')

const pedidoSchema = yup.object().shape({
    observacao: yup.string().default('').nullable(),
    pedido_produtos: yup.array().of(
        yup.object().shape({
            produto_id: yup.number().positive().integer().required(),
            quantidade_produto: yup.number().positive().integer().required()
        })
    )
})

module.exports = pedidoSchema