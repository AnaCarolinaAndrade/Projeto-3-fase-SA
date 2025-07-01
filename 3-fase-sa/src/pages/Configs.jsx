import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Configs.css';
import Sidebar from '../components/Sidebar';
import { BsPersonCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function Configs() {
  const [usuario, setUsuario] = useState(null); // Vai armazenar o objeto completo do usuário
  const [previewImage, setPreviewImage] = useState(null); // Para a pré-visualização da imagem
  const fileInputRef = useRef(null); // Referência para o input de arquivo
  const [linkPessoal, setLinkPessoal] = useState(""); // Estado para o link pessoal
  const [nome, setNome] = useState(""); // Estado para o nome do usuário
  const [bio, setBio] = useState(""); // Estado para a biografia do usuário
  const [imagemPerfil, setImagemPerfil] = useState(null); // Estado para a imagem de perfil a ser enviada
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem('sessionToken');
        const response = await axios.get('http://localhost:5000/api/usuarios', { // Usando axios para consistência
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const fetchedUser = response.data.usuario;
        setUsuario(fetchedUser); // Define o objeto usuário completo
        setNome(fetchedUser.nome || ''); // Define o nome do usuário
        setBio(fetchedUser.bio || ''); // Define a biografia do usuário
        setLinkPessoal(fetchedUser.linkPessoal || ''); // Define o link pessoal
        setPreviewImage(fetchedUser.imagemPerfil || null); // Define a imagem de perfil existente

      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        // Redirecionar para login ou exibir mensagem de erro, se a sessão expirou
        if (error.response && error.response.status === 401) {
          navigate('/login'); // Exemplo: Redireciona para a tela de login
        }
      }
    };

    fetchUsuario();
  }, [navigate]); // Adicione navigate como dependência para evitar warnings

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Cria uma URL para pré-visualização imediata
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Atualiza a pré-visualização com a imagem base64
      };
      reader.readAsDataURL(file);

      // Armazena o arquivo para ser enviado no salvamento
      setImagemPerfil(file);
    }
  };

  const salvarConfiguracoes = async () => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('bio', bio);
    formData.append('linkPessoal', linkPessoal);

    if (imagemPerfil) { // Se uma nova imagem foi selecionada
      formData.append('imagemPerfil', imagemPerfil);
    } else if (previewImage === null && usuario?.imagemPerfil) {
      // Se a imagem foi removida (previewImage é null) e havia uma imagem anterior no usuário
      formData.append('removerImagemPerfil', 'true');
    }

    try {
      const token = localStorage.getItem('sessionToken');
      const userId = usuario.id; // Assume que o ID do usuário está em 'usuario.id'

      await axios.put(`http://localhost:5000/api/usuarios/${userId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Importante para enviar arquivos
        },
      });
      alert('Configurações salvas com sucesso!');
      // Opcional: Atualizar o estado do usuário com os novos dados após o salvamento
      // Ou recarregar o usuário completo para ter certeza dos dados mais recentes
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    }
  };

  const deletarUsuario = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
      try {
        const token = localStorage.getItem('sessionToken');
        const userId = usuario.id; // Assume que o ID do usuário está em 'usuario.id'
        await axios.delete(`http://localhost:5000/api/usuarios/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        localStorage.removeItem('sessionToken'); // Limpa o token da sessão
        navigate('/'); // Redireciona para a página inicial ou de login
        alert('Conta excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar conta:', error);
        alert('Erro ao deletar conta. Tente novamente.');
      }
    }
  };

  const removerImagemPerfil = () => {
    setPreviewImage(null); // Remove a pré-visualização
    setImagemPerfil(null); // Limpa o arquivo selecionado
    if (fileInputRef.current) fileInputRef.current.value = ""; // Limpa o input de arquivo
  };

  // Renderiza apenas quando as informações do usuário estiverem carregadas
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

          {/* Exibe o nome do usuário carregado */}
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