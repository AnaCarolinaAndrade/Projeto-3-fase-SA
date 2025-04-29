import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './Home.css'


function Home() {
  return (
    <div className='Home-container'>
      <Navbar />
      <Sidebar />
      <h1 className='title-home'>Descubra e Divulge projetos Web, <br/> para o mundo todo com o DEXES</h1>
      <p className='subtitle-home'>O DEXES é o hub ideal para desenvolvedores, criadores e entusiastas explorarem, divulgarem e colaborarem em projetos web inovadores. <br/>
      Conecte-se com uma comunidade global, compartilhe suas ideias e transforme boas iniciativas em oportunidades reais  tudo em um só lugar.</p>
      <img scr="./img/landig_page.png" alt=""/>
    </div>
  )
}

export default Home;