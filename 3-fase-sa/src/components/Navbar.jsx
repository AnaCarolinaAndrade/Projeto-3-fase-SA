import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <>
      <div className='container-navbar'>
        <nav class="navbar">
          <div class="logo">&lt;DEXES/&gt;</div>

          <div class="search-container">
            <input type="text" placeholder="Pesquisar..." />
          </div>

          <div class="buttons-container">
            <Link class="btn login">Login</Link>
            <Link class="btn signup">Cadastro</Link>
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