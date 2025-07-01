import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import './Cadastro.css';
import Voltar from '../components/Voltar';

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erroEmail, setErroEmail] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [erroConfirmarSenha, setErroConfirmarSenha] = useState('');
    const [erroGeral, setErroGeral] = useState('');
    const [cadastroSucesso, setCadastroSucesso] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    const validarEmail = (email) => {
        if (!email) {
            return 'O email é obrigatório.';
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return 'Email inválido.';
        }
        return '';
    };

    const validarSenha = (senha) => {
        if (!senha) {
            return 'A senha é obrigatória.';
        }
        if (senha.length < 6) {
            return 'A senha deve ter no mínimo 6 caracteres.';
        }
        return '';
    };

    const validarConfirmarSenha = (confirmarSenha, senha) => {
        if (!confirmarSenha) {
            return 'Confirme sua senha.';
        }
        if (confirmarSenha !== senha) {
            return 'As senhas não coincidem.';
        }
        return '';
    };

    const criarUsuario = async (e) => {
        e.preventDefault();
        setErroGeral('');
        setCadastroSucesso(false);

        const emailErro = validarEmail(email);
        const senhaErro = validarSenha(senha);
        const confirmarSenhaErro = validarConfirmarSenha(confirmarSenha, senha);

        setErroEmail(emailErro);
        setErroSenha(senhaErro);
        setErroConfirmarSenha(confirmarSenhaErro);

        if (emailErro || senhaErro || confirmarSenhaErro || !nome || !dataNascimento) {
            setErroGeral('Por favor, preencha todos os campos e corrija os erros.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    senha,
                    nome,
                    dataNascimento,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setCadastroSucesso(true);
                setErroGeral('');

                // *** NOVA LÓGICA AQUI: ARMAZENAR O TOKEN ***
                if (data.sessionToken) {
                    localStorage.setItem('sessionToken', data.sessionToken);
                    console.log('Session Token armazenado:', data.sessionToken); // Para depuração
                }
                // ********************************************

                setNome('');
                setEmail('');
                setDataNascimento('');
                setSenha('');
                setConfirmarSenha('');
                setMostrarSenha(false);

                setTimeout(() => {
                    navigate('/'); // Redireciona para a página principal após o cadastro
                }, 4000);
            } else {
                setErroGeral(data.message || 'Erro ao cadastrar. Tente novamente.');
                setCadastroSucesso(false);
            }
        } catch (error) {
            console.error('Erro no cadastro:', error);
            setErroGeral('Erro de conexão com o servidor. Tente novamente mais tarde.');
            setCadastroSucesso(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-form-cadastro">
            <div className='voltar-container'>
                <Link to={"/"}> <Voltar color="white" /></Link>
            </div>

            <div className='container-cadastro'>
                <div className="form-wrapper">
                    <div className="form-container">
                        <form onSubmit={criarUsuario} className='form-cadastro'>
                            <h2>Criar Nova Conta</h2>

                            {cadastroSucesso && (
                                <div className='popup-mensagem-sucesso'>
                                    <p className="mensagem-sucesso">Cadastro realizado com sucesso! Redirecionando...</p>
                                </div>
                            )}
                            {erroGeral && (
                                <p className="mensagem-erro-geral">{erroGeral}</p>
                            )}

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Seu email"
                                    value={email}
                                    onChange={e => {
                                        setEmail(e.target.value);
                                        setErroEmail(validarEmail(e.target.value));
                                    }}
                                    onBlur={e => setErroEmail(validarEmail(e.target.value))}
                                    required
                                    className={erroEmail ? 'input-error' : ''}
                                />
                                {erroEmail && <p className="erro-mensagem">{erroEmail}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="nome">Nome completo</label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    placeholder="Seu nome completo"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="dataNascimento">Data de Nascimento</label>
                                <input
                                    type='date'
                                    id="dataNascimento"
                                    name="dataNascimento"
                                    value={dataNascimento}
                                    onChange={e => setDataNascimento(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="senha">Senha</label>
                                <div className='ipt-senha-cadastro'>
                                    <input
                                        type={mostrarSenha ? "text" : "password"}
                                        id="senha"
                                        name="senha"
                                        placeholder="Crie sua senha"
                                        value={senha}
                                        onChange={e => {
                                            setSenha(e.target.value);
                                            setErroSenha(validarSenha(e.target.value));
                                            if (confirmarSenha) setErroConfirmarSenha(validarConfirmarSenha(confirmarSenha, e.target.value));
                                        }}
                                        onBlur={e => setErroSenha(validarSenha(e.target.value))}
                                        required
                                        className={erroSenha ? 'input-error' : ''}
                                    />
                                    <button
                                        type="button"
                                        className="olhar-senha"
                                        onClick={toggleMostrarSenha}
                                    >
                                        {mostrarSenha ? <FaRegEye size={25} /> : <FaRegEyeSlash size={25} />}
                                    </button>
                                </div>
                                {erroSenha && <p className="erro-mensagem">{erroSenha}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                                <div className='ipt-senha-cadastro'>
                                    <input
                                        type={mostrarSenha ? 'text' : 'password'}
                                        id="confirmarSenha"
                                        placeholder="Confirme sua senha"
                                        value={confirmarSenha}
                                        onChange={e => {
                                            setConfirmarSenha(e.target.value);
                                            setErroConfirmarSenha(validarConfirmarSenha(e.target.value, senha));
                                        }}
                                        onBlur={e => setErroConfirmarSenha(validarConfirmarSenha(e.target.value, senha))}
                                        required
                                        className={erroConfirmarSenha ? 'input-error' : ''}
                                    />
                                </div>
                                {erroConfirmarSenha && <p className="erro-mensagem">{erroConfirmarSenha}</p>}
                            </div>

                            <button type="submit" className='enviar-formulario' disabled={loading}>
                                {loading ? 'Cadastrando...' : 'Criar Conta'}
                            </button>

                            <div className="link-login">
                                Já tem uma conta? <Link to="/login">Faça Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}