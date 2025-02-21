import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <>
      <div className='container-navbar'>
        <nav class="navbar">

          <div>
            <img src="./img/logo.png" className='logo' />
          </div>

          <div class="search-bar">
            <input type="search" />
            <button>
              <img src="./img/lupa.png" alt="" srcset="" />
            </button>
          </div>

          <div class="user-icon">
            👤
          </div>
        </nav>
      </div>
    </>
  )
}

export default Navbar