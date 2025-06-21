import { useState } from 'react';
import './CriarProjeto.css';
import { useNavigate } from 'react-router-dom';


export default function CriarProjeto() {

  const navigate = useNavigate();

  const [nomeProjeto, setNomeProjeto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');
  const [nomeSugerido, setNomeSugerido] = useState('');

  const [nomeAleatorio] = useState([
    "byte-verse", "neural-forge", "cloud-spark",
    "pixel-core", "data-pulse", "code-lattice",
    "quantum-frame", "task-ship", "api-matrix",
    "stack-glow", "CodeSync", "SecureNest", "ToastyStack",
    "DataForge", "APIverse", "StackBoard", "BitFlow",
    "DevOpsy", "AuthPilot", "PixelAdmin", "NetScope",
    "ZenBlocks", "NeuroCanvas", "EchoForm", "QuantumQuery",
    "OrbitPlay", "CodeDrip", "SynthByte", "NanoDash",
    "Refactron", "LogiCrate", "BugHunter3000", "SnackBarJS",
    "MonkeyPatchers", "DuckDeploy", "LazyLoader", "Hacktrix",
    "404Land", "ChocoByte", "NullPointer Café",
    "CodeTrackr", "BugSquash", "DevSync", "ByteVault",
    "TaskForge", "PixelPilot", "GitGuard", "ScriptSphere",
    "CloudNest", "LogiChain", "BitCanvas", "StackFlow",
    "PingPanel", "TestBench", "DataDock", "CodeCrate",
    "DevNest", "NodePulse", "PromptBase", "QueryZen",
    "BuildHive", "AppSmithy", "JsonJuggler", "DevMate",
    "CodeTide", "PushCraft", "SnipShelf", "LoopLab",
    "BranchBoost", "RefactorX"
  ])

  const token = localStorage.getItem('token');

  const criarProjeto = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/projetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nomeProjeto,
          descricao,
          imagem
        }),
      });

      const data = await response.json();

      setNomeProjeto('');
      setDescricao('');
      setImagem('');

      if (data.success) {
        navigate('/projetos');
      }
    }

    catch (error) {
      console.error("Erro ao criar projeto", error);
    }
  }

  return (
    <div className="application-main">
      <main>
        <div className="container-criar-projeto ">
          <h1 className="title">Criar um novo projeto</h1>
          <hr className="divider" />

          <form noValidate onSubmit={criarProjeto} className='form-criar-projeto'>
            <fieldset>
              <legend className="sr-only">Informações do projeto</legend>

              <div className="formulario-projeto">
                <label htmlFor="repo-name">Nome do projeto <span>(maximo de 20 caracteres)</span></label>
                <input
                  type="text"
                  placeholder="meu projeto"
                  id="repo-name"
                  name="repo-name"
                  value={nomeProjeto}
                  onChange={(e) => setNomeProjeto(e.target.value)}
                  maxLength={25}
                  required
                />
              </div>

              <div className="form-suggestion">
                <p>Bons nomes de projetos são curtos e memoraveis. Precisa de uma inspiração?</p>
                <button
                  type="button"
                  onClick={() => {
                    const nome = nomeAleatorio[Math.floor(Math.random() * nomeAleatorio.length)];
                    setNomeSugerido(nome);
                  }}
                >
                  Gerar nome
                </button>
                <div>
                  {nomeSugerido && <p>{nomeSugerido.toUpperCase()}</p>}
                </div>
              </div>
            </fieldset>

            <div className='formulario-projeto'>
              <label htmlFor="image">Imagem de capa</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(e) => setImagem(e.target.files[0])}
              />
            </div>

            <div className="formulario-projeto">
              <label htmlFor="description">descrição</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Uma breve descrição do seu projeto"
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary">Criar Projeto</button>
          </form>
        </div>
      </main>
    </div>
  );
}
