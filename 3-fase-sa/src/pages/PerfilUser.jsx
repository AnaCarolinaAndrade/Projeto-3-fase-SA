import React, { useState, useEffect } from 'react';
import './PerfilUser.css'; // Mantenha o CSS
import Sidebar from '../components/Sidebar';
import { useParams, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { BsPersonCircle, BsGenderFemale } from 'react-icons/bs'; // Exemplo de importação de ícones
import { IoMapOutline } from 'react-icons/io5'; // Exemplo para Ionicons v5, instale se não tiver
import { FaPen } from "react-icons/fa6";
import ProjetosUser from '../components/ProjetosUser';


function PerfilUser() { // Renomeado o componente para PerfilUser para clareza
  const { id } = useParams();
  const cleanId = id ? id.trim() : null; // Adicione .trim() aqui
  const navigate = useNavigate(); // Hook para navegação
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfilUsuario = async () => {
      if (!cleanId) {
        const loggedInUserId = localStorage.getItem('userId');
        if (loggedInUserId) {
          navigate(`/perfil/${loggedInUserId.trim()}`);
          return;
        }
        setError('ID do usuário não fornecido na URL ou usuário não logado.');
        setLoading(false);
        return;
      }

      try {
        const sessionToken = localStorage.getItem('sessionToken');
        const headers = {};
        if (sessionToken) {
          headers['Authorization'] = `Bearer ${sessionToken}`;
        }

        const response = await fetch(`http://localhost:5000/api/usuarios/${cleanId}`, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Perfil de usuário não encontrado.');
          }
          if (response.status === 401 || response.status === 403) {
            alert('Sua sessão expirou ou você não tem permissão para ver este perfil. Faça login novamente.');
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userType');
            navigate('/login');
            return;
          }
          throw new Error(`Erro ao buscar perfil: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.usuario) {
          setPerfilUsuario(data.usuario);
        } else if (data) {
          setPerfilUsuario(data);
        } else {
          throw new Error('Dados do perfil inválidos ou ausentes na resposta.');
        }

      } catch (err) {
        console.error('Erro detalhado ao buscar perfil:', err);
        setError('Erro ao buscar perfil: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfilUsuario();
  }, [cleanId, navigate]);

  const handleEditProfileClick = () => {

    const loggedInUserId = localStorage.getItem('userId');
    if (loggedInUserId) {
      navigate(`/configs/${loggedInUserId}`);
    } else {
      alert('ID do usuário não encontrado. Faça login para editar o perfil.');
      navigate('/login');
    }
  };

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
            {perfilUsuario.imagemPerfil ? (
              <img src={perfilUsuario.imagemPerfil} alt="Imagem de Perfil" className="profile-image" />
            ) : (
              <BsPersonCircle className="profile-default-icon" size={100} />
            )}

            <h1>{perfilUsuario.nome || 'Nome do Usuário'}
              <button className="edit-profile-btn" onClick={handleEditProfileClick}>
                <FaPen size={15} />
              </button></h1>
            <p className="profile-detail">
              {perfilUsuario.email && (<span>Email para contato: {perfilUsuario.email}</span>)}
            </p>
            <p className="profile-detail">
              {perfilUsuario.localizacao && (<><span>Localização:</span><IoMapOutline /> {perfilUsuario.localizacao}</>)}
              {!perfilUsuario.localizacao && 'Localização não informada'}
            </p>

            <p className="profile-detail">
              Bio: {perfilUsuario.bio || 'Sem bio.'}
            </p>
            <p className="profile-detail">
              {perfilUsuario.linkPessoal && (<a href={perfilUsuario.linkPessoal} target="_blank" rel="noopener noreferrer">Link Pessoal</a>)}
            </p>

            <div className='profile-line' />

            <div className='posts-profile'>
              <ProjetosUser />
            </div>
          </div>

        </div>
      </div>

    </>
  );
}

export default PerfilUser; 