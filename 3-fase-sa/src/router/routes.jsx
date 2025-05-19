import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home.jsx';
import PerfilUser from '../pages/PerfilUser.jsx';
import Cadastro from '../pages/Cadastro.jsx';
import Login from '../pages/Login.jsx';
import Chat from '../pages/Chat.jsx';
import Configs from '../pages/Configs.jsx';
import Projetos from '../pages/Projetos.jsx';
import Ranking from "../pages/Ranking.jsx";
import Moderador from "../pages/Moderador.jsx";

const router = createBrowserRouter([

    { path: "/", element: <Home /> },
    { path: "/perfil", element: <PerfilUser /> },
    { path: "/login", element: <Login /> },
    { path: "/cadastro", element: <Cadastro /> },
    { path: "/chat", element: <Chat /> },
    { path: "/configs", element: <Configs /> },
    { path: "/projetos", element: <Projetos /> },
    { path: "/ranking", element: <Ranking /> },
    { path: "/moderador", element: <Moderador /> }

])

export default router;