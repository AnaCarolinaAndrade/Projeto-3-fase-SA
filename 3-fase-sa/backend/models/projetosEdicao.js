import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({

    profissional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfissional',
        required: true
    },

    NomeProjeto: { 
        type: String,
        required: [true, 'O nome do projeto é obrigatório'],
        trim: true,
    },
    descricao: {
        type: String,
        required: [true, 'A descrição do projeto é obrigatória'],
        trim: true,
    },
    imageUrl: { 
        type: String,
        default: '', 
        trim: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now,
    },
});

const projetoEdicao = mongoose.model('projetoEdicao', ProjectSchema);

export default projetoEdicao;