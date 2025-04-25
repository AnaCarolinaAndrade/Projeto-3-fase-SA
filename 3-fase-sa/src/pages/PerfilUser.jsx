import { useState, useRef } from 'react'
import axios from 'axios';
import './PerfilUser.css'
import Sidebar from '../components/Sidebar'
import { BsGenderFemale } from "react-icons/bs";
import { IoMapOutline } from "react-icons/io5";


function PerfilUser() {

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('URL_DA_SUA_FOTO_DE_PERFIL_ATUAL'); // Inicialize com a foto atual
  const fileInputRef = useRef(null); // Referência para o input do tipo file


  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      handleUpload(file); // Inicia o upload automaticamente após a seleção
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const handleClickProfileImage = () => {
    // Simula o clique no input do tipo file ao clicar na imagem de perfil
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

            {uploading && <p>Enviando...</p>}
            {uploadSuccess && <p style={{ color: 'green' }}>Foto de perfil atualizada com sucesso!</p>}
            {uploadError && <p style={{ color: 'red' }}>Erro: {uploadError}</p>}

            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
          </div>


          <h1>Ana Maria Dos Santos</h1>
          <h2><BsGenderFemale fontSize={20} /> Feminino</h2>
          <h2><IoMapOutline fontSize={20} /> Florianópolis </h2>

          <div className='infos'>
            <p>alguma coisa para preencher o campo</p>
          </div>

        </div>
      </div>
    </>
  )
}

export default PerfilUser