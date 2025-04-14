import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/Home.jsx'
import PerfilUser from './pages/PerfilUser.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Login from './pages/Login.jsx'
import Chat from './pages/Chat.jsx'
import Configs from './pages/Configs.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

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
    element: <Login />
  },

  {
    path: "/cadastro",
    element: <Cadastro />
  },
  {
    path: "/chat",
    element: <Chat />
  },
  {
    path: "/configs",
    element: <Configs />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
