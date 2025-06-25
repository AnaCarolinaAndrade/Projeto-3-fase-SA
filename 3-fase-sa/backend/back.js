import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const URI = process.env.MONGO_URI;

mongoose.connect(URI)
.then(() => console.log('Conectado ao MongoDB com sucesso!'))
.catch(err => console.error('Erro na conexão com o MongoDB:', err));


