import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const navigate = useNavigate();



  const onSuccess = async (credentialResponse) => {
    fetch('/api/user/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
      },
    })
    console.log(credentialResponse);
    const idToken = credentialResponse.credential;
    try {
      const response = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('sessionToken', data.sessionToken);
        navigate('/dashboard');
      } else {
        console.error('Erro no login com Google (backend):', data.error);
      }
    } catch (error) {
      console.error('Erro ao enviar token para o backend:', error);
    }
  };

  const onFailure = (error) => {
    console.error('Login com Google falhou:', error);
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
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onFailure}
              text="signin_with"
              size="large"
              shape="rectangular"
              theme="outline"
              id="google-login-btn"
            />
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