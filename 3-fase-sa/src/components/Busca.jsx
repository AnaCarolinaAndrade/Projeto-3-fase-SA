import './Busca.css'

function Busca({buscar, setBuscar}) {
  return (
    <div className="container-busca">
        <input className='ipt-busca' type="text" value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Digite para pesquisar..." />
    </div>
  ) 
}

export default Busca