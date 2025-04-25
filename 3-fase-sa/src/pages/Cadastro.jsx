import { useState } from "react";
import { motion } from "framer-motion";
import "./Cadastro.css";
[]
export default function Cadastro() {
  const [showPj, setShowPj] = useState(false);
  const [cadastroPf, setCadastroPf] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
  });

  const [cadastroPj, setCadastroPj] = useState({
    razaoSocial: '',
    cnpj: '',
    email: '',
    senha: '',
  });

  const handlePfChange = (event) => {
    const { name, value } = event.target;
    setCadastroPf({ ...cadastroPf, [name]: value });
  };

  const handlePjChange = (event) => {
    const { name, value } = event.target;
    setCadastroPj({ ...cadastroPj, [name]: value });
  };

  const handleContinuarPf = () => {
    setShowPj(true);
  };

  const handleSubmitPf = (event) => {
    event.preventDefault();
    console.log('Cadastro PF:', cadastroPf);
    // Aqui você faria a lógica para enviar os dados de cadastro PF
  };

  const handleSubmitPj = (event) => {
    event.preventDefault();
    console.log('Cadastro PJ:', cadastroPj);
    // Aqui você faria a lógica para enviar os dados de cadastro PJ
  };

  return (
    <div className={`container ${showPj ? 'mover-para-direita' : ''}`}>
      <div className="cadastro-esquerda">
        <h2>Cadastro de Pessoa Física</h2>
        <form onSubmit={handleSubmitPf} id="cadastro-pf">
          <div className="form-group">
            <label htmlFor="nome-pf">Nome Completo:</label>
            <input
              type="text"
              id="nome-pf"
              name="nome"
              value={cadastroPf.nome}
              onChange={handlePfChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cpf">CPF:</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={cadastroPf.cpf}
              onChange={handlePfChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email-pf">Email:</label>
            <input
              type="email"
              id="email-pf"
              name="email"
              value={cadastroPf.email}
              onChange={handlePfChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha-pf">Senha:</label>
            <input
              type="password"
              id="senha-pf"
              name="senha"
              value={cadastroPf.senha}
              onChange={handlePfChange}
              required
            />
          </div>
          <button type="button" onClick={handleContinuarPf}>
            Continuar
          </button>
        </form>
      </div>
      <div className="cadastro-direita">
        <h2>Cadastro de Pessoa Jurídica</h2>
        <form onSubmit={handleSubmitPj} id="cadastro-pj">
          <div className="form-group">
            <label htmlFor="razao-social">Razão Social:</label>
            <input
              type="text"
              id="razao-social"
              name="razaoSocial"
              value={cadastroPj.razaoSocial}
              onChange={handlePjChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cnpj">CNPJ:</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={cadastroPj.cnpj}
              onChange={handlePjChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email-pj">Email:</label>
            <input
              type="email"
              id="email-pj"
              name="email"
              value={cadastroPj.email}
              onChange={handlePjChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha-pj">Senha:</label>
            <input
              type="password"
              id="senha-pj"
              name="senha"
              value={cadastroPj.senha}
              onChange={handlePjChange}
              required
            />
          </div>
          <button type="submit">Cadastrar PJ</button>
        </form>
      </div>
    </div>
  );
}