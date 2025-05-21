import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <div className='container-footer'>
      <footer className='.container-footer-2'>
        <div className='footer-section'>
        <div className='container-contatos'>
         <h3> <img src='./img/chamada-telefonica.png' className='img-contatos'/>Contatos</h3>
          <li> <img src='./img/whatsapp.png' className='img-whatsapp'/> 48 99455-7822</li>
          <li> <img src='./img/email.png' className='img-email'/>DexesProject@Gmail</li>
          <li> <img src='./img/instagram.png' className='img-instagram'/>dexes_project</li>
        </div>
        <div className='line-2'></div>

        <div className='container-menu'>
         <h3> <img src='./img/menu.png' className='img-menu'/>Menu do site</h3>
         <li> <img src='./img/chat.png' className='img-chat'/>Chat</li>
         <li> <img src='./img/Posts.png' className='img-posts'/>Postagens</li>
         <li> Perfil</li>
         <li>Ranking</li>
         <li>Projetos</li>
         <li>Criar Projetos</li>
         <li>Feedback</li>
        </div>
        <div className='line-3'></div>

        <div className='container-localizacao'>
         <h3>Localização</h3>
         <li>Florianópolis-SC, bairro coqueiros na rua santo antonio 137</li>
        </div>
        <div className='line-4'></div>
        <p className='container-paragrafo'>copyright @2025 DEXES-Direitos reservados</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer