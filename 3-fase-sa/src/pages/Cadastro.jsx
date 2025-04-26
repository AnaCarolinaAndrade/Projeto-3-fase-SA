import React, { useState, } from 'react';
import axios from 'axios';
import "./Cadastro.css";

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [usuarios, setUsuarios] = useState([]);

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

  return (
    <div>
      <form>
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