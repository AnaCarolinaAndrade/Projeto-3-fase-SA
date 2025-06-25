import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './Home.css'
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function Home() {

  return (
    <div className='container-home-home'>       
      <Navbar />
      <Sidebar />
      <div className='Home-container'>

        <div className='container-home'>

          <div className='container-title-home'>
            <div className='text-content'>
              <h1 className='title-home'>Descubra e Divulgue projetos <br /> Web, para o mundo todo <br /> com o DEXES</h1>
              <h2 className='subtitle-home'>
                Hub para desenvolvedores e criadores colaborarem em projetos web.
                <br /> Conecte-se, compartilhe ideias e transforme-as em oportunidades - tudo em um só lugar.
              </h2>
            </div>

            <div className='image-content'>
              <img className='container-img' src="./img/landig_page.png" />
              <div className='degrade-container' />
            </div>
          </div>

          <div className='buttons-landig'>
            <Link to={'./projetos'} className='botoes-projetos'>Acessar  Projetos</Link>
            <button className='botoes-projetos'> Acessar Posts</button>
          </div>

          <div className='container-home-projetos'>
            <div className='container-home-projetos-position'>
              <div className='container-neuralMid'>
               <h2>NeuralMind</h2>
               <h4>"IA com intuição humana"</h4>
               <p>Um sistema de inteligência artificial que simula intuições humanas com base em memória contextual e emocional. <br/>
               Ideal para líderes tomarem decisões ambíguas em momentos críticos <br/> — como se tivessem um conselheiro hiperinteligente, mas empático.</p>
               <p>Caso de uso: CEOs, médicos, diplomatas</p>
               <button>Acessar</button>
              </div>
             
              <div className='container-deepVision'>
               <h2>DeepVision</h2>
               <h4>"O olho que vê o invisível"</h4>
               <p>Plataforma que combina visão computacional e espectroscopia para detectar problemas invisíveis a olho nu — como rachaduras internas em pontes,
               falhas celulares antes de exames detectarem ou anomalias em alimentos.</p>
               <p>Caso de uso: Engenharia, saúde, segurança alimentar.</p>
               <button>Acessar</button>
              </div>

              <div className='container-smartPredict'>
               <h2>SmartPredict</h2>
               <h4>O motor preditivo que aprende com você</h4> 
               <p>Em vez de modelos pré-treinados, esse sistema aprende com os próprios dados e decisões do usuário, 
               criando modelos de IA únicos para cada empresa — com explicabilidade natural em linguagem humana.</p>
               <p>Caso de uso: Startups, PMEs, consultores</p>
               <button>Acessar</button>
              </div>
             
              <div className='container-codeForge'>
               <h2>CodeForge</h2>
               <h4>Forge sua ideia. Lance em minutos.</h4>
               <p>Um “GitHub + Heroku + ChatGPT” com turbo: o desenvolvedor descreve a ideia, 
               e o sistema gera, testa, versiona, implanta e mantém o código, com feedbacks ao vivo e correções automatizadas.</p>
               <p>caso de uso: Hackathons, MVPs, agências tech.</p>
               <button>Acessar</button>
              </div>
            </div> 
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home;