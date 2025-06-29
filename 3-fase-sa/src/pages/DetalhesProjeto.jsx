import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';


export default function DetalhesProjeto() {
    const [usuario, setUsuario] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/usuarios');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setUsuario(data);
            } catch (err) {
                setError('Erro ao buscar usuário: ' + err.message);
            }
        };

        fetchUsuario();
    }, []);

    return (
        <div>
            <div className="usuarios-list">
                {usuario(usuario => (
                    <div key={usuario._id || usuario.id} className="usuario-item">
                        <button>{usuario.nome}</button>
                        <p> {usuario.descricao}</p>

                        {usuario.genero && <p>Gênero: {usuario.genero}</p>}
                    </div>
                ))}
            </div>
        </div>
    )
}
