import './Projetos.css';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Busca from '../components/Busca.jsx'
import Filter from '../components/Filter.jsx'
import Lista from '../components/Lista.jsx'
import { jwtDecode } from 'jwt-decode';

export default function Projetos() {

  const [lista, setLista] = useState([])
  const [buscar, setBuscar] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc")
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const decodedToken = jwtDecode(token);
        setCurrentUserId(decodedToken.sub);
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setCurrentUserId(null);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

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
    <>
      <div className='container-projetos'>
        <div>
          <Sidebar />
        </div>
        <div className='projetos'>
          <div className='card-projetos'>
            <Busca buscar={buscar} setBuscar={setBuscar} />
            <Filter filter={filter} setFilter={setFilter} setSort={setSort} />
            <div className='lista-tarefas'>
              {lista
                .filter((item) => {
                  switch (filter) {
                    case "All":
                      return true;
                    case "Completed":
                      return item.completo === true;
                    case "Incompleted":
                      return item.completo === false;
                    case "api":
                    case "sites":
                    case "back":
                      return (item.categoria || '').toLowerCase() === filter.toLowerCase();
                    default:
                      return true;
                  }
                })
                .filter((item) =>
                  item.descricao.toLowerCase().includes(buscar.toLowerCase()) ||
                  item.nomeProjeto.toLowerCase().includes(buscar.toLowerCase())
                )
                .sort((a, b) =>
                  sort === "Asc"
                    ? (a.nomeProjeto || '').localeCompare((b.nomeProjeto || ''))
                    : (b.nomeProjeto || '').localeCompare((a.nomeProjeto || ''))
                )
                .map((item) => ( 
                  <Lista key={item.id}
                    lista={item}
                  />
                ))}
            </div>

          </div>
        </div>
      </div>

    </>
  );
}