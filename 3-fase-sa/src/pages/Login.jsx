import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
import Voltar from "../components/Voltar";

function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loginError, setLoginError] = useState(null);

  const GOOGLE_CLIENT_ID = "91133392300-39a07fv5lve18rc1765igad459gh5o1l.apps.googleusercontent.com"; 

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null); 

    try {
      //Caso o usuario tente fazer login como INVESTIDOR no backend Node.js
      const investidorResponse = await fetch('http://localhost:5000/api/investidores/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const investidorData = await investidorResponse.json();

      if (investidorResponse.ok) { // Login de investidor bem sucedido
        alert(investidorData.message || "Login de investidor realizado com sucesso!");
        navigate('/'); 
        return; 
      }

      // **Caso o usuario faça login como PROFISSIONAL (no Backend em python)
      const usuarioResponse = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const usuarioData = await usuarioResponse.json();

       if (usuarioResponse.ok) { // Login de usuário PROFISSIONAL BEM-SUCEDIDO
        alert(usuarioData.message || "Login de usuário realizado com sucesso!");
        navigate('/');
      } else {
        // Se ambos falharam, exibe a mensagem de erro da última tentativa
        setLoginError(usuarioData.message || investidorData.message || "Email ou senha inválidos.");
      }

      } catch (error) {
       console.error("Erro na tentativa de login:", error);
       setLoginError("Erro de conexão com o servidor. Por favor, tente novamente mais tarde.");
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

  // Lógica de Login com Google 
  const onSuccess = async (credentialResponse) => {
    setLoginError(null); 

    const idToken = credentialResponse.credential; 

    try {
      // Enviar o ID Token para o backend Node.js (rota de investidores)
      const response = await fetch('http://localhost:5000/api/investidores/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: idToken }),
      });
      const data = await response.json();

      if (response.ok) { // Login com Google BEM-SUCEDIDO
        alert(data.message || 'Login com Google realizado com sucesso!');
        navigate('/');
      } else {
        console.error('Erro no login com Google (backend):', data.message || data.error);
        setLoginError(data.message || 'Erro no login com Google. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar token Google para o backend:', error);
      setLoginError('Erro de conexão ao tentar login com Google.');
    }
  };

 const onFailure = (error) => {
    console.error('Login com Google falhou:', error);
    setLoginError('Login com Google não pôde ser concluído. Verifique sua conexão.');
  };
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className='voltar-container'>
        <Link to={"/"}> <Voltar color="white" /></Link>
      </div>
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
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
             <GoogleLogin
              onSuccess={onSuccess}
              onError={onFailure}
            />
          </GoogleOAuthProvider>
          </div>
        </form>
      </div>
    </div>
  );
}


export default Login;