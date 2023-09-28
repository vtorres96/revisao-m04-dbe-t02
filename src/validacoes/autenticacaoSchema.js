const yup = require('yup')

const autenticacaoSchema = yup.object().shape({
    email: yup.string().email().required(),
    senha: yup.string().required(),
})

module.exports = autenticacaoSchema