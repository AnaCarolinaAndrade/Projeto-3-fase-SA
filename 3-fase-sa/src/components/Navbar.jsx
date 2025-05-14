import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <>
      <div className='container-navbar'>
        <nav class="navbar">

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