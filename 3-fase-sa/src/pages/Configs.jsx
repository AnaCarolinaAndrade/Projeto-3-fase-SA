import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Configs.css';
import Sidebar from '../components/Sidebar';
import { BsPersonCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function Configs() {
  const [usuario, setUsuario] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [linkPessoal, setLinkPessoal] = useState("");
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
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
    try {
      await fetch('/api/usuario', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, bio }),
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };


  const deletarUsuario = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${usuario.id}`);
      navigate('/');
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
    }
  };

  const removerImagemPerfil = () => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Sidebar />
      <div className="configs-container">
        <div className="profile-card-config">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />

          <div className="profile-image" onClick={() => fileInputRef.current.click()}>
            {previewImage ? (
              <img src={previewImage} alt="Foto de perfil" />
            ) : (
              <BsPersonCircle size={150} color="#ccc" />
            )}
          </div>


          {previewImage && (
            <button className="btn-remover" onClick={removerImagemPerfil}>
              Remover imagem de perfil
            </button>
          )}

          <h1>{usuario}</h1>

          <div className='container-infos-user-config'>

            <label className='label-configs'>Nome</label>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className='ipt-config-link'
            />

            <label className='label-configs'>Biografia</label>
            <input
              type="text"
              placeholder="Biografia"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className='ipt-config-link'
            />

            <label className='label-configs'>Colocar links de projetos e/ou sites</label>

            <input
              type="text"
              placeholder="https://..."
              value={linkPessoal}
              onChange={(e) => setLinkPessoal(e.target.value)}
              className='ipt-config-link'
            />

            {linkPessoal && (
              <p className='p-config-link'>
                <a href={linkPessoal} target="_blank" rel="noopener noreferrer" className='link-config-user'>
                  Ver meu link
                </a>
              </p>
            )}

            <div className="actions">
              <button className="save-btn" onClick={salvarConfiguracoes}>Salvar Alterações</button>
              <button className="delete-btn" onClick={deletarUsuario}>Excluir Conta</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Configs;