import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { GoBellFill } from "react-icons/go";
import { IoPersonSharp } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

import { FaGear } from "react-icons/fa6";

import "./Sidebar.css";


function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button className="btn-menu" onClick={() => setIsOpen(!isOpen)()}>
      <img 
          src="./img/logo_pequena.png" 
          alt="Menu" 
          style={{ width: '80px', height: '72px', cursor: 'pointer',   }} 
        />
      </button>

      <div className={`container-sidebar ${isOpen ? "show" : ""}`}>

        <nav className="sidebar">
            <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)()}>
              <IoCloseOutline color="white" fontSize={30} />
            </button>

           <Link to={'/'} class="icon-text "><HiMiniHome color="white" fontSize={20} />Home</Link>
           <Link to={'./chat'} class="icon-text "><GoBellFill color="white" fontSize={20} />chat</Link>
           <Link to={'./perfil'} class="icon-text "><IoPersonSharp color="white" fontSize={20} />Perfil</Link>
           <Link to={'./login'} class="icon-text "><IoLogIn color="white" fontSize={20} />Login</Link>
           <Link to={'./configs'} className="icon-text"><FaGear color="white" fontSize={15} />Configurações</Link>
        </nav>

      </div>
    </>
  );
}

export default Sidebar;
