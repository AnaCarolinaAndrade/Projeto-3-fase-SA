import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/Home.jsx'
import PerfilUser from './pages/PerfilUser.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.jsx'
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
    path:"/login",
    element: <Login />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
