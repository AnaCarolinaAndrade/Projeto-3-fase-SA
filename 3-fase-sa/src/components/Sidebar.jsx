import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { GoBellFill } from "react-icons/go";
import { IoPersonSharp } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";


import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)()}>
          <RxHamburgerMenu color="white" fontSize={40} />
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

        </nav>
      </div>
    </>
  );
}

export default Sidebar;
