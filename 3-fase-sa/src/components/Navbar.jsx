import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <>
      <div className='container-navbar'>
        <nav class="navbar">

          <div className='nav-logo'>
            <img src="./img/logo.png" className='logo' />
          </div>

          <div class="search-bar">
            <input type="search" />
            <button>
              <img src="./img/lupa.png" />
            </button>
          </div>

          <div class="user-icon">
            <Link to={'./Perfil'} className='link-perfil'>
              <img src="./img/foto-user.png" className="foto-perfil" />
            </Link>
          </div>

        </nav>
      </div>
    </>
  )
}

export default Navbar