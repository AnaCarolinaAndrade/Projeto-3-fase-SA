import express from 'express';
import Investidor from '../models/Investidor.js';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

//rota para registrar um novo investidor
router.post('/register', async (req, res) => {
 const { nome, documento, email, senha, confirmarSenha } = req.body;

   //validação de campos obrigatórios
    if (!nome || !documento || !email || !senha || !confirmarSenha) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
    }
    
    if (senha !== confirmarSenha) {
        return res.status(400).json({ message: 'As senhas não são iguais.' });
    }
   
    if (senha.length < 6) {
        return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    try {
      let investidorByEmail = await Investidor.findOne({ email });
        if (investidorByEmail) {
         return res.status(400).json({ message: 'Já existe uma conta com este email.' });
        }

     let investidorByDocument = await Investidor.findOne({ documento });
        if (investidorByDocument) {
            return res.status(400).json({ message: 'Já existe uma conta com este documento (CPF/CNPJ).' });
        }

      // Cria o novo investidor (a senha será criptografada pelo middleware 'pre-save')
        const investidor = await Investidor.create({
            nome,
            documento,
            email,
            senha
        });

        res.status(201).json({
            message: 'Cadastro realizado com sucesso!',
            investidor: {
                _id: investidor._id,
                nome: investidor.nome,
                email: investidor.email,
                documento: investidor.documento
            }
        });

    } catch (error) {
        console.error('Erro ao cadastrar investidor:', error);
 
        // Lida com erros de validação do Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro no servidor. Por favor, tente novamente mais tarde.' });
    }
});

// --- Rota de Login Normal para Investidores ---//
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Por favor, insira email e senha.' });
    }

    try {
        const investidor = await Investidor.findOne({ email });

        if (!investidor) {
            return res.status(404).json({ message: 'Email ou senha inválidos.' });
        }

        const isMatch = await investidor.matchPassword(senha);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            investidor: {
                _id: investidor._id,
                nome: investidor.nome,
                email: investidor.email,
                documento: investidor.documento,
                genero: investidor.genero
            }
        });

    } catch (error) {
        console.error('Erro no login do investidor:', error);
        res.status(500).json({ message: 'Erro no servidor. Por favor, tente novamente mais tarde.' });
    }
});

// Rota de Login com Google para Investidores //
router.post('/google-login', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ message: 'Token de autenticação do Google não fornecido.' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email } = payload; // Apenas o email é necessário para buscar o usuário existente

        // Tenta encontrar o investidor pelo email do Google
        let investidor = await Investidor.findOne({ email });

        if (investidor) {
            res.status(200).json({
                message: 'Login com Google realizado com sucesso!',
                investidor: {
                    _id: investidor._id,
                    nome: investidor.nome,
                    email: investidor.email,
                    documento: investidor.documento,
                    genero: investidor.genero
                }
            });
        } else {
            // Se o investidor NÃO EXISTE, retorna um erro, pois não há cadastro automático
            return res.status(404).json({ message: 'Nenhuma conta de investidor encontrada com este email Google.' });
        }
    } catch (error) {
        console.error('Erro ao autenticar com Google:', error);
        res.status(401).json({ message: 'Autenticação com Google falhou. Tente novamente.' });
    }
});

export default router;