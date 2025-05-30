import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home.jsx';
import PerfilUser from '../pages/PerfilUser.jsx';
import Cadastro from '../pages/Cadastro.jsx';
import Login from '../pages/Login.jsx';
import Chat from '../pages/Chat.jsx';
import Configs from '../pages/Configs.jsx';
import Projetos from '../pages/Projetos.jsx';
import Ranking from "../pages/Ranking.jsx";
import GithubSuccess from './pages/GithubSuccess';

const router = createBrowserRouter([

    { path: "/", element: <Home /> },
    { path: "/perfil", element: <PerfilUser /> },
    { path: "/login", element: <Login /> },
    { path: "/cadastro", element: <Cadastro /> },
    { path: "/chat", element: <Chat /> },
    { path: "/configs", element: <Configs /> },
    { path: "/projetos", element: <Projetos /> },
    { path: "/ranking", element: <Ranking /> },
    { path: "/github-success", element: <GithubSuccess /> }


])

export default router;