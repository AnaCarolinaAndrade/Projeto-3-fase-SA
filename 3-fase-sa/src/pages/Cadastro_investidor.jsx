import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import './Cadastro_investidor.css'
import { info } from 'autoprefixer';

function Cadastro_investidor() {
  const [cadastro, setCadastro] = useState({
    nome: '',
    documento: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    genero: ''
  })

  const [logado, setLogado] = useState(false)
  const [error, setError] = useState(null)

  const Navigate = useNavigate()

  const handleChange = (e) => {
    setCadastro({ ...info, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLogado(true)
    setError(null)

    if (info.senha !== info.confirmarSenha) {
      setError('As senhas devem ser iguais!')
      setLogado(false)
    }

    try {
      const response = /*await*/ fetch('', {
        method: 'POST',
        headers: { 'content-type': 'application/JSON' },
        body: JSON.stringify({
          nome: info.nome,
          documento: info.documento,
          email: info.email,
          senha: info.senha,
          confirmarSenha: info.confirmarSenha,
          genero: info.genero
        }),
      });

      if (response.ok) {
        Navigate('/')

      } else {
        const data = /*await*/ response.json();
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
      <img src='./img/logo_pequena.png' alt="Logo" className='logo' /><h1 className='container-titulo'>Cadastrace como investidor</h1>

        <div className='alinhamentos-wrapper' >
          <div className='alinhamento-esquerda'>
            <label>Nome da empresa/investidor</label><input type='text' id='nome' name='nome' value={info.nome} onChange={handleChange} required></input>
            <label>CNPJ da empresa ou CPF do Investidor</label><input type='text' id='documento' name='documento' value={info.documento} onChange={handleChange} required></input>
            <label>Email</label><input type='email' id='email' name='documnto' value={info.documento} onChange={handleChange} required></input>
          </div>

          <div className='alinhamento-direita'>
            <label>Senha</label><input type='password' id='senha' name='senha' value={info.senha} onChange={handleChange} required></input>
            <label>Confirmar Senha</label><input type='password' id='confirmarSenha' name='senha' value={info.senha} onChange={handleChange} required></input>
            <label>Genero (opcional)</label><input type='text' id='genero' name='genero' value={info.genero} onChange={handleChange} required></input>
          </div>
        </div>

        {error && <p style={{ color: 'red', background: 'transparen'}}>{error}</p>}
        <button className='container-button' type="submit" disabled={logado} onClick={handleSubmit}>
          {logado ? 'Cadastrando...' : 'Confirmar Cadastro'}</button>
      </div>

    </div>
  )
}

export default Cadastro_investidor
