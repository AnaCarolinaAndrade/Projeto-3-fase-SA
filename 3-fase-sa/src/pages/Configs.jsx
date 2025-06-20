import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Configs.css';
import Sidebar from '../components/Sidebar';
import { BsGenderFemale, BsPersonCircle } from 'react-icons/bs';
import { IoMapOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function Configs() {
  const [usuario, setUsuario] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
          },
        });
        const data = await response.json();
        setUsuario(data.usuario);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    fetchUsuario();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setPreviewImage(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

 const salvarConfiguracoes = async () => {
  await fetch('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nome, bio }),
  });
};

  const handleClickProfileImage = () => {
    fileInputRef.current.click();
  };

  const deletarUsuario = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${usuario.id}`);
      navigate('/');
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
    }
  };

  if (!usuario) return <div className="loading">Carregando...</div>;

  return (
    <>
      <Sidebar />
      <div className="configs-container">
        <div className="profile-card">
          <div className="profile-image" onClick={handleClickProfileImage}>
            {previewImage || usuario.profile_pic ? (
              <img src={previewImage || usuario.profile_pic} alt="foto de perfil" />
            ) : (
              <BsPersonCircle size={150} color="#000" />
            )}

          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />

          <h1>{usuario.nome}</h1>
          <div className="info">
            <BsGenderFemale /> {usuario.genero || 'Masculino'}
          </div>
          <div className="info">
            <IoMapOutline /> {usuario.localizacao || 'Florianópolis'}
          </div>

          <div className="actions">
            <button className="save-btn" onClick={salvarConfiguracoes}>Salvar Alterações</button>
            <button className="delete-btn" onClick={deletarUsuario}>Excluir Conta</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Configs;