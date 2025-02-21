import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão de alternância */}

        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      {/* Sidebar oculta/invisível até clicar no botão */}
      <div className={`container-sidebar ${isOpen ? "show" : ""}`}>        

        <nav className="sidebar">      
          <a href="#"><i className="fas fa-home"></i> Página inicial</a>
          <a href="#"><i className="fas fa-compass"></i> Explorar</a>
          <a href="#"><i className="fas fa-bell"></i> Notificações</a>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
