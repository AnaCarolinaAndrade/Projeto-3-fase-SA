import './Projetos.css';
import Sidebar from '../components/Sidebar.jsx';

const projetos = [
    { nome: "App de Finanças", descricao: "Controle de gastos pessoais", destaque: true },
    { nome: "Plataforma de Cursos", descricao: "Educação online para devs" },
    { nome: "Chat em Tempo Real", descricao: "Socket.IO com autenticação" },
    { nome: "Dashboard Vendas", descricao: "Gráficos com dados reais" },
    { nome: "API Clima", descricao: "Consumo de API externa" },
];

export default function Projetos() {
    return (
        <div className='container-projetos'>
            <Sidebar />
            <div className="projetos-container">
                <h2 className="projetos-title">Projetos em Destaque</h2>
                <div className="projetos-scroll">
                    {projetos.map((projeto, index) => (
                        <div key={index} className="projeto-item">
                            {projeto.destaque ? (
                                <img src="./img/projeto-destaque.png" alt="Logo" className="projeto-logo" />
                            ) : (
                                <div className="projeto-placeholder" />
                            )}
                            <div className="projeto-info">
                                <h3 className="projeto-nome">{projeto.nome}</h3>
                                <p className="projeto-descricao">{projeto.descricao}</p>
                            </div>
                            <div className="projeto-bar">
                                <div className="projeto-fill" style={{ width: `${90 - index * 10}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}