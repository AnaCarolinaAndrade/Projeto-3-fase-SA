import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { GoBellFill } from "react-icons/go";
import { IoLogIn } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { LuChartSpline } from "react-icons/lu";
import { FaGear } from "react-icons/fa6";

import "./Sidebar.css";


function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>

      <div className={`container-sidebar ${isOpen ? "show" : ""}`}>
        <nav className="sidebar">
          <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)()}>
            <IoCloseOutline color="white" fontSize={30} />
          </button>

          <Link to={'/'} class="icon-text "><HiMiniHome color="white" fontSize={20} /><span className="link-text">Home </span></Link>
          <Link to={'/chat'} class="icon-text "><GoBellFill color="white" fontSize={20} /><span className="link-text"> chat</span></Link>
          <Link to={'/login'} class="icon-text "><IoLogIn color="white" fontSize={20} /><span className="link-text">Login </span> </Link>
          <Link to={'/configs'} className="icon-text"><FaGear color="white" fontSize={15} /><span className="link-text"> Configurações</span></Link>
          <Link to={'/cadastro'} className="icon-text"><FaGear color="white" fontSize={15} /> <span className="link-text"> Cadastro </span> </Link>
          <Link to={'/projetos'} className="icon-text"><LuChartSpline color="white" fontSize={15} /> <span className="link-text"> Projetos </span> </Link>
          <Link to={'/ranking'} className="icon-text"><LuChartSpline color="white" fontSize={15} /> <span className="link-text"> Ranking</span> </Link>
          <Link to={'/moderador'} className="icon-text"><LuChartSpline color="white" fontSize={15} /><span className="link-text"> Moderador </span></Link>

        </nav>
      </div>
    </>
  );
}

export default Sidebar;