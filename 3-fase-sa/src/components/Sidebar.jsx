import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="container-sidebar">
        <nav class="sidebar">
          <a href="#"><i class="fas fa-home"></i> Página inicial</a>
          <a href="#"><i class="fas fa-compass"></i> Explorar</a>
          <a href="#"><i class="fas fa-bell"></i> Notificações</a>
        </nav>
    </div>
  );
}

export default Sidebar;