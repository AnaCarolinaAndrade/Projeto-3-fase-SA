import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const InvestorSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
    },
    documento: { 
        type: String,
        required: [true, 'Documento é obrigatório'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Por favor, insira um email válido']
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'A senha deve ter no mínimo 6 caracteres']
    },
    genero: {
        type: String,
        enum: ['Masculino', 'Feminino', 'Outro', 'Prefiro não dizer', ''], 
        default: '',
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    }
});


InvestorSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

InvestorSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.senha);
};

const Investor = mongoose.model('Investor', InvestorSchema);

export default Investor;