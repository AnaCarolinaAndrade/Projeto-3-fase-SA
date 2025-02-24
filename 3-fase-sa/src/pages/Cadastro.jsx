import React from 'react'
import './Cadastro.css'

function Cadastro() {
    return (
        <>
            <div className="container">
                <div className="form-wrapper">
                    <div className='div-logo-cadastro'>
                        <img src="./img/logo.png" alt="" />
                    </div>
                    <div className="grid">
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" placeholder="Digite seu Email" />
                        </div>
                        <div className="input-group">
                            <label>Data</label>
                            <input type="date" />
                        </div>
                        <div className="input-group">
                            <label>Nome</label>
                            <input type="text" placeholder="Digite seu nome" />
                        </div>
                        <div className="input-group">
                            <label>Senha</label>
                            <input type="password" placeholder="Crie uma senha" />
                        </div>
                        <div className="input-group">
                            <label>Gênero</label>
                            <input type="text" placeholder="Digite seu gênero" />
                        </div>
                        <div className="input-group">
                            <label>Confirmar Senha</label>
                            <input type="password" placeholder="Digite a senha novamente" />
                        </div>
                    </div>
                    <div className="button-container">
                        <button className="submit-button">Registrar</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cadastro