// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './configDB.js'; // Importa a função de conexão com o DB
import projectRoutes from './routes/projectRoutes.js'; // Importa as rotas de projeto
import investidorRoutes from './routes/investidorRoutes.js'; // Importa as rotas de investidor
import projetoEdicaoRoutes from './routes/projetosEdicao.js'; // Importa as rotas de projetoEdicao

dotenv.config(); // Carrega as variáveis de ambiente

connectDB(); // Chama a função para conectar ao banco de dados

const app = express();

app.use(express.json()); // Middleware para parsear JSON no corpo das requisições
app.use(cors());         // Middleware para habilitar CORS

// Rotas da API
app.use('/api/projectRoutes', projectRoutes); // Usando '/api/projetos' para as rotas de projeto
app.use('/api/investidor', investidorRoutes);
app.use('/api/projetoEdicao', projetoEdicaoRoutes); // Adicionado: Rotas para projetoEdicao

app.get('/', (req, res) => {
    res.send('API está rodando...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
