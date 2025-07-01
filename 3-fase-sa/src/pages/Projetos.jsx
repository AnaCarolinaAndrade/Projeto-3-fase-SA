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

  return (
    <div className="container-projetos">
      <div>
        <Sidebar />
      </div>
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
              <Link key={projeto.id} className="card-projeto" to={`/projetos/${projeto.id}`}>
                {projeto.imagem && <img src={projeto.imagem} alt="Capa" className='card-projeto-imagem' />}
                <div className='info-projeto'> 
                  <div class="card-projeto-overlay"></div>
                  <h2 className='card-projeto-titulo'>{projeto.nomeProjeto}</h2>
                  <p className='card-projeto-descricao'>{projeto.descricao}</p>
                  <span className="categoria-projeto">{projeto.categoria}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}