import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './Home.css'
import Footer from '../components/Footer';


function Home() {
  return (
    <div className='Home-container'>
      {/* <Navbar />
      <Sidebar /> */}
      <div className='container-home'>

        <div className='container-title-home'>
          <h1 className='title-home'>Descubra e Divulge projetos <br /> Web, para o mundo todo <br /> com o DEXES</h1>
          <p className='subtitle-home'> Hub para desenvolvedores e criadores colaborarem em projetos web.
            <br /> Conecte-se, compartilhe ideias e transforme-as em oportunidades - tudo em um só lugar.</p>
          <img className='container-img' src="./img/landig_page.png" />
          <div className='degrade-container' />
        </div>

        <div className='buttons-landig'>
          <button className='projetos-container'>Acessar Projetos</button>
          <button className='posts-container'>Acessar Posts</button>
        </div>
      </div>
    </div>
  )
}

export default Home;