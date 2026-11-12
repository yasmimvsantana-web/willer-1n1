const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas para Pessoa
app.get('/pessoas', async (req, res) => {
  try {
    const pessoas = await prisma.pessoa.findMany({
      include: { cpf: true }, // Inclui o CPF relacionado
    });
    res.json(pessoas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pessoas' });
  }
});

app.post('/pessoas', async (req, res) => {
  try {
    const { nome, email, cpf } = req.body;
    const pessoa = await prisma.pessoa.create({
      data: {
        nome,
        email,
        cpf: cpf ? { create: { numerocpf: cpf } } : undefined,
      },
    });
    res.json(pessoa);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pessoa' });
  }
});

// Rotas para Cpf
app.get('/cpfs', async (req, res) => {
  try {
    const cpfs = await prisma.cpf.findMany({
      include: { pessoa: true }, // Inclui a Pessoa relacionada
    });
    res.json(cpfs);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar CPFs' });
  }
});

app.post('/cpfs', async (req, res) => {
  try {
    const { numerocpf, pessoaId } = req.body;
    const cpf = await prisma.cpf.create({
      data: {
        numerocpf,
        pessoaId,
      },
    });
    res.json(cpf);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar CPF' });
  }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});