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

  const [lista, setLista] = useState([
    {
      id: 1,
      text: "Arrumar um namorado pra Ana",
      categoria: "Pessoal",
      completo: false,
    },
    {
      id: 2,
      text: "Criar o back da aba projetos",
      categoria: "Pessoal",
      completo: false,
    },
    {
      id: 3,
      text: "Estudar Back-end",
      categoria: "Estudo",
      completo: false,
    },
  ])

  const [buscar, setBuscar] = useState("");

  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Asc")

  const addLista = (text, categoria) => {
    const novaLista = [...lista, {
      id: Math.floor(Math.random() * 10000),
      text,
      categoria,
      completo: false,
    },
    ];
    setLista(novaLista)
  };

  const removerLista = (id) => {
    const novaLista = [...lista]
    const filtrarLista = novaLista.filter(lista => lista.id !== id ? lista : null);
    setLista(filtrarLista)
  }

  const completarTarefa = (id) => {
    const novaLista = [...lista]
    novaLista.map((lista) => lista.id === id ? lista.completo = !lista.completo : lista)
    setLista(novaLista)
  }

  return (
    <>
      <div className='container-projetos'>
        <Sidebar />
        <div className='projetos'>
          <Busca buscar={buscar} setBuscar={setBuscar} />
          <div className='separador'></div>
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
                  removerLista={removerLista}
                  completarTarefa={completarTarefa} />
              ))}
          </div>
        </div>
      </div>

    </>
  );
}