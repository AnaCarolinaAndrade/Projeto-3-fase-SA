import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (err) {
        console.error('Erro na conexão com o MongoDB:', err.message);
        process.exit(1); 
    }
};

export default connectDB;