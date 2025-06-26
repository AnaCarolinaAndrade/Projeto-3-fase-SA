import express from 'express';
import Investor from '../models/Investor.js';
import bcrypt from 'bcryptjs';

const router = express.Router();


router.post('/register', async (req, res) => {
    const { nome, documento, email, senha, confirmarSenha, genero } = req.body;

 
    if (!nome || !documento || !email || !senha || !confirmarSenha) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
    }

    if (senha !== confirmarSenha) {
        return res.status(400).json({ message: 'As senhas não coincidem.' });
    }

    if (senha.length < 6) {
        return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    try {
       
        let investorByEmail = await Investor.findOne({ email });
        if (investorByEmail) {
            return res.status(400).json({ message: 'Já existe uma conta com este email.' });
        }

        let investorByDocument = await Investor.findOne({ documento });
        if (investorByDocument) {
            return res.status(400).json({ message: 'Já existe uma conta com este documento (CPF/CNPJ).' });
        }

        const investor = await Investor.create({
            nome,
            documento,
            email,
            senha,
            genero 
        });

        res.status(201).json({
            message: 'Cadastro realizado com sucesso!',
            investor: {
                _id: investor._id,
                nome: investor.nome,
                email: investor.email,
                documento: investor.documento,
                genero: investor.genero
            }
        });

    } catch (error) {
        console.error('Erro ao cadastrar investidor:', error);
 
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro no servidor. Por favor, tente novamente mais tarde.' });
    }
});

export default router;