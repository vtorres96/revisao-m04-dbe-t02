const yup = require('yup')
const { pt } = require('yup-locales')
yup.setLocale(pt)

const usuarioSchema = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().required(),
})

module.exports = usuarioSchema