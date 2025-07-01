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
  const [imagemPerfil, setImagemPerfil] = useState(null); // Estado para a imagem de perfil a ser enviada
  const navigate = useNavigate();

 useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Supondo que você armazena o ID do usuário após o login/cadastro
        if (!userId) {
          console.warn("Nenhum ID de usuário encontrado. Redirecionando para login.");
          navigate('/login'); // Ou para a tela de login
          return;
        }

        // Requisição para buscar um usuário específico por ID
        const response = await axios.get(`http://localhost:5000/api/usuarios/${userId}`);

        // O backend agora deve retornar {"usuario": {...}}
        const fetchedUser = response.data?.usuario;

        if (fetchedUser) {
          setUsuario(fetchedUser);
          setNome(fetchedUser.nome || '');
          setBio(fetchedUser.bio || '');
          setLinkPessoal(fetchedUser.linkPessoal || '');
          setPreviewImage(fetchedUser.imagemPerfil || null);
        } else {
          console.error('Erro: Dados do usuário não encontrados na resposta da API:', response.data);
          // Opcional: setar um erro geral para mostrar na tela
        }

      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        if (error.response) {
            console.error('Detalhes do erro do servidor:', error.response.data);
            if (error.response.status === 404) {
                alert('Usuário não encontrado.');
                localStorage.removeItem('userId');
                navigate('/login');
            } else if (error.response.status === 400) {
                alert('ID de usuário inválido.');
            }
        } else if (error.request) {
            console.error('Erro de rede: Nenhuma resposta recebida do servidor.');
        } else {
            console.error('Erro na configuração da requisição:', error.message);
        }
      }
    };

    fetchUsuario();
  }, [navigate]);

  // ... (o restante do seu componente Configs permanece o mesmo) ...

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImagemPerfil(file);
    }
  };

  const salvarConfiguracoes = async () => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('bio', bio);
    formData.append('linkPessoal', linkPessoal);

    if (imagemPerfil) {
      formData.append('imagemPerfil', imagemPerfil);
    } else if (previewImage === null && usuario?.imagemPerfil) {
      formData.append('removerImagemPerfil', 'true');
    }

    try {
      const token = localStorage.getItem('sessionToken');
      const userId = usuario.id;

      await axios.put(`http://localhost:5000/api/usuarios/${userId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    }
  };

  const deletarUsuario = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
      try {
        const token = localStorage.getItem('sessionToken');
        const userId = usuario.id;
        await axios.delete(`http://localhost:5000/api/usuarios/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        localStorage.removeItem('sessionToken');
        navigate('/');
        alert('Conta excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar conta:', error);
        alert('Erro ao deletar conta. Tente novamente.');
      }
    }
  };

  const removerImagemPerfil = () => {
    setPreviewImage(null);
    setImagemPerfil(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!usuario) {
    return (
      <>
        <Sidebar />
        <div className="configs-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p>Carregando configurações do usuário...</p>
        </div>
      </>
    );
  }

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

          <h1>{nome || 'Nome do Usuário'}</h1>

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
              placeholder="Fale um pouco sobre você..."
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