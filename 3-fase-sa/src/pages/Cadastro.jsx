import { useState } from "react";
import axios from 'axios';
import "./Cadastro.css";

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const criarUsuario = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/usuarios', { nome, email });
      setMensagem(`Usuário criado com sucesso! ID: ${response.data.id}`);
      setNome('');
      setEmail('');
    } catch (error) {
      console.error('Erro:', error);
      setMensagem(error.message);
    }
  };

  return (
    <div>
      <h2>Criar Novo Usuário</h2>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={criarUsuario}>Criar</button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}