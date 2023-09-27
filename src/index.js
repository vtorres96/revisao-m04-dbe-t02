const express = require('express');

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000')
});
