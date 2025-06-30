
import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// --- Rota 1: buscar um novo projeto ---
router.post('/', async (req, res) => {
    const { nomeProjeto, descricao, imageUrl } = req.body;

    // Validação
    if (!nomeProjeto || !descricao) {
        return res.status(400).json({ message: 'Os campos obrigatórios (título e descrição) são necessários.' });
    }

    try {
        const newProject = await Project.create({
            nomeProjeto,
            descricao,
            imageUrl
        });

        res.status(201).json({
            message: 'Projeto criado com sucesso!',
            project: newProject
        });

    } catch (error) {
        console.error('Erro ao criar projeto:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro no servidor ao criar projeto. Por favor, tente novamente mais tarde.' });
    }
});

// ---Obter um projeto por ID ---
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado.' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error('Erro ao buscar projeto:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de projeto inválido.' });
        }
        res.status(500).json({ message: 'Erro no servidor ao buscar projeto.' });
    }
});

// ---Atualizar um projeto existente ---
router.put('/:id', async (req, res) => {
    const { nomeProjeto, descricao, imageUrl } = req.body;

    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado para atualização.' });
        }

        project.nomeProjeto = nomeProjeto !== undefined ? nomeProjeto : project.nomeProjeto;
        project.descricao = descricao !== undefined ? descricao : project.descricao;
        project.imageUrl = imageUrl !== undefined ? imageUrl : project.imageUrl;

        const updatedProject = await project.save();

        res.status(200).json({
            message: 'Projeto atualizado com sucesso!',
            project: updatedProject
        });

    } catch (error) {
        console.error('Erro ao atualizar projeto:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de projeto inválido para atualização.' });
        }
        res.status(500).json({ message: 'Erro no servidor ao atualizar projeto.' });
    }
});

// --- Deletar um projeto ---
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Projeto não encontrado para exclusão.' });
        }

        res.status(200).json({ message: 'Projeto excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar projeto:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de projeto inválido para exclusão.' });
        }
        res.status(500).json({ message: 'Erro no servidor ao deletar projeto.' });
    }
});

export default router;