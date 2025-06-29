import React, { useState, useRef, useEffect } from 'react';
import './PerfilUser.css';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom';

function Configs() {
  const { id } = useParams();
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfilUsuario = async () => {
      if (!id) {
        setError('ID do usuário não fornecido na URL.');
        setLoading(false);
        return;
      }

      try {
        // Obter o token de sessão (se necessário para autenticação)
        const sessionToken = localStorage.getItem('sessionToken');
        const headers = sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {};

        // Requisição ao seu backend para obter os detalhes do usuário específico
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
          headers: headers,
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Perfil de usuário não encontrado.');
          }
          throw new Error(`Erro ao buscar perfil: ${response.status}`);
        }

        const data = await response.json();
        setPerfilUsuario(data); // Assume que 'data' é o objeto do usuário
        // Se o backend retorna { "usuario": { ... } }, então setPerfilUsuario(data.usuario);
      } catch (err) {
        setError('Erro ao buscar perfil: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfilUsuario();
  }, [id]); // Dependência no ID, para refazer a busca se o ID na URL mudar

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="profile-container">Carregando perfil...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Sidebar />
        <div className="profile-container">Erro: {error}</div>
      </>
    );
  }

  if (!perfilUsuario) {
    return (
      <>
        <Sidebar />
        <div className="profile-container">Perfil não encontrado.</div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="profile-container">
        <div className='profile'>
          <div className="profile-card">
            <h1><BsPersonCircle /> {perfilUsuario.nome || 'Nome do Usuário'}</h1>
            <p><IoMapOutline /> {perfilUsuario.localizacao || 'Localização não informada'}</p>
            <p><BsGenderFemale /> {perfilUsuario.genero || 'Gênero não informado'}</p>
            <p>Bio: {perfilUsuario.bio || 'Sem bio.'}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Configs;