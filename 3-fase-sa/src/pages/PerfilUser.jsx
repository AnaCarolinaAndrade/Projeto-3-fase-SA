import React, { useState, useRef, useEffect } from 'react';
import './PerfilUser.css';
import Sidebar from '../components/Sidebar';
import { BsGenderFemale, BsPersonCircle } from 'react-icons/bs';
import { IoMapOutline } from "react-icons/io5";

function Configs() {
  const fileInputRef = useRef(null);
  const [usuario, setUsuario] = useState("Nome do Usuário");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/usuarios', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
          },
          body: JSON.stringify({ nome, bio })
        });
        const data = await response.json();
        setUsuario(data.usuario);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    fetchUsuario();
  }, []);

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

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

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

  return (
    <>
      <Sidebar />
      <div className="profile-container">
        <div className='profile'>
          <div className="profile-card">
            <div className="profile-image" onClick={() => fileInputRef.current.click()}>
              {previewImage ? (
                <img src={previewImage} alt="Foto de perfil" />
              ) : (
                <BsPersonCircle size={150} color="#ccc" />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleProfileImageChange}
            />

            <h1>{usuario}</h1>
            <div className="info"><BsGenderFemale /> masculino</div>
            <div className="info"><IoMapOutline /> florianópolis</div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Configs;