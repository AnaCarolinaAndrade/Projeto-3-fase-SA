import './Lista.css'


function Lista({ lista }) {
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