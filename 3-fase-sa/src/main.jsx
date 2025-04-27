import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home.jsx';
import PerfilUser from './pages/PerfilUser.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Login from './pages/Login.jsx';
import Chat from './pages/Chat.jsx';
import Configs from './pages/Configs.jsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/perfil",
    element: <PerfilUser />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/configs",
    element: <Configs />,
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="187533279088-8ck947lb5vptqltevj9e04m9rvs8i4tu.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);