const yup = require('yup')
const { pt } = require('yup-locales')
yup.setLocale(pt)

const autenticacaoSchema = yup.object().shape({
    email: yup.string().email().required(),
    senha: yup.string().required(),
})

module.exports = autenticacaoSchema