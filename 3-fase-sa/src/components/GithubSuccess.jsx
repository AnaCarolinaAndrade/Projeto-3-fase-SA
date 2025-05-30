// src/pages/GithubSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GithubSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('session_token', token);
      navigate('/');  
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <p>Conectando com GitHub...</p>;
}
