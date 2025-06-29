// frontend/src/components/ProjetoEdicao/ProjetoEdicao.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjetoEdicao.css';

function ProjetoEdicao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({
    titulo: '',
    descricao: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/projetoEdicao`);
        const data = await response.json();

        if (response.ok) {
          setProject({
            titulo: data.titulo || '',
            descricao: data.descricao || '',
            imageUrl: data.imageUrl || ''
          });
        } else {
          setError(data.message || 'Erro ao carregar o projeto.');
          console.error('Erro ao carregar projeto:', data.message);
        }
      } catch (err) {
        console.error('Erro na requisição para carregar projeto:', err);
        setError('Erro de conexão ao carregar o projeto.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    } else {
      setError('ID do projeto não fornecido na URL.');
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({
      ...project,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/projetosEdicao`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Projeto atualizado com sucesso!');
        navigate('/meus-projetos');
      } else {
        setError(data.message || 'Erro ao atualizar o projeto. Tente novamente.');
        console.error('Erro ao atualizar projeto:', data.message);
      }
    } catch (err) {
      console.error('Erro na requisição para atualizar projeto:', err);
      setError('Erro de conexão ao atualizar o projeto. Verifique sua rede.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container-projeto-edicao-cor"><p>Carregando dados do projeto...</p></div>;
  }

  if (error && !project.titulo) {
    return <div className="container-projeto-edicao-cor"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className='container-projeto-edicao-cor'>
      <div className='container-projeto-edicao-alinhamento'>
        <img src='./img/logo_pequena.png' alt="Logo" className='logo' />
        <h1 className='container-titulo'>Editar Projeto</h1>

        <form onSubmit={handleSubmit}>
          <div className='alinhamentos'>
            <h2 className='titiulo-edicao'>Ediçao de projeto</h2>
            <div className='alinhamento-esquerda-edicao'>
              <label>URL da Imagem do Projeto</label>
              <input
                type='text'
                id='imageUrl'
                name='imageUrl'
                value={project.imageUrl}
                onChange={handleChange}
                placeholder="Insira o URL da imagem"
              />
              {project.imageUrl && (
                <div className="project-image-preview">
                  <p>Pré-visualização da Imagem:</p>
                  <img src={project.imageUrl} alt="Pré-visualização do Projeto"/>
                </div>
              )}

              <label>Nome do Projeto</label>
              <input
                type='text'
                id='titulo'
                name='titulo'
                value={project.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className='alinhamento-direita-edicao'>
              <label>Descrição do Projeto</label>
              <textarea
                id='descricao'
                name='descricao'
                value={project.descricao}
                onChange={handleChange}
                required
              ></textarea>
              
            </div>
          </div>

          {error && <p style={{ color: 'red', background: 'transparent' }}>{error}</p>}
          <button className='container-button-edicaoProjeto' type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProjetoEdicao;