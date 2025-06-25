import { useState } from 'react';
import './CriarProjeto.css';
import { useNavigate } from 'react-router-dom';


export default function CriarProjeto() {

  const navigate = useNavigate();

  const [nomeProjeto, setNomeProjeto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');
  const [imagemPreviewUrl, setImagemPreviewUrl] = useState(null);
  const [nomeSugerido, setNomeSugerido] = useState('');



  const [nomeAleatorio] = useState([
    "byte-verse", "neural-forge", "cloud-spark", "pixel-core", "data-pulse",
    "code-lattice", "quantum-frame", "task-ship", "api-matrix", "stack-glow",
    "CodeSync", "SecureNest", "ToastyStack", "DataForge", "APIverse",
    "StackBoard", "BitFlow", "DevOpsy", "AuthPilot", "PixelAdmin",
    "NetScope", "ZenBlocks", "NeuroCanvas", "EchoForm", "QuantumQuery",
    "OrbitPlay", "CodeDrip", "SynthByte", "NanoDash", "Refactron",
    "LogiCrate", "BugHunter3000", "SnackBarJS", "MonkeyPatchers", "DuckDeploy",
    "LazyLoader", "Hacktrix", "404Land", "ChocoByte", "NullPointer Café",
    "CodeTrackr", "BugSquash", "DevSync", "ByteVault", "TaskForge",
    "PixelPilot", "GitGuard", "ScriptSphere", "CloudNest", "LogiChain",
    "BitCanvas", "StackFlow", "PingPanel", "TestBench", "DataDock",
    "CodeCrate", "DevNest", "NodePulse", "PromptBase", "QueryZen",
    "BuildHive", "AppSmithy", "JsonJuggler", "DevMate", "CodeTide",
    "PushCraft", "SnipShelf", "LoopLab", "BranchBoost", "RefactorX",
    "TechBridge", "CodeWave", "SmartHive", "DataPulse", "NeuroLink",
    "PixelForge", "AutoBotX", "SecureNet", "CloudCraft", "VisionAI",
    "WebNova", "GreenTech", "CryptoCore", "AI Assistant", "NanoSecure",
    "VoicePilot", "BioCode", "CyberNest", "CodeSphere", "DigitalTwins",
    "SmartCityMap", "IoT Watchdog", "RoboHelper", "SmartFit", "VirtualDesk",
    "TaskMaster AI", "DeepTrack", "ByteScan", "MindMesh", "SmartScanner",
    "NetGuardian", "EduCode", "GameForge", "MetaLink", "BlockAuth",
    "DriveSync", "QuantumLeap", "BotBuddy", "AI Recruiter", "AgroTechSys",
    "WeatherNet", "DroneControl", "AutoDoc", "CodeTutor", "MedAI",
    "EcoMonitor", "HomeAI", "SmartInventory", "AI Recipes", "NeuralChat",
    "CryptoTrade", "EventFlow", "HoloMeet", "AutoTrader", "CodeWarden",
    "StreamAI", "SmartBudget", "CyberEye", "HackShield", "RoboChef",
    "AI Lawyer", "SmartGarden", "DeepVision", "LangBot", "AR Painter",
    "BugTracker", "AppSyncer", "HealthMap", "FitTrack", "AI DJ",
    "DevConnect", "TaskAI", "SimuVerse", "CloudLock", "TimeWizard",
    "CodeClinic", "NFT Vault", "LiveCode", "TrackFusion", "SmartPark",
    "CryptoWallet", "IoTLogger", "GamerTrack", "MindFocus", "Speechify",
    "AutoDeploy", "LinkAnalyzer", "ZeroBug", "SecureBox", "JobMatchAI",
    "MotionAI", "EcoHome", "SmartGridAI", "E-LearnBoost", "SmartAlerts",
    "AICoder", "MobileMate", "StreamSync", "DataGuardian", "PayChain",
    "BioAccess", "AIPlanner", "SmartDocs"
  ])

  const criarProjeto = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("nomeProjeto", nomeProjeto);
    formData.append("descricao", descricao);
    formData.append("imagem", imagem);

    try {
      const response = await fetch('http://localhost:5000/api/projetos', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagem(null);
      setImagemPreviewUrl(null);
    }
  };

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
              <div>
                <label htmlFor="ipt-image" className="upload-label">
                  Imagem de capa
                </label>
              </div>
              <div className='container-image'>
                <input
                  type="file"
                  id="ipt-image"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden-input"
                  accept="image/*"
                />

                {imagemPreviewUrl ? (
                  <div className="image-preview-wrapper">
                    <img
                      src={imagemPreviewUrl}
                      alt="Pré-visualização da Imagem"
                      className='image-preview-full'
                    />
                  </div>
                )
                  : (
                    <div className="image-preview-wrapper">
                      Coloque uma imagem
                    </div>
                  )}
              </div>
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
