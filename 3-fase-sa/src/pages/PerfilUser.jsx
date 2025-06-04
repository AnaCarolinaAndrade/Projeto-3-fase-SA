import React, { useState, useEffect, useRef } from 'react';
import './PerfilUser.css'
import Sidebar from '../components/Sidebar'
import { BsGenderFemale, BsPersonCircle } from 'react-icons/bs';
import { IoMapOutline } from "react-icons/io5";



function Configs() {
  
  const fileInputRef = useRef(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <>
      <Sidebar />

      <div className="profile-container">
        <div className='profile'>
          <div className="profile-card">
            <div className="profile-image">
              {previewImage ? (
                <img src={previewImage} alt="Preview" />
              ) : (
                <BsPersonCircle size={150} color="#ccc" />
              )}

            </div>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
            />

            <h1>{usuario}</h1>
            <div className="info">
              <BsGenderFemale />
              masculino
            </div>
            <div className="info">
              <IoMapOutline />
              florianópolis
            </div>
            <div className='info-profile'>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Configs;