import React, { useState, useEffect } from 'react';
import './PerfilUser.css'; // Mantenha o CSS
import Sidebar from '../components/Sidebar';
import { useParams, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { BsPersonCircle, BsGenderFemale } from 'react-icons/bs'; // Exemplo de importação de ícones
import { IoMapOutline } from 'react-icons/io5'; // Exemplo para Ionicons v5, instale se não tiver

function PerfilUser() { // Renomeado o componente para PerfilUser para clareza
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para navegação
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfilUsuario = async () => {
      if (!id) {
        // Se o ID não estiver na URL, e for para ver o próprio perfil, redireciona
        // Isso pode acontecer se o usuário tentar acessar /perfil/ sem um ID
        const loggedInUserId = localStorage.getItem('userId'); // Ou sessionToken se usar JWT e o token tiver o ID
        if (loggedInUserId) {
            navigate(`/perfil/${loggedInUserId}`); // Redireciona para o próprio perfil
            return; // Interrompe a execução para evitar buscar sem ID
        }

        setError('ID do usuário não fornecido na URL ou usuário não logado.');
        setLoading(false);
        return;
      }

      try {
        // Obter o token de sessão (JWT) se sua rota de backend exigir
        const sessionToken = localStorage.getItem('sessionToken');
        const headers = {};
        if (sessionToken) {
            headers['Authorization'] = `Bearer ${sessionToken}`;
        }
        // Se você estiver usando sessões Flask (cookies), não precisa enviar cabeçalho de Authorization
        // O navegador já envia os cookies automaticamente, mas você precisará de axios.defaults.withCredentials = true;

        // Requisição ao seu backend para obter os detalhes do usuário específico
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
          method: 'GET', // Adicionar o método para clareza, mesmo que seja o padrão
          headers: headers,
        });

        if (!response.ok) {
          // Tratar diferentes status de erro
          if (response.status === 404) {
            throw new Error('Perfil de usuário não encontrado.');
          }
          if (response.status === 401 || response.status === 403) {
            // Se for erro de autenticação/autorização, redirecionar para login
            // Isso acontece se a rota do backend estiver protegida
            alert('Sua sessão expirou ou você não tem permissão para ver este perfil. Faça login novamente.');
            localStorage.removeItem('sessionToken'); // Limpa token inválido
            localStorage.removeItem('userId'); // Limpa ID inválido
            localStorage.removeItem('userType'); // Limpa tipo de usuário
            navigate('/login'); // Redireciona para a página de login
            return; // Interrompe a execução
          }
          throw new Error(`Erro ao buscar perfil: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // CORREÇÃO: Acessar a propriedade 'usuario' se o backend retornar {"usuario": {...}}
        if (data && data.usuario) {
            setPerfilUsuario(data.usuario);
        } else if (data) {
            // Caso o backend retorne o objeto diretamente, sem o "usuario" encapsulado
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
  }, [id, navigate]); // Adicionado 'navigate' às dependências

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
            {/* Opcional: imagem de perfil */}
            {perfilUsuario.imagemPerfil ? (
              <img src={perfilUsuario.imagemPerfil} alt="Imagem de Perfil" className="profile-image" />
            ) : (
              <BsPersonCircle className="profile-default-icon" size={100} /> // Ícone padrão se não houver imagem
            )}

            <h1>{perfilUsuario.nome || 'Nome do Usuário'}</h1>
            {/* Adicione campos que você espera do seu backend */}
            <p className="profile-detail">
                {perfilUsuario.email && (<span>Email: {perfilUsuario.email}</span>)}
            </p>
            <p className="profile-detail">
                {/* Você pode ajustar ou adicionar a localização se tiver esse campo */}
                {perfilUsuario.localizacao && (<><IoMapOutline /> {perfilUsuario.localizacao}</>)}
                {!perfilUsuario.localizacao && 'Localização não informada'}
            </p>
            <p className="profile-detail">
                {perfilUsuario.genero && (<><BsGenderFemale /> {perfilUsuario.genero}</>)}
                {!perfilUsuario.genero && 'Gênero não informado'}
            </p>
            <p className="profile-detail">
                Bio: {perfilUsuario.bio || 'Sem bio.'}
            </p>
            <p className="profile-detail">
                {perfilUsuario.linkPessoal && (<a href={perfilUsuario.linkPessoal} target="_blank" rel="noopener noreferrer">Link Pessoal</a>)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PerfilUser; // Exportar com o novo nome