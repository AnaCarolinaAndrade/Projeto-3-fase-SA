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
  const [loading, setLoading] = useState(false); 

  const GOOGLE_CLIENT_ID = "91133392300-39a07fv5lve18rc1765igad45gh5o1l.apps.googleusercontent.com"; 

  const navigate = useNavigate(); 

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      const usuarioResponse = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const usuarioData = await usuarioResponse.json();

      if (usuarioResponse.ok) {
        const userId = localStorage.getItem('userId');
        if (usuarioData.sessionToken) {
          localStorage.setItem('sessionToken', usuarioData.sessionToken);
          localStorage.setItem('userType', 'profissional');
        } else if (usuarioData.id) {
          localStorage.setItem('userId', usuarioData.id);
          localStorage.setItem('userType', 'profissional');
        }
        navigate(`/perfil/${userId}`);
      } else {
        setLoginError(usuarioData.message || "Email ou senha inválidos.");
      }

    } catch (error) {
      console.error("Erro na tentativa de login:", error);
      setLoginError("Erro de conexão com o servidor. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  // --- Lógica de Login com Google (Mantida para Investidor ou outro tipo, se seu backend Node.js lidar com isso) ---
  const onSuccess = async (credentialResponse) => {
    setLoginError(null);
    setLoading(true); // Ativa o loading

    const idToken = credentialResponse.credential;

    try {
      // Enviar o ID Token para o backend Node.js (rota de investidores, ou o que for)
      const response = await fetch('http://localhost:5000/api/investidores/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: idToken }),
      });
      const data = await response.json();

      if (response.ok) { 
        alert(data.message || 'Login com Google realizado com sucesso!');
        if (data.sessionToken) { // Se o backend de investidor retornar sessionToken
          localStorage.setItem('sessionToken', data.sessionToken);
          localStorage.setItem('userType', 'investidor'); 
        } else if (data.id) {
          localStorage.setItem('userId', data.id);
          localStorage.setItem('userType', 'investidor');
        }
        navigate('/');
      } else {
        console.error('Erro no login com Google (backend):', data.message || data.error);
        setLoginError(data.message || 'Erro no login com Google. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar token Google para o backend:', error);
      setLoginError('Erro de conexão ao tentar login com Google.');
    } finally {
      setLoading(false);
    }
  };

  const onFailure = (error) => {
    console.error('Login com Google falhou:', error);
    setLoginError('Login com Google não pôde ser concluído. Verifique sua conexão.');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userType = params.get('userType'); 

    if (token) {
      localStorage.setItem('sessionToken', token);
      if (userType) {
        localStorage.setItem('userType', userType);
      } else {
        localStorage.setItem('userType', 'unknown');
      }
      navigate('/');
    }
  }, [navigate]);


  return (
    <div className="login-container">
      <div className='voltar-container'>
        <Link to={"/"}> <Voltar color="white" /></Link>
      </div>
      <div className="login-right">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>Bem-vindo(a) de volta!</h2>
          {loginError && <p className="error-message">{loginError}</p>}

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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Log in'}
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
          <div className="link-cadastro">
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;