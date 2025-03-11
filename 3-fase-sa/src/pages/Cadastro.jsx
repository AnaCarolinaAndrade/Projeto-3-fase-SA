import { useState } from "react";
import { motion } from "framer-motion";
import "./Cadastro.css";

export default function Cadastro() {
  const [etapa, setEtapa] = useState(1);

  return (
    <div className="container">
      <div className={`form-wrapper ${etapa === 2 ? "move-left" : ""}`}>
        {/* Tela 1 - Cadastro */}
        <motion.div
          key="form1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.4 }}
          className="form-section1"
        >
          <div className="div-logo-cadastro">
            <h1 className="text-3xl font-semibold">Cadastro</h1>
          </div>

          <div className="input-group">
            <input type="email" placeholder="Digite seu Email" />
            <input type="text" placeholder="Digite seu Nome" />
            <input type="date" />
            <input type="password" placeholder="Crie uma senha" />
            <input type="password" placeholder="Confirme sua senha" />
          </div>

          <div className="button-container">
            <button onClick={() => setEtapa(2)} className="submit-button">
              Próximo →
            </button>
          </div>
        </motion.div>

        {/* Tela 2 - Experiência */}
        <motion.div
          key="form2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="form-section2"
        >
          <div className="div-logo-cadastro">
            <h1 className="text-3xl font-semibold">Experiência</h1>
          </div>

          <div className="input-group">
            <label>Nível de experiência:</label>
            <select>
              <option>Selecione</option>
              <option>Júnior (2-5 anos)</option>
              <option>Pleno (6-9 anos)</option>
              <option>Sênior (9+ anos)</option>
            </select>
          </div>

          <p className="text-sm text-gray-400">
            Selecione a área que possui mais experiência
          </p>

          <div className="button-container">
            <button onClick={() => setEtapa(1)} className="submit-button">
              ←  Voltar
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}