import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';


function Home() {
  return (
    <div>      
      <Navbar/>
      <Sidebar/>

    </div>
  )
}

export default Home;