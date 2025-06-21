import React from 'react'

function Cadastro_investidor() {
  return (
    <div className='container-cadastro-investidor'>
      <h2>Cadastrace</h2>
     <label>Nome completo da empresa/investidor</label><input></input>
     <label>CNPJ da empresa ou CPF do Investidor</label><input></input>
     <label>Email</label><input></input>
     <label>Senha</label><input></input>
     <label>Confirmar Senha</label><input></input>
     <label>Genero (opcional)</label><input></input>
     <button>Confirmar Cadastro</button>

    </div>
  )
}

export default Cadastro_investidor
