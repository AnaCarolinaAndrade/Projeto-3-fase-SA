import React, { useState, useEffect } from 'react';
import './PerfilUser.css';
import Sidebar from '../components/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { BsPersonCircle, BsGenderFemale } from 'react-icons/bs';
import { IoMapOutline } from 'react-icons/io5';
import { FaPen, FaSave } from "react-icons/fa";

function Configs() {
  const { id } = useParams();
  const cleanId = id ? id.trim() : null;
  const navigate = useNavigate();
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false);
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

        if (!response.ok) throw new Error('Erro ao buscar perfil');
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

  // Salvar alterações
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

  if (loading) return <><Sidebar /><div className="profile-container">Carregando...</div></>;
  if (error) return <><Sidebar /><div className="profile-container">Erro: {error}</div></>;
  if (!perfilUsuario) return <><Sidebar /><div className="profile-container">Perfil não encontrado.</div></>;

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

            <input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} />

            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />

            <input type="text" name="localizacao" value={formData.localizacao || ''} onChange={handleChange} />

            <input type="text" name="genero" value={formData.genero || ''} onChange={handleChange} />

            <textarea name="bio" value={formData.bio || ''} onChange={handleChange} />

            <button className="save-profile-btn" onClick={handleSave}>
              <FaSave /> Salvar
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export default Configs;
