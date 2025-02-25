import React, { useState } from 'react';
import './Cadastro.css';

function Cadastro() {
    const [moverParaLogin, setMoverParaLogin] = useState(false);

    const handleRegisterClick = () => {
        setMoverParaLogin(true);
    };

    const handleBackClick = () => {
        setMoverParaLogin(false);
    };

    return (
        <div className="container">
            <div className={`form-wrapper ${moverParaLogin ? "move-left" : ""}`}>

                <div className="form-section1">
                    <div>
                        <img src="./img/logo.png" alt="Logo" className='div-logo-cadastro' />
                    </div>
                    <div className="grid">
                        <div className="input-group">
                            <label className='label-cadastro'>Email</label>
                            <input type="email" placeholder="Digite seu Email" />
                        </div>
                        <div className="input-group">
                            <label className='label-cadastro'>Data</label>
                            <input type="date" />
                        </div>
                        <div className="input-group">
                            <label className='label-cadastro'>Nome</label>
                            <input type="text" placeholder="Digite seu nome" />
                        </div>
                        <div className="input-group">
                            <label className='label-cadastro'>Senha</label>
                            <input type="password" placeholder="Crie uma senha" />
                        </div>
                        <div className="input-group">
                            <label className='label-cadastro'>Escolha seu genêro</label>
                            <select>
                                <option value="opcao1">Homem</option>
                                <option value="opcao2">Mulher</option>
                                <option value="opcao3">Macho</option>
                                <option value="opcao3">Fêmea</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className='label-cadastro'>Confirmar Senha</label>
                            <input type="password" placeholder="Digite a senha novamente" />
                        </div>
                    </div>
                    <div className="button-container">
                        <button className="submit-button" onClick={handleRegisterClick}>
                            Registrar
                        </button>
                    </div>
                </div>

                {/* Formulário de Login */}
                <div className="form-section2">
                    <div className="grid">
                        <img src="./img/logo.png" alt="Logo" className='div-logo-cadastro' />
                        <div className="grid">

                            <div>
                                <input type="checkbox" className='checkbox-cadastro' />
                                <label className='label-cadastro2'>Email</label>
                            </div>
                            <div>
                                <input type="checkbox" className='checkbox-cadastro' />
                                <label className='label-cadastro2'>Email</label>
                            </div>
                            <div>
                                <input type="checkbox" className='checkbox-cadastro' />
                                <label className='label-cadastro2'>Email</label>
                            </div>
                            <div>
                                <input type="checkbox" className='checkbox-cadastro' />
                                <label className='label-cadastro2'>Email</label>
                            </div>
                            <div>
                                <input type="checkbox" className='checkbox-cadastro' />
                                <label className='label-cadastro2'>Email</label>
                            </div>
                            <div>
                                <input type="checkbox" className='checkbox-cadastro' />
                                <label className='label-cadastro2'>Email</label>
                            </div>
                            <div>
                                <input type="checkbox" className='checkbox-cadastro' />
                                <label className='label-cadastro2'>Email</label>
                            </div>


                        </div>
                        <div className="button-container">
                            <button className="submit-button" onClick={handleBackClick}>
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cadastro;
