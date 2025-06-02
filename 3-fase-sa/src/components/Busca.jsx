function Busca({buscar, setBuscar}) {
  return (
    <div className="buscar">
        <h2>pesquisar</h2>
        <input type="text" value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Digite para pesquisar..." />
    </div>
  ) 
}

export default Busca  