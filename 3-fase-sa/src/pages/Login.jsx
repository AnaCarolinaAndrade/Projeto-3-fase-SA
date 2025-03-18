import React from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import "./Login.css";

function Login() {

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  return (
    <div className="login-container">

      <div className="login-right">
        <form className="login-box">

          <div className="container-input">
            <div class="input-wrapper">
              <div className="ipt-email">
                <input type="email" placeholder="Email" />
              </div>
              <div className="ipt-senha">
                <input id="senha"   type={mostrarSenha ? 'text' : 'password'} />
                <button className="button" onClick={toggleMostrarSenha}><FaRegEyeSlash size={25} color="black" /></button>
              </div>
            </div>
          </div>
          <button className="btn-rec-senha">Esqueceu sua senha?</button>



          <button type="submit" className="login-btn">Log in</button>


          <div className="divider">
            <span></span> ou <span></span>
          </div>

          <button className="container-btn">
            <img src="./img/google.png" alt="Google" />
            <img src="./img/github.png" alt="" srcset="" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
