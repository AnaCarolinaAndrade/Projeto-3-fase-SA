import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Cadastro.css";

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const criarUsuario = async (e) => {
    e.preventDefault();  // <-- Impede o comportamento padrão do formulário (não recarrega a página e não manda GET)
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
    <div>
      <form className='form-cadastro' onSubmit={criarUsuario}>
        <input
          type="text"
          name="nome"
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
        <button type="submit" className='criar-user'>Criar</button>
      </form>

      <div id="buttonDiv"></div>
    </div>
  );
}
