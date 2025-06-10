import './Projetos.css';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Busca from '../components/Busca.jsx'
import Filter from '../components/Filter.jsx'
import Lista from '../components/Lista.jsx'

export default function Projetos() {

  const [lista, setLista] = useState([])
  const [buscar, setBuscar] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc")

  useEffect(() => {
    const carregarProjetos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projetos');
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
          <Busca buscar={buscar} setBuscar={setBuscar} />
          <Filter filter={filter} setFilter={setFilter} setSort={setSort} />
          <div className='lista-tarefas'>
            {lista
              .filter((item) =>
                filter === "All"
                  ? true
                  : filter === "Completed"
                    ? item.completo
                    : !item.completo
              )
              .filter((item) =>
                item.text.toLowerCase().includes(buscar.toLowerCase()) ||
                item.nomeProjeto.toLowerCase().includes(buscar.toLowerCase())
              )
              .sort((a, b) =>
                sort === "Asc"
                  ? (a.text || a.nomeProjeto).localeCompare(b.text || b.nomeProjeto)
                  : (b.text || b.nomeProjeto).localeCompare(a.text || a.nomeProjeto)
              )
              .map((item) => (
                <Lista key={item.id}
                  lista={item}
                />
              ))}
          </div>
        </div>
      </div>

    </>
  );
}