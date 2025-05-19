import React, { useEffect } from 'react';

const GITHUB_CLIENT_ID = 'Ov23li6xDVAOYbQH7Qd5';
const BACKEND_URL = 'http://localhost:5000';

export default function GitHubLogin() {
  const loginWithGitHub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user`;
    window.location.href = githubAuthUrl;
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      // Trocar code por token de acesso
      fetch(`${BACKEND_URL}/exchange/github-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
        .then(res => res.json())
        .then(async ({ token }) => {
          // Agora autentica no backend com o token do GitHub
          const res = await fetch(`${BACKEND_URL}/api/github/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
          const data = await res.json();

          if (data.success) {
            console.log('Login realizado:', data);
            localStorage.setItem('session_token', data.session_token);
          } else {
            console.error('Erro no login GitHub:', data);
          }
        })
        .catch(err => console.error('Erro ao autenticar com GitHub:', err));
    }
  }, []);

  return (
    <div>
      <button onClick={loginWithGitHub}>
        <h2>Login com GitHub</h2>
        Entrar com GitHub
      </button>
    </div>
  );
}
