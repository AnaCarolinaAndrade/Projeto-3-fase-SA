import React from 'react'
import './Navbar.css'
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <>
      <div className='container-navbar'>
        <nav class="navbar">

          <div className='nav-logo'>
            <Link to={'/'}>
              <img src="./img/logo.png" className='logo-navbar' />
            </Link>
          </div>

          <div class="search-bar">
            <input type="search" />
            <button>
            <IoIosSearch fontSize={20}/>
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