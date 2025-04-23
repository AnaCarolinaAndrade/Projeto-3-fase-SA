import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './Home.css'


function Home() {
  return (
    <div> 
      <Navbar/> 
      <Sidebar/>
      <h2>Descubra e Divulge projetos Web, para o mundo todo com o DEXES</h2>   
    </div>
  )
}

export default Home;