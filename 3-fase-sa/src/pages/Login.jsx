import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-left">
        <img src="./img/logo.png" alt="Deqex Logo" className="logo-login" />
        <p>Texto de introdução da empresa</p>
      </div>

      <div className="login-right">
        <form className="login-box">
          <input type="email" placeholder="Email" className="input-field" />
          <input type="password" placeholder="Senha" className="input-field" />
          <button type="submit" className="login-btn">Log in</button>
          <div className="divider">
            <span></span> ou <span></span>
          </div>
          <button className="google-btn">
            <img src="./img/google.png" alt="Google" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
