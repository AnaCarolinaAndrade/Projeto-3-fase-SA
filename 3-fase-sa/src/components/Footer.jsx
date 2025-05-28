import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <div className='container-footer'>
      <footer className='.container-footer-2'>
        <div className='footer-section'>
        <div className='container-contatos'>
         <h3>Contatos</h3>
          <li>48 99455-7822</li>
          <li>DexesProject@Gmail</li>
          <li>dexes_project</li>
        </div>
        <div className='line-2'></div>

        <div className='container-menu'>
         <h3>Menu do site</h3>
         <li>Chat</li>
         <li>Postagens</li>
         <li>Perfil</li>
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