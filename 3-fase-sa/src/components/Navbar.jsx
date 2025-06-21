import React, { useState, useEffect } from "react";
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'; // Importe useNavigate para redirecionar no logout


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('authToken');
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false); 
    navigate('/login');
  };

  const goToInvestidor = () => {
    setModalOpen(false);
    navigate('/Cadastro_investidor');
  };

  const goToProfissional = () => {
    setModalOpen(false);
    navigate('/Cadastro');
  };

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
              alt="Logo" // Sempre bom adicionar alt text para imagens
            />
          </button>

          <div className="search-container">
            <input type="text" placeholder="Digite algo..." />
          </div>

          <div className="buttons-container">
         
            {!isLoggedIn && (
              <div className="links-nav">
                <Link to={'./login'} className="btn login">Login</Link>
               <button onClick={() => setModalOpen(true)} className="btn signup">Cadastro</button>
              </div>
            )}

            {isLoggedIn && (
              <>
                <Link to={'/perfil'} className="link-perfil">
                  <img src="./img/perfil.png" className='foto-perfil-nav' alt="Foto de Perfil" />
                </Link>
                <button onClick={handleLogout} className="btn logout">Sair</button>
              </>
            )}


          </div>
        </nav>
        </div>
        {modalOpen && (
        <div className='container-popUp'onClick={() => setModalOpen(false)}>
          <div className='container-popUp-alinhamento'onClick={e => e.stopPropagation()}>
            <h2>Qual área você deseja cadastrar?</h2>
            <button onClick={goToInvestidor}>Cadastro Investidor</button>
            <button onClick={goToProfissional}>Cadastro Profissional</button>
            <button className="button-x" onClick={() => setModalOpen(false)}>x</button>
          </div>
      </div>
      )}
    </>
  )
}

export default Navbar;