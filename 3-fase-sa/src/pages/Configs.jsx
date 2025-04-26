import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Configs.css'
import Sidebar from '../components/Sidebar'
import { BsGenderFemale } from "react-icons/bs";
import { IoMapOutline } from "react-icons/io5";
import { h1 } from 'framer-motion/client';


function Configs() {

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const fileInputRef = useRef(null); // Referência para o input do tipo file

  useEffect(() => {
    fetch('http://localhost:5000/api/usuarios')
      .then(response => response.json())
      .then(data => setUsuarios(data))
      .catch(error => console.error('Erro ao buscar usuários:', error));
  }, []);

  const deletarUsuario = (id) => {
    axios.delete(`http://localhost:5000/api/usuarios/${id}`)
      .then(response => {
        if (response.status === 200) {
          setUsuarios(usuarios.filter(usuario => usuario.id !== id));
        }
      })
  };


  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedImage(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      handleUpload(file);
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const handleClickProfileImage = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (file) => {
    if (!file) {
      setUploadError('Por favor, selecione uma imagem.');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);
  };


  return (
    <>
      <Sidebar />

      <div className="profile-container">
        <div className='profile'>

          <div>
            <div
              onClick={handleClickProfileImage}
              style={{
                cursor: 'pointer',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px solid #ccc',
              }}
            >
              {previewImage && (
                <img src={previewImage} alt="Pré-visualização"
                  style={{
                    width: '100%',
                    height: '100%',
                  }} />
              )}
            </div>

            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
          </div>


          <div>{usuarios.map(usuario => (
            <h1 key={usuario.id}>
              {usuario.nome}
            </h1>
          ))}</div>
          <h2><BsGenderFemale fontSize={20} /> Feminino </h2>
          <h2><IoMapOutline fontSize={20} /> Florianópolis </h2>

          <div className='infos'>
            <p>alguma coisa para preencher o campo</p>
          </div>

              {usuarios.map(usuario => (
                <div key={usuario}>
                  <button onClick={() => deletarUsuario(usuario.id) } className='deletar-usuario'>Excluir conta</button>
                </div>
              ))}

        </div>
      </div>
    </>
  )
}

export default Configs;