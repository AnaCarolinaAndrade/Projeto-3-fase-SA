import React from 'react';

const GITHUB_CLIENT_ID = 'Ov23li6xDVAOYbQH7Qd5';
const REDIRECT_URI = 'http://localhost:5000/github/callback'; // seu backend já trata esse callback

export default function GitHubLogin() {
  const loginWithGitHub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div>
      <button onClick={loginWithGitHub}>
        <h2>Login com GitHub</h2>
        Entrar com GitHub
      </button>
    </div>
  );
}
