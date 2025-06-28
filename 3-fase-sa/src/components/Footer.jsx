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
          <div className='line-1'></div>

          <div className='container-menu'>
            <h3>Menu do site</h3>
            <div className='container-info-menu'>
              <div className='alinhamento-1'>
                <li>Chat</li>
                <li>Postagens</li>
                <li>Perfil</li>
                <li>Configurações</li>
                <li>Profissionais</li>
              </div>

              <div className='alinhamento-2'>
                <li>Editar Projetos</li>
                <li>Projetos</li>
                <li>Criar Projetos</li>
                <li>Feedback</li>
              </div>

            </div>
          </div>
          <div className='line-2'></div>

          <div className='container-localizacao'>
            <h3>Localização</h3>
            <li>Florianópolis-SC, bairro coqueiros na rua santo antonio 137</li>
          </div>
          <div className='line-3'></div>
          <p className='container-paragrafo'>copyright @2025 DEXES-Direitos reservados</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer