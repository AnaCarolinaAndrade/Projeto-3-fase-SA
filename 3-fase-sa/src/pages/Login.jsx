import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
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
            <div className="input-wrapper">
              <label htmlFor="email">Email:</label>
              <div className="ipt-email">

                <input type="email" id="email" placeholder="Email" required />
              </div>
              <label htmlFor="senha">Senha:</label>
              <div className="ipt-senha">
                
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Senha"
                  required
                />
                <button
                  type="button"
                  className="olhar-senha"
                  onClick={toggleMostrarSenha}
                >
                  {mostrarSenha ? (
                    <FaRegEye size={25} color="black" />
                  ) : (
                    <FaRegEyeSlash size={25} color="black" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <button type="button" className="btn-rec-senha">Esqueceu sua senha?</button>

          <button type="submit" className="login-btn">
            Log in
          </button>
          <div className="divider">
            <span></span> ou <span></span>
          </div>

          <div className="container-btn">
            <button type="button" className="social-login-btn">
              <img src="./img/google.png" alt="Google" className="social-icon" />
              Continuar com Google
            </button>
            <button type="button" className="social-login-btn">
              <img src="./img/github.png" alt="GitHub" className="social-icon" />
              Continuar com GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;