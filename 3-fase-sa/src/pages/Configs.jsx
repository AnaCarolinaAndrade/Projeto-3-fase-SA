import React, { useState, useEffect } from 'react';
import './Configs.css';
import Sidebar from '../components/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { BsPersonCircle, BsGenderFemale } from 'react-icons/bs';
import { FaPen, FaSave } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md"; // Importe o ícone de lixeira

function Configs() {
  const { id } = useParams();
  const cleanId = id ? id.trim() : null;
  const navigate = useNavigate();
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false); // editMode não está sendo usado, pode ser removido se não for usar.
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar dados
  useEffect(() => {
    const fetchPerfilUsuario = async () => {
      const userId = cleanId || localStorage.getItem('userId');
      if (!userId) {
        setError('ID do usuário não encontrado.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('sessionToken');
        const response = await fetch(`http://localhost:5000/api/usuarios/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Nenhum usuario encontrado');
        const data = await response.json();
        const user = data.usuario || data;
        setPerfilUsuario(user);
        setFormData(user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfilUsuario();
  }, [cleanId]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('sessionToken');
      const response = await fetch(`http://localhost:5000/api/usuarios/${cleanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erro ao salvar alterações');

      const updatedUser = await response.json();
      setPerfilUsuario(updatedUser.usuario || updatedUser);
      setEditMode(false);
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar perfil: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- NOVA FUNÇÃO PARA APAGAR A CONTA ---
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Tem certeza que deseja APAGAR SUA CONTA? Esta ação é irreversível.");

    if (confirmDelete) {
      try {
        const userIdToDelete = cleanId || localStorage.getItem('userId');
        if (!userIdToDelete) {
          alert('ID do usuário não encontrado para exclusão.');
          return;
        }

        const token = localStorage.getItem('sessionToken');
        const response = await fetch(`http://localhost:5000/api/usuarios/${userIdToDelete}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao apagar a conta.');
        }

        alert('Sua conta foi apagada com sucesso.');
        localStorage.removeItem('sessionToken'); // Limpa o token
        localStorage.removeItem('userId'); // Limpa o ID do usuário
        // Redireciona para a página inicial ou de login
        navigate('/'); // Ou navigate('/login');
      } catch (err) {
        alert('Erro ao apagar conta: ' + err.message);
      }
    }
  };
  // --- FIM DA NOVA FUNÇÃO ---


  if (loading) return <><Sidebar /><div className="profile-container">Carregando...</div></>;
  if (error) return <><Sidebar /><div className="profile-container-error">{error}</div></>;
  if (!perfilUsuario) return <><Sidebar /><div className="profile-container">Perfil não encontrado.</div></>;

  return (
    <>
      <Sidebar />
      <div className="profile-container-config">
        <div className='profile-config'>
          <div className="profile-card-config">
            {perfilUsuario.imagemPerfil ? (
              <img src={perfilUsuario.imagemPerfil} alt="Imagem de Perfil" className="profile-image-config" />
            ) : (
              <BsPersonCircle className="profile-default-icon-config" size={100} />
            )}
            <label>Nome</label>
            <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} />
            <label htmlFor="">Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
            <label htmlFor="">Localização</label>
            <input type="text" name="localizacao" value={formData.localizacao || ''} onChange={handleChange} />
            <label htmlFor="">Informações do perfil</label>
            <textarea name="bio" value={formData.bio || ''} onChange={handleChange} />

            <button className="save-profile-btn-config" onClick={handleSave}>
              <FaSave /> Salvar
            </button>
            {/* --- NOVO BOTÃO PARA APAGAR A CONTA --- */}
            <button className='delete-account-btn-config' onClick={handleDeleteAccount}>
              <MdDeleteForever /> Apagar Conta
            </button>
            {/* --- FIM DO NOVO BOTÃO --- */}

          </div>
        </div>
      </div>
    </>
  );
}

export default Configs;