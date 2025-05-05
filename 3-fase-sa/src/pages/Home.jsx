import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './Home.css'


function Home() {
  return (
    <div className='Home-container'>
      <Navbar />
      <Sidebar />
      <h1 className='title-home'>Descubra e Divulge projetos <br/> Web, para o mundo todo <br/> com o DEXES</h1>
      <p className='subtitle-home'> Hub para desenvolvedores e criadores colaborarem em projetos web. <br/> Conecte-se, compartilhe ideias e transforme-as em oportunidades - tudo em um só lugar.</p>
      <img className='container-img' src="./img/landig_page.png"/>
     <div className='degrade-container'/>
     <button className='acessar-container'>ioioioio</button>

    </div>
  )
}

export default Home;