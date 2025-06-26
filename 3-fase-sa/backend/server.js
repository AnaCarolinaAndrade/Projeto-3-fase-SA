// backend-investidor/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './back.js';
import investidorRoutes from './routes/investidoresRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json()); 
app.use(cors()); 

app.use('/api/investidores', investidorRoutes);
app.use('/api/projetoEdicao', investidorRoutes);

app.get('/', (req, res) => {
    res.send('API está rodando...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});