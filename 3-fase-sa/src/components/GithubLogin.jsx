import "./GithubLogin.css";



export default function GitHubLogin() {
  
  const GITHUB_CLIENT_ID = 'Ov23li6xDVAOYbQH7Qd5';
const REDIRECT_URI = 'http://localhost:5000/github/callback'; 
  const loginWithGitHub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="github-login">
      <button onClick={loginWithGitHub} className="github-button">
        <h2>Fazer login com o GitHub</h2>
      </button>
    </div>
  );
}
