import './Lista.css'

function Lista({ lista }) {
  return (
    <div className='Lista'>
      <div className='content'>
        <p>{lista.text}</p>
      </div>
    </div>
  )
}

export default Lista;