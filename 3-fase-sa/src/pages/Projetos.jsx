import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Projetos.css';
import { Link } from 'react-router-dom';

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5173/api/criar_projetos')
      .then(res => res.json())
      .then(data => {
        setProjetos(data);
      })
      .catch(err => {
        console.error("Erro ao buscar projetos:", err);
      });
  }, []);

  const editarProjeto = (id) => {
    const novoTitulo = prompt("Novo título do projeto:");
    const novaDescricao = prompt("Nova descrição do projeto:");

    if (!novoTitulo || !novaDescricao) return;

    fetch(`http://localhost:5000/projetos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: novoTitulo, descricao: novaDescricao })
    })
    .then(res => res.json())
    .then(data => {
      alert("Projeto atualizado!");
      // Atualizar a lista
      setProjetos(prev =>
        prev.map(p => (p.id === id ? { ...p, nomeProjeto: novoTitulo, descricao: novaDescricao } : p))
      );
    })
    .catch(err => console.error("Erro ao editar:", err));
  };

  const excluirProjeto = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este projeto?")) return;

    fetch(`http://localhost:5000/projetos/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      alert(data.mensagem || "Projeto excluído.");
      setProjetos(prev => prev.filter(p => p.id !== id));
    })
    .catch(err => console.error("Erro ao excluir:", err));
  };

  return (
    <div className="container-projetos">
      <Sidebar />
      <div className='container-projetos-cards-projetos'> 
        <div className='container-cards-projetos'>
          {projetos.length === 0 &&
            <div className='container-sem-projetos'>
              <p className='sem-projetos'>Nenhum projeto disponível no momento.</p>
              <img src="./img/no-projects.png" className='img-sem-projetos' />
            </div>
          }

          <div className="lista-projetos">
            {projetos.map(projeto => (
              <div key={projeto.id} className="card-projeto">
                <Link to={`/projetos/${projeto.id}`}>
                  {projeto.imagem && <img src={projeto.imagem} alt="Capa" className='card-projeto-imagem' />}
                  <div className='info-projeto'> 
                    <div className="card-projeto-overlay"></div>
                    <h2 className='card-projeto-titulo'>{projeto.nomeProjeto}</h2>
                    <p className='card-projeto-descricao'>{projeto.descricao}</p>
                    <span className="categoria-projeto">{projeto.categoria}</span>
                  </div>
                </Link>
                <div className="botoes-projeto">
                  <button onClick={() => editarProjeto(projeto.id)}>Editar</button>
                  <button onClick={() => excluirProjeto(projeto.id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
