import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import './DetalhesProjeto.css'
import Voltar from '../components/Voltar';


export default function DetalhesProjeto() {
    const { id } = useParams();
    const [projeto, setProjeto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjeto = async () => {
            if (!id) {
                setError('ID do projeto não fornecido.');
                setLoading(false);
                return;
            }

            try {

                const response = await fetch(`http://localhost:5000/api/projetos/${id}`);

                if (!response.ok) {
                    throw new Error(`Erro ao buscar projeto: ${response.status}`);
                }

                const data = await response.json();
                setProjeto(data);
            } catch (err) {
                setError('Erro ao buscar projeto: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjeto();
    }, [id]);

    if (loading) {
        return <div>Carregando detalhes do projeto...</div>;
    }

    if (error) {
        return <div>Erro: {error}</div>;
    }

    if (!projeto) {
        return <div>Projeto não encontrado.</div>;
    }


    return (
        <div className='container-projeto-detalhes'>
            <div>
                <h1>{projeto.nomeProjeto || 'Título do Projeto'}</h1>
                {projeto.url_do_projeto && (
                    <p>Link: <a href={projeto.url_do_projeto} target="_blank" rel="noopener noreferrer">{projeto.url_do_projeto}</a></p>
                )}
                {projeto.imagem && <img src={projeto.imagem} alt="Capa" />}
                <p>{projeto.descricao || 'Descrição do projeto'}</p>
            </div>

        </div>
    )
}
