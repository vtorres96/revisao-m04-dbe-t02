const express = require('express');
const router = express.Router();

const autenticacaoControlador = require('../controladores/autenticacao');
const pedidoControlador = require('../controladores/pedido');
const usuarioControlador = require('../controladores/usuario');

router.post('/login' , autenticacaoControlador.login);
router.post('/pedido', pedidoControlador.salvar);
router.post('/usuario', usuarioControlador.salvar);
router.get('/usuario', usuarioControlador.listar);

module.exports = router;
