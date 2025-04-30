import React, { useState, useEffect, } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios';
import "./Cadastro.css";

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const criarUsuario = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/usuarios', { nome, email });
      console.log('Usuário criado:', response.data);
      setNome('');
      setEmail('');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  useEffect(() => {
    function handleCredentialResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
      enviarTokenParaBackend(response.credential);
    }

    window.onload = function () {
      google.accounts.id.initialize({
        callback: handleCredentialResponse
      });

      google.accounts.id.initialize({
        client_id: process.env.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });


      google.accounts.id.renderButton(
        document.getElementById("buttonDiv")
      );
    }
  }, []);

  const enviarTokenParaBackend = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      console.log('Resposta do backend:', data);
    } catch (error) {
      console.error('Erro ao enviar token para o backend:', error);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>Criar Conta</h2>
        <form onSubmit={criarUsuario}>
          <div className="form-group">
            <label>Nome completo</label>
            <input
              type="text"
              name="nome"
              placeholder="Nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>


          <div className="form-group">
            <label>Email</label>

            <div className='ipt-senha'>
              <input
                type="email"
                name="email"
                placeholder="Seu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input placeholder="Sua senha" type={mostrarSenha ? 'text' : 'password'} />
              <button
                type="button"
                className="olhar-senha"
                onClick={toggleMostrarSenha}
              >
                {mostrarSenha ? (
                  <FaRegEye size={25} color="black" />
                ) : (
                  <FaRegEyeSlash size={25} color="black" />
                )}
              </button>
            </div>


          </div>
          <button type="submit" className="criar-user">Cadastrar</button>
        </form>
        <p className="login-link">
          Já tem uma conta? <a href="#">Entrar</a>
        </p>
      </div>
    </div>
  );
}
