import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { GoBellFill } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { LuChartSpline } from "react-icons/lu";
import { FaGear } from "react-icons/fa6";
import { GiLaurelsTrophy } from "react-icons/gi";

import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [girando, setGirando] = useState(false)

  const girar = () => {
    setGirando(true);
    setTimeout(() => setGirando(false), 300)
  };

  return (
    <>

      <div className={`container-sidebar ${isOpen ? "show" : ""}`}>
        <nav className="sidebar">
          <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)()} >
            <button onClick={girar}>
              <IoCloseOutline
                color="white"
                fontSize={30}
                className={girando ? "rotate" : ""}
              />
            </button>

          </button>

          <Link to={'/'} className="icon-text "><HiMiniHome color="white" fontSize={18} /><span className="link-text">Home </span></Link>
          <Link to={'/chat'} className="icon-text "><GoBellFill color="white" fontSize={18} /><span className="link-text"> chat</span></Link>
          <Link to={'/configs'} className="icon-text"><FaGear color="white" fontSize={16} /><span className="link-text"> Configurações</span></Link>
          <Link to={'/projetos'} className="icon-text"><LuChartSpline color="white" fontSize={18} /> <span className="link-text"> Projetos </span> </Link>
          <Link to={'/ranking'} className="icon-text"><GiLaurelsTrophy color="white" fontSize={18} /><span className="link-text"> Ranking</span> </Link>

        </nav>
      </div>
    </>
  );
}

export default Sidebar;