import React from 'react'
import Navbar from '../components/Navbar'
import './PerfilUser.css'

function PerfilUser() {
  return (
    <>
      <Navbar />

      <div className="profile-container">
        
        <div className="rainbow-banner"></div>

        <div className="profile-content">
          <div className="profile-picture">
            <img src="./img/foto-user.png" alt="User" className="profile-img" />
          </div>
          <h1 className="username">Pedro_Henrique_Marques</h1>
          <p className="bio">Sou o Pedro e vejo coisas gays</p>
        </div>

        <div className='divisor'>
        </div>
      </div>



    </>
  )
}

export default PerfilUser