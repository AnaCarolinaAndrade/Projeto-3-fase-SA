import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './PerfilUser.css'
import Sidebar from '../components/Sidebar'
import { BsGenderFemale } from "react-icons/bs";
import { IoMapOutline } from "react-icons/io5";


function Configs() {

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const fileInputRef = useRef(null); // Referência para o input do tipo file

  return (
    <>
      <Sidebar />

      <div className="profile-container">
        <div className='profile'>

          <div>
            <div
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px solid #ccc',
              }}
            >
              {previewImage && (
                <img alt="Pré-visualização"
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
              style={{ display: 'none' }}
            />
          </div>


          <div>{usuarios.map(usuario => (
            <h1 key={usuario.id}>
              {usuario.nome}
            </h1>
          ))}
          </div>

          <h2 className='info-usuario'> <BsGenderFemale fontSize={20} color='white'/> Masculino </h2>
          <h2 className='info-usuario'> <IoMapOutline fontSize={20} color='white'/> Florianópolis </h2>

          <div className='infos'>
            <p>alguma coisa para preencher o campo</p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Configs;