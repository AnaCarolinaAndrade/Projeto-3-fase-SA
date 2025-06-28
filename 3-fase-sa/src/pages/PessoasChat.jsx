import './PessoasChat.css'
import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'

export default function PessoasChat() {

    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/usuarios');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setUsuarios(data);
            } catch (err) {
                setError('Erro ao buscar usuários: ' + err.message);
            }
        };

        fetchUsuarios();
    }, []);

    if (error) {
        return console.log("Erro:", { error });
    }

    if (usuarios.length === 0) {
        return <div className='container-sem-usuarios'>

            <div>
                <p className='sem-usuarios'>Parece que não há nenhum usuário cadastrado no momento.</p>
                <img src="./img/no-user2.png" className='no-users' />   
            </div>

        </div>

    }

    if (!usuarios) return <div className="loading">Carregando...</div>;

    return (
        <div className='container-pessoas-chat'>
            <div>
                <Sidebar />
            </div>
            <div className='container-pessoas'>
                <div className='alinhamento-pessoas'>
                    <div className="usuarios-list">
                        {usuarios.map(usuario => (
                            <div key={usuario._id || usuario.id} className="usuario-item">
                                <button>{usuario.nome}</button>
                                <p> {usuario.descricao}</p>

                                {usuario.genero && <p>Gênero: {usuario.genero}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
