import React from 'react'
import './PerfilUser.css'
import Sidebar from '../components/Sidebar'
import { BsGenderFemale } from "react-icons/bs";
import { IoMapOutline } from "react-icons/io5";


function PerfilUser() {
  return (
    <>
      <Sidebar />

      <div className="profile-container">
        <div className='profile'>

            <img src="./img/foto-user.png"/>

            <h1>Ana Maria Dos Santos</h1> 
            <h2><BsGenderFemale fontSize={20} /> Feminino</h2>
            <h2><IoMapOutline fontSize={20}/> Florianópolis </h2>

            <div className='infos'>
              <p>alguma coisa para preencher o campo</p>
            </div>

          </div>
      </div>
    </>
  )
}

export default PerfilUser