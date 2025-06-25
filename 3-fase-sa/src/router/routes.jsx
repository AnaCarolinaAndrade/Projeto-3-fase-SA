import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home.jsx';
import PerfilUser from '../pages/PerfilUser.jsx';
import Cadastro from '../pages/Cadastro.jsx';
import Login from '../pages/Login.jsx';
import PessoasChat from '../pages/PessoasChat.jsx';
import Chat from '../pages/Chat.jsx';
import Configs from '../pages/Configs.jsx';
import Projetos from '../pages/Projetos.jsx';
import Ranking from "../pages/Ranking.jsx";
import GithubSuccess from '../components/GithubSuccess.jsx';
import CriarProjeto from "../pages/CriarProjeto.jsx";
import Cadastro_investidor from "../pages/Cadastro_investidor.jsx";

const router = createBrowserRouter([

    { path: "/", element: <Home /> },
    { path: "/perfil", element: <PerfilUser /> },
    { path: "/login", element: <Login /> },
    { path: "/cadastro", element: <Cadastro /> },
    { path: "/pessoas_chat", element: <PessoasChat /> },
    { path: "/chat", element: <Chat /> },
    { path: "/configs", element: <Configs /> },
    { path: "/projetos", element: <Projetos /> },
    { path: "/ranking", element: <Ranking /> },
    { path: "/GithubCuccess", element: <GithubSuccess /> },
    { path: "/criarProjeto", element: <CriarProjeto /> },
    { path: "/cadastro_investidor", element: <Cadastro_investidor /> },


])

export default router;