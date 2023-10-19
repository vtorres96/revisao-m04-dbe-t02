const knex = require('../config/conexao')
const pedidoSchema = require('../validacoes/pedidoSchema')

const salvar = async (req, res, next) => {
    try {
        await pedidoSchema.validate(req.body)
        const { observacao, pedido_produtos } = req.body
        const usuario_id = req.usuario.id
        
        // 1 - se todos os valores recebidos dentro das propriedades 
        // `produto_id` realmente pertencem a produtos existentes na base de dados
        //     se não existir armazenaremos um erro
        // 2 - se o produtos existir teremos que aplicar uma condição de validação
        // para saber se a quantidade do produto informada na propriedade `quantidade_produto`
        // é superior a quantidade do produto em estoque
        // 3 - inserir registro na tabela pedidos
        // 4 - obter o id do registro gerado na tabela pedidos e utilizá-lo,
        // vinculando-o a cada item que pertence ao pedido e também deveremos
        // registrar cada item que compõe o pedido na tabela pedido_produtos
        // 5 - reduzir a quantidade do produto na tabela produtos

        let erros = []
        let valorTotal = 0
        for (const item of pedido_produtos) {
            let produtoCorrente = await knex('produtos')
                .where('id', '=', item.produto_id)
                .first()
            
            if (!produtoCorrente) {
                erros.push({
                    mensagem: `Não existe produto para o produto_id informado: ${item.produto_id}`
                })
                continue
            }

            if (item.quantidade_produto > produtoCorrente.quantidade_estoque) {
                erros.push({
                    mensagem: `A quantidade solicitada: ${item.quantidade_produto} para o produto de ID: ${produtoCorrente.id} é maior que a quantidade atual em estoque: ${produtoCorrente.quantidade_estoque}`
                })
                continue
            }
            // visto que o produto existe e a quantidade informada é válida
            // iremos calcular o valor total do pedido e tambem adicionaremos
            // as propriedades valor_produto e quantidade_estoque para cada item
            // a fim de poupar consulta no banco de dados para obter esses valores novamente
            // no momento de trabalhar com as tabelas pedido_produtos
            valorTotal += produtoCorrente.valor * item.quantidade_produto
            item.valor_produto = produtoCorrente.valor
            item.quantidade_estoque = produtoCorrente.quantidade_estoque
        }

        if (erros.length > 0) {
            return res.status(400).json({ erros })
        }

        const pedido = await knex('pedidos')
            .insert({
                usuario_id: usuario_id,
                observacao: observacao,
                valor_total: valorTotal
            })
            .returning('*');

        for (const item of pedido_produtos) {   
            await knex('pedido_produtos')
                .insert({
                    pedido_id: pedido[0].id,
                    produto_id: item.produto_id,
                    quantidade_produto: item.quantidade_produto,
                    valor_produto: item.valor_produto
                })
                .returning('*');
            
            let quantidadeEstoqueReduzida = item.quantidade_estoque - item.quantidade_produto;
            
            await knex('produtos')
                .where('id', '=', item.produto_id)
                .update({
                    quantidade_estoque: quantidadeEstoqueReduzida,
                },
                ['*']);
        }
            
        return res.status(201).json({ mensagem: 'Pedido gerado com sucesso' })
    } catch (excessao) {
        return res.status(400).json({
            erro: excessao.message
        })
    }
}

module.exports = {
    salvar
}