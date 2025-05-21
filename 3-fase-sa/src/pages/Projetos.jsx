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
        <div className="container-projetos">
            <Sidebar />
            <div className="projetos-container">
                <h1 className="projetos-title">Pesquise por projetos</h1>

                <div className="projetos-grid">
                    {projetos.map((projeto, index) => (
                        projeto.destaque ? (
                            <div key={index} className="projeto-com-descricao">
                                <div className="projeto-card"></div>
                                <div className="projeto-card-texto">
                                    {projeto.descricao}
                                </div>
                            </div>
                        ) : (
                            <div key={index} className="projeto-card"></div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}