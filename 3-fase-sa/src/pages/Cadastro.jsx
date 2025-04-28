import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import "./Cadastro.css";

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const criarUsuario = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/usuarios', { nome, email });
      setNome('');
      setEmail('');
    } catch (error) {
      console.error('Erro:', error);
      setMensagem(error.message);
    }
  };

  useEffect(() => {
    function handleCredentialResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
      enviarTokenParaBackend(response.credential);
    }

    window.onload = function () {
      google.accounts.id.initialize({
        client_id: "187533279088-8ck947lb5vptqltevj9e04m9rvs8i4tu.apps.googleusercontent.com",
        callback: handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById("buttonDiv")
      );
    }
  }, []);

  const enviarTokenParaBackend = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/google-login', { // Sua rota no backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      // Lógica para lidar com a resposta do backend (armazenar token de sessão, redirecionar, etc.)
      console.log('Resposta do backend:', data);
    } catch (error) {
      console.error('Erro ao enviar token para o backend:', error);
    }
  };

  return (
    <div>
      <form className='form-cadastro'>
        <input
          type="text"
          name='nome'
          placeholder="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Seu email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </form>

      <button onClick={criarUsuario} className='criar-user'>Criar</button>
    </div>
  );
}