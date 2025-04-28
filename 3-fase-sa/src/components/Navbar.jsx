import React from 'react'
import './Navbar.css'
import { IoIosSearch } from "react-icons/io";
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
            <button class="btn login">Login</button>
            <button class="btn signup">Cadastro</button>
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