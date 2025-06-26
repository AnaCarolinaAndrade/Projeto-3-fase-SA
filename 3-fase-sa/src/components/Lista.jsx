import './Lista.css'
import { useState, useEffect } from 'react';



function Lista({ lista }) {

  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    const carregarProjetos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/projetos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          console.error("Usuário não autorizado. Token inválido ou ausente.");
          return;
        }

        const data = await response.json();
        setLista(data.projetos || []);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };

    carregarProjetos();
  }, []);

  return (
    <div className='Lista'>
      <h2>{lista.titulo}</h2>
      <div className='content'>
        <p>{lista.descricao}</p>
      </div>
    </div>
  )
}

export default Lista;