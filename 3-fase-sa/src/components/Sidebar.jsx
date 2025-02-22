import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>

        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      <div className={`container-sidebar ${isOpen ? "show" : ""}`}>        

        <nav className="sidebar">      
          <Link to={'/'}> Página inicial</Link>
          <a href="#"> Explorar</a>
          <a href="#"> Notificações</a>
          <Link to={'./perfil'}>Perfil</Link>
          <Link to={'./login'}>Login</Link>

        </nav>
      </div>
    </>
  );
}

export default Sidebar;
