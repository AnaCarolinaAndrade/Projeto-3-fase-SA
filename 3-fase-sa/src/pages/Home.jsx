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
          <div className='text-content'>
            <h1 className='title-home'>Descubra e Divulgue projetos <br /> Web, para o mundo todo <br /> com o DEXES</h1>
            <span className='subtitle-home'>
              Hub para desenvolvedores e criadores colaborarem em projetos web.
              <br /> Conecte-se, compartilhe ideias e transforme-as em oportunidades - tudo em um só lugar.
            </span>
          </div>

          <div className='image-content'>
            <img className='container-img' src="./img/landig_page.png" />
            <div className='degrade-container' />
          </div>
        </div>

        <div className='buttons-landig'>
          <button className='projetos-container'>Acessar Projetos</button>
          <button className='posts-container'>Acessar Posts</button>
        </div>      
        <Footer/>

      </div>
    </div>
  )
}

export default Home;