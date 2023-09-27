const jwt = require('jsonwebtoken')
const chaveSecreta = require('../chaveSecreta')

const login = (req, res, next) => {
    return res.status(200).json({ mensagem: "autenticou" });
}

module.exports = {
    login
}
