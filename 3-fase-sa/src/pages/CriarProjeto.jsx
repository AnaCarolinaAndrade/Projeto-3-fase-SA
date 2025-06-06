import { useState } from 'react';
import './CriarProjeto.css';

export default function CriarProjeto() {

  const [nomeAleatorio] = useState([
    "byte-verse", "neural-forge", "cloud-spark",
    "pixel-core", "data-pulse", "code-lattice",
    "quantum-frame", "task-ship", "api-matrix",
    "stack-glow", "dexes", "fly-circular"
  ])

  return (
    <div className="application-main">
      <main>
        <div className="container">
          <h1 className="title">Criar um novo projeto</h1>
          <hr className="divider" />

          <form noValidate>
            <fieldset>
              <legend className="sr-only">Repository owner and name</legend>

              <div className="form-group">
                <label htmlFor="owner">Owner <span>*</span></label>
                <select id="owner" name="owner">
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
                <button type="button">Gerar nome</button>
              </div>
            </fieldset>

            <div className="form-group">
              <label htmlFor="description">descrição <span>(optional)</span></label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="A short description of your project"
              />
            </div>

            <button type="submit" className="btn-primary">Create repository</button>
          </form>
        </div>
      </main>
    </div>
  );
}
