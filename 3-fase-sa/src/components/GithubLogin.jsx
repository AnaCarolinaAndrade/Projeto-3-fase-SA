import "./GithubLogin.css";



export default function GitHubLogin() {

  const GITHUB_CLIENT_ID = 'Ov23li6xDVAOYbQH7Qd5';
  const REDIRECT_URI = 'http://localhost:5000/github/callback'; // Esta é a URL do seu backend
  const loginWithGitHub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div>
      <button
        tabindex="0"
        role="button"
        aria-labelledby="button-label"
        class="git-login-btn"
        onClick={loginWithGitHub}
      >
        <div class="git-btn-overlay"></div>

        <div class="git-btn-content">
          <div class="git-icon-wrapper">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              class="git-icon"
            >
              <g>
                <path
                  fill="#ffff"
                  d="M24 0C10.74 0 0 10.74 0 24c0 10.61 6.87 19.6 16.41 22.79
                    1.2.22 1.64-.52 1.64-1.16 0-.57-.02-2.08-.03-4.08-6.68 1.45-8.09-3.22-8.09-3.22
                    -1.09-2.76-2.67-3.5-2.67-3.5-2.18-1.49.17-1.46.17-1.46 2.41.17 3.68 2.48 3.68 2.48
                    2.14 3.67 5.61 2.61 6.98 1.99.22-1.55.84-2.61 1.52-3.21
                    -5.33-.61-10.93-2.67-10.93-11.89 0-2.63.94-4.78 2.47-6.47
                    -.25-.61-1.07-3.06.23-6.38 0 0 2.01-.64 6.6 2.47
                    1.91-.53 3.96-.8 6-.81 2.04.01 4.09.28 6 .81
                    4.59-3.11 6.6-2.47 6.6-2.47 1.3 3.32.48 5.77.23 6.38
                    1.54 1.69 2.47 3.84 2.47 6.47 0 9.25-5.61 11.27-10.96 11.86
                    .86.74 1.63 2.21 1.63 4.45 0 3.21-.03 5.8-.03 6.59 0 .64.43 1.39 1.65 1.15
                    C41.14 43.59 48 34.61 48 24 48 10.74 37.26 0 24 0z"
                />
              </g>
            </svg>
          </div>

          <span class="git-text">Fazer Login com o Google</span>
        </div>
      </button>
    </div>

  );
}
