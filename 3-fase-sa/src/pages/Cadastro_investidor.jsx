import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import './Cadastro_investidor.css'

function Cadastro_investidor() {
  const [cadastro, setCadastro] = useState({
    nome: '',
    documento: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  })

  const [logado, setLogado] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setCadastro({ ...cadastro, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLogado(true)
    setError(null)

    if (cadastro.senha !== cadastro.confirmarSenha) {
      setError('As senhas devem ser iguais!')
      setLogado(false)
      return;
    }

    try {
      const response =  fetch('http://localhost:5000/api/investidor', {
        method: 'POST',
        headers: { 'Content-type': 'application/JSON' },
        body: JSON.stringify( cadastro)
      })

      if (response.ok) {
        alert(data.message || 'Cadastro realizado com sucesso!')
       navigate('/')

      } else {
        const data = response.json();
        setError(data.message || 'Erro ao cadastrar. Tente novamente.')
      }

    } catch (err) {
      setError('Erro no servidor: ' + (err.message))

    } finally {
      setLogado(false)
    }
  }

  return (
    <div className='container-cadastro-investidor-cor'>
      <div className='container-cadastro-investidor-alinhamento'>
      <img src='./img/logo_pequena.png' alt="Logo" className='logo' /><h1 className='container-titulo'>Cadastre-se como investidor</h1>

        <div className='alinhamentos-wrapper' >
          <div className='alinhamento-esquerda'>
            <label>Nome da empresa/investidor</label><input type='text' id='nome' name='nome' value={cadastro.nome} onChange={handleChange} required></input>
            <label>CNPJ da empresa ou CPF do Investidor</label><input type='text' id='documento' name='documento' value={cadastro.documento} onChange={handleChange} required></input>
            <label>Email</label><input type='email' id='email' name='email' value={cadastro.email} onChange={handleChange} required></input>
          </div>

          <div className='alinhamento-direita'>
            <label>Senha</label><input type='password' id='senha' name='senha' value={cadastro.senha} onChange={handleChange} required></input>
            <label>Confirmar Senha</label><input type='password' id='confirmarSenha' name='confirmarSenha' value={cadastro.confirmarSenha} onChange={handleChange} required></input>
          </div>
        </div>

        {error && <p style={{ color: 'red', background: 'transparen'}}>{error}</p>}
        <button className='container-button' disabled={logado} onClick={handleSubmit}>
          {logado ? 'Cadastrando...' : 'Confirmar Cadastro'}</button>
      </div>

    </div>
  )
}

export default Cadastro_investidor
