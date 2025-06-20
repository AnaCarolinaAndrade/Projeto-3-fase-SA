
import './Ranking.css'
import Sidebar from '../components/Sidebar.jsx'

const projetos = [
    { nome: "Equipe MyWord", destaque: true },
    { nome: "Projeto 3" },
    { nome: "Projeto 4" },
    { nome: "Projeto 5" },
    { nome: "Projeto 6" },
    { nome: "Projeto7" },
    { nome: "Projeto8" },
    { nome: "Projeto9" },
    { nome: "Projeto11" },
    { nome: "Projeto12" },
    { nome: "Projeto13" },

];

export default function Ranking() {
    return (
        <div>
            <Sidebar />
            <div className='container-ranking'>


                <div className="ranking-container">
                    <h2 className="ranking-title">Ranking projetos</h2>
                    <div className="ranking-card">
                        <h3 className="ranking-subtitle">Projetos Hypados</h3>
                        <div className="ranking-scroll">
                            {projetos.map((projeto, index) => (
                                <div key={index} className="ranking-item">
                                    {projeto.destaque ? (
                                        <img src="./img/logo-myWord.png" alt="Logo" className="ranking-logo" />
                                    ) : (
                                        <div className="ranking-placeholder" />
                                    )}
                                    <span className="ranking-nome">{projeto.nome}</span>
                                    <div className="ranking-bar">
                                        <div
                                            className="ranking-fill"
                                            style={{ width: `${100 - index * 10}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

import React from 'react'


