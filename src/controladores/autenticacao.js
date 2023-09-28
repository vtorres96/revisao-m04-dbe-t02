const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const knex = require('../config/conexao')
const chaveSecreta = require('../chaveSecreta')
const autenticacaoSchema = require('../validacoes/autenticacaoSchema')

const login = async (req, res, next) => {
    try {
        await autenticacaoSchema.validate(req.body)

        let { email, senha } = req.body
    
        const usuario = await knex('usuarios')
            .where({ email })
            .first()
    
        if (!usuario) {
            return res.status(400).json({
                mensagem: 'Usuário ou senha inválidos'
            })
        }

        const senhaConfere = await bcrypt.compare(senha, usuario.senha)
    
        if (!senhaConfere) {
            return res.status(400).json({
                mensagem: 'Usuário ou senha inválidos'
            })
        }
    
        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            },
            chaveSecreta,
            {
                expiresIn: '2h'
            }
        )

        let { senha: senhaNova, ...usuarioSemSenha } = usuario
        
        return res.status(200).json({
            usuario: usuarioSemSenha,
            token
        })
    } catch (excessao) {
        return res.status(400).json({ erro: excessao.message })
    }
}

module.exports = {
    login
}
