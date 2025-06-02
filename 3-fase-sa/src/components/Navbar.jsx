import React, { useState } from "react";
import './Navbar.css'
import { Link } from 'react-router-dom';
import Busca from "../components/Busca.jsx"


function Navbar() {

  const [buscar, setBuscar] = useState("")

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
            <Busca buscar={buscar} setBuscar={setBuscar} />
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