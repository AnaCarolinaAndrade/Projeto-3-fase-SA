import './Projetos.css';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Busca from '../components/Busca.jsx'
import Filter from '../components/Filter.jsx'
import Lista from '../components/Lista.jsx'


const projetos = [
  { nome: "App de Finanças", descricao: "Controle de gastos pessoais", destaque: true },
  { nome: "Plataforma de Cursos", descricao: "Educação online para devs" },
  { nome: "Chat em Tempo Real", descricao: "Socket.IO com autenticação" },
  { nome: "Dashboard Vendas", descricao: "Gráficos com dados reais" },
  { nome: "API Clima", descricao: "Consumo de API externa" },
];


export default function Projetos() {

  const [lista] = useState([
    {
      id: 1,
      text: "Arrumar um namorado pra Ana",
    },
    {
      id: 2,
      text: "Criar o back da aba projetos",

    },
    {
      id: 3,
      text: "Estudar Back-end",
    },
  ])

  const [buscar, setBuscar] = useState("");

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc")


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
              .filter((lista) =>
                filter === "All"
                  ? true
                  : filter === "Completed"
                    ? lista.completo
                    : !lista.completo
              )
              .filter((lista) =>
                lista.text.toLowerCase().includes(buscar.toLowerCase())
              )
              .sort((a, b) =>
                sort === "Asc"
                  ? a.text.localeCompare(b.text)
                  : b.text.localeCompare(a.text)
              )
              .map((lista) => (
                <Lista key={lista.id}
                  lista={lista}
                />
              ))}
          </div>
        </div>
      </div>

    </>
  );
}