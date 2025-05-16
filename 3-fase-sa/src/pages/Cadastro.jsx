import React, { useState, useEffect, } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios';
import "./Cadastro.css";

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const criarUsuario = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, nome, dataNascimento }),
      });

      const data = await response.json();

      setNome('');
      setEmail('');
      setDataNascimento('');
      setSenha('');

      if (data.success) {
        navigate('/');
      } else {
        alert(data.error || "Login falhou.");
      }
    } catch (error) {
      console.error("Erro no login tradicional:", error);
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
    <div className="container-form-cadastro">
      <div className='container-cadastro'>
        <div class="barra"></div>
        <div className="form-wrapper">
          <div className="form-container">
            <form onSubmit={criarUsuario} className='form-cadastro'>
              <div className="form-group">
                <label>Email</label>
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
                <label>Gênero</label>
                <input placeholder="Digite seu gênero" />
              </div>

              <div className="form-group">
                <label>Data de Nascimento</label>
                <input
                  type='date'
                  name="dataNascimento"
                  value={dataNascimento}
                  onChange={e => setDataNascimento(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Senha</label>
                <div className='ipt-senha-cadastro'>
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    name="senha"
                    placeholder="Sua senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="olhar-senha"
                    onClick={toggleMostrarSenha}
                  >
                    {mostrarSenha ? <FaRegEye size={25} /> : <FaRegEyeSlash size={25} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirmar Senha</label>
                <div className='ipt-senha-cadastro'>
                  <input
                    placeholder="Confirmar senha"
                    type={mostrarSenha ? 'text' : 'password'}
                  />
                </div>
              </div>

              <button type="submit" className='enviar-formulario'>Enviar Formulário</button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}


