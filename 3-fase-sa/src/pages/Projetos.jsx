import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Projetos.css';

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/projetos')
      .then(res => res.json())
      .then(data => {
        setProjetos(data);
      })
      .catch(err => {
        console.error("Erro ao buscar projetos:", err);
      });
  }, []);

  return (
    <div className="container-projetos">
      <div>
        <Sidebar />
      </div>
      {projetos.length === 0 && <p>Nenhum projeto encontrado.</p>}
      <div className="lista-projetos">
        {projetos.map(projeto => (
          <div key={projeto.id} className="card-projeto">
            {projeto.imagem && <img src={projeto.imagem} alt="Capa" />}
            <h2>{projeto.nomeProjeto}</h2>
            <p>{projeto.descricao}</p>
            <span className="categoria-projeto">{projeto.categoria}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
