const bcrypt = require('bcrypt')
const knex = require('../config/conexao')
const usuarioSchema = require('../validacoes/usuarioSchema')

const salvar = async (req, res, next) => {
    try {
        await usuarioSchema.validate(req.body)

        let { nome, email, senha } = req.body

        const usuario = await knex('usuarios').where({ email }).first()

        if (usuario) {
            return res.status(400).json({
                mensagem: 'E-mail já existe em nossa base de dados'
            })
        }

        let senhaCriptografada = await bcrypt.hash(senha, 10)

        const usuarioInserido = await knex('usuarios').insert({
                nome: nome,
                email: email,
                senha: senhaCriptografada
            })
            .returning(['id', 'nome', 'email'])

        return res.status(201).json(usuarioInserido[0])
    } catch (excessao) {
        return res.status(400).json({ erro: excessao.message })
    }
}

const listar = async (req, res, next) => {
    try {
        const { iat, exp, ...usuarioSanitizado } = req.usuario
        console.log(usuarioSanitizado)
        return res.status(200).json(usuarioSanitizado)
    } catch (excessao) {
        return res.status(400).json({ erro: excessao.message })
    }
}

module.exports = {
    salvar,
    listar
}