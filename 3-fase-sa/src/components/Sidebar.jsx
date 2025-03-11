import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className={`container-sidebar ${isOpen ? "show" : ""}`}>

        <nav className="sidebar">
          
          <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
          <Link to={'/'} class="icon-text home"><img src="./img/botao-de-inicio.png" alt="" srcset="" /></Link>
          <a href="#" class="icon-text notifications"><img src="./img/notificacoes.png" alt="" srcset="" /> </a>
          <Link to={'./perfil'} class="icon-text profile"><img src="./img/perfil.png" alt="" srcset="" /></Link>
          <Link to={'./cadastro'} class="icon-text login"><img src="./img/entrar.png" alt="" srcset="" /></Link>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
