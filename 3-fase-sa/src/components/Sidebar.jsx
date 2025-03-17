import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { GoBellFill } from "react-icons/go";
import { IoPersonSharp } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);


  return (
    <>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)()}>
        <IoCloseOutline color="black" fontSize={60} />
      </button>
      <div className={`container-sidebar ${isOpen ? "show" : ""}`}>

        <nav className="sidebar">
          <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)()}>
            <IoCloseOutline color="white" fontSize={60} />
          </button>

            <Link to={'/'} class="icon-text home"><HiMiniHome color="white" fontSize={25} /></Link>
            <a href="#" class="icon-text notifications"><GoBellFill color="white" fontSize={25} /></a>
            <Link to={'./perfil'} class="icon-text profile"><IoPersonSharp color="white" fontSize={25} /></Link>
            <Link to={'./login'} class="icon-text login"><IoLogIn color="white" fontSize={25} /></Link>

        </nav>
      </div>
    </>
  );
}

export default Sidebar;
