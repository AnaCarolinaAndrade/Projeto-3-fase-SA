import React from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import "./Login.css";

function Login() {

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
                <input type="password" placeholder="Senha" />
                <button className="button"><FaRegEyeSlash size={25} color="black" /></button>
              </div>
              <button className="btn-rec-senha">Esqueceu sua senha?</button>
            </div>
          </div>


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
