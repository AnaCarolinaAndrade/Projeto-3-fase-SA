import React, { useState } from "react";
import './Navbar.css'
import { Link } from 'react-router-dom';


function Navbar() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className='container-navbar'>
        <nav class="navbar">
        <button className="btn-menu" onClick={() => setIsOpen(!isOpen)()}>
        <img
          src="./img/logo_pequena.png"
          alt=""
          style={{ width: '80px', height: '72px', cursor: 'pointer', }}
        />
      </button>

          <div class="search-container">
            <input type="text" placeholder="Pesquisar por..." />
          </div>

          <div class="buttons-container">
            <Link to={'./login'} class="btn login">Login</Link>
            <Link to={'./cadastro'} class="btn signup">Cadastro</Link>
            <Link to={'/perfil'}>
              <img src="./img/perfil.png"  />
            </Link>
            
          </div>
        </nav>
      </div>
    </>
  )
}

export default Navbar