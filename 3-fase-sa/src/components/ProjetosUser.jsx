import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import './ProjetosUser.css';
import { Link } from 'react-router-dom';

export default function ProjetosUser() {
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
        <div className="container-projetos-user">
            <div className='container-projetos-cards-projetos-user'>
                <div className='container-cards-projetos-user'>
                    {projetos.length === 0 &&
                        <div className='container-sem-projetos-user'>
                            <p className='sem-projetos-user'>Nenhum projeto disponível no momento.</p>
                            <img src="./img/no-projects.png" className='img-sem-projetos-user' />
                        </div>
                    }

                    <div className="lista-projetos-user">
                        {projetos.map(projeto => (
                            <Link key={projeto.id} className="card-projeto-user" to={`/projetos/${projeto.id}`}>
                                {projeto.imagem && <img src={projeto.imagem} alt="Capa" className='card-projeto-imagem-user' />}
                                <div className='info-projeto-user'>
                                    <div class="card-projeto-overlay-user"></div>
                                    <h2 className='card-projeto-titulo-user'>{projeto.nomeProjeto}</h2>
                                    <p className='card-projeto-descricao-user'>{projeto.descricao}</p>
                                    <span className="categoria-projeto-user">{projeto.categoria}</span>
                                </div>
                            </Link>
                        ))} 

                        <div className='novo-projeto'>
                            <Link to={'/criarProjeto'} className='botoes-projetos-user'>Criar um novo projeto</Link>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}