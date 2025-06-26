import './PessoasChat.css'
import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'

export default function PessoasChat() {

    const [usuarios, setUsuarios] = useState([ 'marcos' ]);
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
        return console.log("Nenhum usuário cadastrado ainda.");
    }

    return (
        <div className='container-pessoas-chat'>
            <div>
                <Sidebar />
            </div>
            <div className='container-pessoas'>
                <div className='alinhamento-pessoas'>
                    <ul className="usuarios-list">
                        {usuarios.map(usuario => (
                            <li key={usuario._id || usuario.id} className="usuario-item">
                                <h3>{usuario.nome}</h3>
                                <p>Email: {usuario.email}</p>

                                {usuario.genero && <p>Gênero: {usuario.genero}</p>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
