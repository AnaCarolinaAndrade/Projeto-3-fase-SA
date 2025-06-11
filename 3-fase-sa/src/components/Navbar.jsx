import React, { useState, useEffect } from "react";
import './Navbar.css'
import { Link } from 'react-router-dom';


function Navbar() {

  // 1. Adicione o estado para controlar se o usuário está logado
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 2. Use useEffect para verificar o status de login quando o componente é montado
  useEffect(() => {
    // Esta é a mesma lógica que usamos no Projetos.jsx
    // Altere 'authToken' para o nome real do seu token no localStorage, se for diferente
    const token = localStorage.getItem('authToken');
    if (token) {
      // Se um token existe, assumimos que o usuário está logado
      // Em uma aplicação real, você faria uma validação no backend aqui
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('authToken');
      setIsLoggedIn(!!updatedToken); // Converte para booleano
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  return (
    <>
      <div className='container-navbar'>
        <nav className="navbar">
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
            <input type="text" placeholder="Digite algo..." />
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