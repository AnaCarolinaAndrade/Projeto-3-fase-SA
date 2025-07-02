// backend-investidor e projetoEdicao/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
<<<<<<< HEAD

import connectDB from './projectRoutes.js';
import investidorRoutes from './routes/investidoresRoutes.js';
import projetoEdicao from './routes/projetosEdicao.js';
=======
import connectDB from './routes/projectRoutes.js';
import investidorRoutes from './routes/investidorRoutes.js';
import projetoEdicao from './routes/projectRoutes.js';
>>>>>>> 3b6fd70e9db5333ed1b87d0b53f11ad43e87008f

dotenv.config();

connectDB();

const app = express();

app.use(express.json()); 
app.use(cors()); 

app.use('/api/investidores', investidorRoutes);
app.use('/api/projetoEdicao', projetoEdicao);

app.get('/', (req, res) => {
    res.send('API está rodando...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});