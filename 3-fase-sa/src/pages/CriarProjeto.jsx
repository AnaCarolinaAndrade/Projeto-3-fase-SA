import { useState } from 'react';
import './CriarProjeto.css';

export default function CriarProjeto() {

  const [nomeProjeto, setNomeProjeto] = useState('');

  const [nomeAleatorio] = useState([
    "byte-verse", "neural-forge", "cloud-spark",
    "pixel-core", "data-pulse", "code-lattice",
    "quantum-frame", "task-ship", "api-matrix",
    "stack-glow", "Dexes", "fly-circular", "CodeSync",
    "DataForge", "APIverse", "StackBoard", "BitFlow", "SecureNest",
    "DevOpsy", "AuthPilot", "PixelAdmin", "NetScope",
    "ZenBlocks", "NeuroCanvas", "EchoForm", "QuantumQuery",
    "OrbitPlay", "CodeDrip", "SynthByte", "NanoDash",
    "Refactron", "LogiCrate", "BugHunter3000", "SnackBarJS", "ToastyStack",
    "MonkeyPatchers", "DuckDeploy", "LazyLoader", "Hacktrix",
    "404Land", "ChocoByte", "NullPointer Café"
  ])

  const criarProjeto = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/projetos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    }
  }

  return (
    <div className="application-main">
      <main>
        <div className="container">
          <h1 className="title">Criar um novo projeto</h1>
          <hr className="divider" />

          <form noValidate>
            <fieldset>
              <legend className="sr-only">Informações do projeto</legend>

              <div className="form-group">
                <label htmlFor="propietario">Propietario <span>*</span></label>
                <select id="propietario" name="propietario">
                  <option value="L7noxy">L7noxy</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="repo-name">Nome do projeto <span>*</span></label>
                <input
                  type="text"
                  placeholder="meu projeto"
                  required
                />
              </div>

              <div className="form-suggestion">
                <p>Bons nomes de projetos são curtos e memoraveis. Precisa de uma inspiração?</p>
                <button type="button" onClick={() => setNomeProjeto(nomeAleatorio[Math.floor(Math.random() * nomeAleatorio.length)])}>Gerar nome</button>
                <div>
                  <p>{nomeAleatorio[Math.floor(Math.random() * nomeAleatorio.length)]}</p>
                </div>
              </div>
            </fieldset>

            <div className="form-group">
              <label htmlFor="description">descrição <span>(optional)</span></label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Uma breve descrição do seu projeto"
              />
            </div>

            <button type="submit" className="btn-primary">Create repository</button>
          </form>
        </div>
      </main>
    </div>
  );
}
