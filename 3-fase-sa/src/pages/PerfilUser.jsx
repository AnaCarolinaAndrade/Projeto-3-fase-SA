import React, { useState, useRef } from 'react'; 
import './PerfilUser.css';
import Sidebar from '../components/Sidebar';
import { BsGenderFemale, BsPersonCircle } from 'react-icons/bs';
import { IoMapOutline } from "react-icons/io5";

function Configs() {
  const fileInputRef = useRef(null);
  const [usuario, setUsuario] = useState("Nome do Usuário");
  const [previewImage, setPreviewImage] = useState(null);
  const [linkPessoal, setLinkPessoal] = useState("");
  const [imagemDestaque, setImagemDestaque] = useState(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImagemDestaqueChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemDestaque(URL.createObjectURL(file));
    }
  };

  const removerImagemPerfil = () => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removerImagemDestaque = () => {
    setImagemDestaque(null);
  };

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

            {previewImage && (
              <button className="btn-remover" onClick={removerImagemPerfil}>
                Remover imagem de perfil
              </button>
            )}

            <h1>{usuario}</h1>
            <div className="info"><BsGenderFemale /> masculino</div>
            <div className="info"><IoMapOutline /> florianópolis</div>

            <div className='info-profile'>
              <label>Link pessoal ou portfólio:</label>
              <input
                type="text"
                placeholder="https://..."
                value={linkPessoal}
                onChange={(e) => setLinkPessoal(e.target.value)}
              />
              {linkPessoal && (
                <p>
                  <a href={linkPessoal} target="_blank" rel="noopener noreferrer">
                    Ver meu link
                  </a>
                </p>
              )}

              <label>Imagem de destaque:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImagemDestaqueChange}
              />
              {imagemDestaque && (
                <div>
                  <img src={imagemDestaque} alt="Imagem destaque" className="imagem-destaque" />
                  <button className="btn-remover" onClick={removerImagemDestaque}>
                    Remover imagem de destaque
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Configs;