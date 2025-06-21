import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import GitHubLogin from "../components/GithubLogin";

function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");


  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/');
      } else {
        alert(data.error || "Login falhou.");
      }
    } catch (error) {
      console.error("Erro no login tradicional:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('session_token', token);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);



  const onSuccess = async (credentialResponse) => {
    fetch('/api/user/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`,
      },
    })
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
        navigate('/');
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

  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-right">
        <form className="login-box">
          <div className="container-input">
            <div className="input-wrapper">
              <label htmlFor="email">Email:</label>
              <div className="ipt-email">

                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>
              <label htmlFor="senha">Senha:</label>
              <div className='ipt-senha-cadastro'>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="olhar-senha"
                  onClick={toggleMostrarSenha}
                >
                  {mostrarSenha ? <FaRegEye size={25} /> : <FaRegEyeSlash size={25} />}
                </button>
              </div>
            </div>
          </div>
          <button type="button" className="btn-rec-senha">Esqueceu sua senha?</button>

          <button type="submit" className="login-btn" onClick={handleLogin}>
            Log in
          </button>
          <div className="divisor">
            <span></span> ou <span></span>
          </div>

          <div className="container-btn">
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onFailure}
            />

            <GitHubLogin
              onSuccess={onSuccess}
              onError={onFailure}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;