import './Lista.css'

function Lista({ lista, removerLista, completarTarefa }) {
  return (
    <div className='Lista' style={{textDecoration: lista.completo ? "line-through" : ""}}>
      <div className='content'>
        <p>{lista.text}</p>
        <p className='categoria'>
          ({lista.categoria})
        </p>
      </div>
    </div>
  )
}

export default Lista;