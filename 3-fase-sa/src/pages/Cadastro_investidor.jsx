import React from 'react'
import './Cadastro_investidor.css'

function Cadastro_investidor() {
  return (
    <div className='container-cadastro-investidor'>
      <div className='container-cadastro-investidor-alinhamento'>
       <img src='./img/logo.png' alt="Logo"  className='logo'/>
       <h1 className='container-titulo'>Cadastrace como investidor</h1>

       <div className='alinhamentos-wrapper' >
         <div className='alinhamento-esquerda'>
           <label>Nome da empresa/investidor</label><input type='text'></input>
           <label>CNPJ da empresa ou CPF do Investidor</label><input type='text'></input>
           <label>Email</label><input type='email'></input>
          </div>

          <div className='alinhamento-direita'>
           <label>Senha</label><input type='password'></input>
           <label>Confirmar Senha</label><input type='password'></input>
           <label>Genero (opcional)</label><input type='text'></input>
          </div>
        </div>
       <button className='container-button'>Confirmar Cadastro</button>
      </div>

    </div>
  )
}

export default Cadastro_investidor
