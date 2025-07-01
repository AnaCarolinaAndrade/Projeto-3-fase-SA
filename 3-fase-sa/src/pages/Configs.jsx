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
  const [imagemPerfilFile, setImagemPerfilFile] = useState(null); // Renomeado para clareza: o arquivo real
  const [loading, setLoading] = useState(true); // Adicionado estado de loading
  const [error, setError] = useState(null); // Adicionado estado de erro
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.warn("Nenhum ID de usuário encontrado. Redirecionando para login.");
          navigate('/login');
          return;
        }

        const token = localStorage.getItem('sessionToken'); // Obter o token
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await axios.get(`http://localhost:5000/api/usuarios/${userId}`, { headers });

        const fetchedUser = response.data?.usuario;

        if (fetchedUser) {
          setUsuario(fetchedUser);
          setNome(fetchedUser.nome || '');
          setBio(fetchedUser.bio || '');
          setLinkPessoal(fetchedUser.linkPessoal || '');
          // Assegure que 'imagemPerfil' é uma URL completa ou null
          setPreviewImage(fetchedUser.imagemPerfil || null);
        } else {
          setError('Erro: Dados do usuário não encontrados na resposta da API.');
          console.error('Erro: Dados do usuário não encontrados na resposta da API:', response.data);
        }

      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        if (error.response) {
          setError(`Erro ao buscar perfil: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
          if (error.response.status === 404) {
            alert('Usuário não encontrado.');
            localStorage.removeItem('userId');
            navigate('/login');
          } else if (error.response.status === 400) {
            alert('ID de usuário inválido. Faça login novamente.');
            localStorage.removeItem('userId');
            navigate('/login');
          } else if (error.response.status === 401 || error.response.status === 403) {
            alert('Sua sessão expirou ou você não tem permissão. Faça login novamente.');
            localStorage.removeItem('userId');
            localStorage.removeItem('sessionToken');
            navigate('/login');
          }
        } else if (error.request) {
          setError('Erro de rede: Nenhuma resposta recebida do servidor.');
        } else {
          setError('Erro na configuração da requisição.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // URL de dados para pré-visualização
      };
      reader.readAsDataURL(file);
      setImagemPerfilFile(file); // Guarda o arquivo para upload
    }
  };

  const salvarConfiguracoes = async () => {
    if (!usuario || !usuario._id) {
      alert('Não foi possível obter o ID do usuário para salvar as configurações.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('bio', bio);
    formData.append('linkPessoal', linkPessoal);

    if (imagemPerfilFile) {
      formData.append('imagemPerfil', imagemPerfilFile);
    } else if (previewImage === null && usuario.imagemPerfil) {
      // Se a previewImage foi removida E havia uma imagemPerfil original, sinalize para remover no backend
      formData.append('removerImagemPerfil', 'true');
    }

    try {
      const token = localStorage.getItem('sessionToken');
      // Use usuario._id para garantir que você está pegando o ID do MongoDB
      // Se seu backend retorna {"_id": {"$oid": "..."}}, use usuario._id.$oid
      // Se seu backend já serializa para {"_id": "..."} string, use usuario._id
      const userIdToUpdate = usuario._id; // Assumindo que o _id já é uma string ou que você vai tratá-lo no backend

      await axios.put(`http://localhost:5000/api/usuarios/${userIdToUpdate}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' é automaticamente setado pelo navegador para FormData
        },
      });
      alert('Configurações salvas com sucesso!');
      // Opcional: Recarregar dados do usuário para refletir as mudanças
      // await fetchUsuario(); // Pode chamar a função aqui, ou atualizar o estado localmente
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      if (error.response) {
        setError(`Erro ao salvar: ${error.response.data.message || error.response.statusText}`);
        alert(`Erro ao salvar configurações: ${error.response.data.message || 'Erro desconhecido.'}`);
      } else {
        setError('Erro de rede ao salvar configurações.');
        alert('Erro de rede ao salvar configurações. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deletarUsuario = async () => {
    if (!usuario || !usuario._id) {
      alert('Não foi possível obter o ID do usuário para excluir a conta.');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('sessionToken');
        const userIdToDelete = usuario._id; // Usar _id

        await axios.delete(`http://localhost:5000/api/usuarios/${userIdToDelete}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userId'); // Remover userId também
        localStorage.removeItem('userType'); // Remover userType também
        navigate('/'); // Redirecionar para a página inicial ou login
        alert('Conta excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar conta:', error);
        if (error.response) {
          setError(`Erro ao deletar: ${error.response.data.message || error.response.statusText}`);
          alert(`Erro ao deletar conta: ${error.response.data.message || 'Erro desconhecido.'}`);
        } else {
          setError('Erro de rede ao deletar conta.');
          alert('Erro de rede ao deletar conta. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const removerImagemPerfil = () => {
    setPreviewImage(null); // Remove a pré-visualização
    setImagemPerfilFile(null); // Remove o arquivo a ser enviado
    if (fileInputRef.current) fileInputRef.current.value = ""; // Limpa o input file
  };

  if (loading && !usuario) { // Mostrar loading enquanto busca os dados iniciais
    return (
      <>
        <Sidebar />
        <div className="configs-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p>Carregando configurações do usuário...</p>
        </div>
      </>
    );
  }

  if (error) { // Mostrar erro se houver
    return (
      <>
        <Sidebar />
        <div className="configs-container" style={{ justifyContent: 'center', alignItems: 'center', color: 'red' }}>
          <p>Erro: {error}</p>
          <button onClick={() => navigate('/login')}>Fazer Login Novamente</button>
        </div>
      </>
    );
  }

  if (!usuario) { // Caso não haja usuário mesmo após o loading (erro inesperado)
    return (
      <>
        <Sidebar />
        <div className="configs-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p>Usuário não encontrado ou problema ao carregar.</p>
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
              <button className="save-btn" onClick={salvarConfiguracoes} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button className="delete-btn" onClick={deletarUsuario} disabled={loading}>
                {loading ? 'Excluindo...' : 'Excluir Conta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Configs;