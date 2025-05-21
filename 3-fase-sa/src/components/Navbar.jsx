import React, { useState } from "react";
import './Navbar.css'
import { Link } from 'react-router-dom';


function Navbar() {
  return (
    <>
      <div className='container-navbar'>
        <nav class="navbar">
          <button>
            <img
              src="./img/logo_pequena.png"
              style={{
                width: '80px',
                height: '50px',
                cursor: 'pointer',
              }}
            />
          </button>

          <div class="search-container">
            <input type="text" placeholder="Pesquisar por..." />
          </div>

          <div class="buttons-container">
            <div className="links-nav">
              <Link to={'./login'} class="btn login">Login</Link>
              <Link to={'./cadastro'} class="btn signup">Cadastro</Link>
            </div>

            <Link to={'/perfil'} className="link-perfil">
              <img src="./img/perfil.png" className='foto-perfil-nav' />
            </Link>

          </div>
        </nav>
      </div>
    </>
  )
}

export default Navbar