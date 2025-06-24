import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { FaUserFriends } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { LuChartSpline } from "react-icons/lu";
import { FaGear } from "react-icons/fa6";
import { GiLaurelsTrophy } from "react-icons/gi";
import { CgAddR } from "react-icons/cg";

import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [rodar, setRodar] = useState(false);
  const [girado, setGirado] = useState(false);

  const girar = () => {
    setRodar(true);

    setTimeout(() => {
      setRodar(false);
      setGirado(!girado);
    }, 300)
  };

  return (
    <>

      <div className={`container-sidebar ${isOpen ? "show" : ""}`}>
        <nav className="sidebar">
          <button
            className="toggle-btn"
            onClick={() => {
              setIsOpen(!isOpen),
                girar();
            }} >
            <IoCloseOutline
              color="white"
              fontSize={30}
              className={
                rodar
                  ? girado
                    ? "fixado"
                    : "rotacao"
                  : girado
                    ? "rotacao-reversa"
                    : ""
              }
            />

          </button>

          <Link to={'/'} className="icon-text "><HiMiniHome color="white" fontSize={18} /><span className="link-text">Home </span></Link>
          <Link to={'/pessoas_chat'} className="icon-text "><FaUserFriends color="white" fontSize={18} /><span className="link-text">Usuarios</span></Link>
          <Link to={'/criarProjeto'} className="icon-text"><CgAddR color="white" fontSize={18} /><span className="link-text">Criar Projeto</span> </Link>
          <Link to={'/projetos'} className="icon-text"><LuChartSpline color="white" fontSize={18} /> <span className="link-text">Projetos </span> </Link>
          <Link to={'/ranking'} className="icon-text"><GiLaurelsTrophy color="white" fontSize={18} /><span className="link-text">Ranking</span> </Link>
          <Link to={'/configs'} className="icon-text"><FaGear color="white" fontSize={16} /><span className="link-text"> Configurações</span></Link>

        </nav>
      </div>
    </>
  );
}

export default Sidebar;