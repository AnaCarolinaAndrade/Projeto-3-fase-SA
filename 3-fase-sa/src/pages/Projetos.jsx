import './Projetos.css';
import Sidebar from '../components/Sidebar';
import Busca from '../components/Busca.jsx'
import { useState } from 'react';

const projetos = [
  { nome: "App de Finanças", descricao: "Controle de gastos pessoais", destaque: true },
  { nome: "Plataforma de Cursos", descricao: "Educação online para devs" },
  { nome: "Chat em Tempo Real", descricao: "Socket.IO com autenticação" },
  { nome: "Dashboard Vendas", descricao: "Gráficos com dados reais" },
  { nome: "API Clima", descricao: "Consumo de API externa" },
];


export default function Projetos() {

  const [buscar, setBuscar] = useState("")

  return (
    <>
      <Sidebar />
      <div className="projetos-container-humano">
        <div className='container-projetos'>
          <div>
           <Busca buscar={buscar} setBuscar={setBuscar} />
          </div>

          <div className="lista-projetos">
            {projetos.map((projeto, index) => ( 
              <div className="card-projeto" key={index}>
                <div className="projeto-logo-humano">
                  {projeto.destaque ? '🔥' : '📄'}
                </div>
                <div className="texto-projeto">
                  <strong>{projeto.nome}</strong>
                  <p>{projeto.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}