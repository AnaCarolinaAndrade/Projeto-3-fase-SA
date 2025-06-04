function Lista({ lista, removerLista, completarTarefa }) {
  return (
    <div className='Lista' style={{textDecoration: lista.completo ? "line-through" : ""}}>
      <div className='content'>
        <p>{lista.text}</p>
        <p className='categoria'>
          ({lista.categoria})
        </p>
      </div>

      <div>
        <button className='completar' onClick={() => completarTarefa(lista.id)}>completar</button>
        <button className='excluir' onClick={() => removerLista(lista.id)}>x</button>
      </div>
    </div>
  )
}

export default Lista;