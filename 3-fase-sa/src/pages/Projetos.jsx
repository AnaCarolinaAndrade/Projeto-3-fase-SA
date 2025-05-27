import React from 'react';
import './Projetos.css';
import Sidebar from '../components/Sidebar';

const projetos = [
  { nome: "App de Finanças", descricao: "Controle de gastos pessoais", destaque: true },
  { nome: "Plataforma de Cursos", descricao: "Educação online para devs" },
  { nome: "Chat em Tempo Real", descricao: "Socket.IO com autenticação" },
  { nome: "Dashboard Vendas", descricao: "Gráficos com dados reais" },
  { nome: "API Clima", descricao: "Consumo de API externa" },
];

export default function Projetos() {
  return (
    <>
      <Sidebar />
      <div className="projetos-container-humano">
        <h1 className="titulo-projetos">Meus Projetos</h1>

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
    </>
  );
}