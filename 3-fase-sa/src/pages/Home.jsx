import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './Home.css'


function Home() {
  return (
    <div className='Home-container'> 
      <Navbar/> 
      <Sidebar/>
      <h1 className='title-home'>Descubra e Divulge projetos Web, para o mundo todo com o DEXES</h1>   
    </div>
  )
}

export default Home;