import { useState } from 'react';
import './Questionario.css';

export default function Questionario() {
  const [respostas, setRespostas] = useState({
    area: '',
    experiencia: '',
    tipo: '',
  });

  const [recomendacoes, setRecomendacoes] = useState([]);

  const projetos = [
    { id: 1, nome: "Site de Portfólio", area: "Web", experiencia: "iniciante", tipo: "Individual" },
    { id: 2, nome: "App de Tarefas", area: "Mobile", experiencia: "intermediário", tipo: "Grupo" },
    { id: 3, nome: "Jogo com Phaser", area: "Game Dev", experiencia: "iniciante", tipo: "Individual" },
    { id: 4, nome: "IA Chatbot", area: "IA", experiencia: "avançado", tipo: "Grupo" },
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setRespostas(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const filtrados = projetos.filter(p =>
      p.area === respostas.area &&
      p.experiencia === respostas.experiencia &&
      p.tipo === respostas.tipo
    );
    setRecomendacoes(filtrados);
  }

  useEffect(() => {
    fetch('http://localhost:5173/api/criar_questionario')
      .then(res => res.json())
      .then(data => {
        setProjetos(data);
      })
      .catch(err => {
        console.error("Erro ao buscar projetos:", err);
      });
  }, []);

  return (
    <div className="questionario-container">
      <h2>Encontre projetos ideais pra você</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Área de Interesse:
          <select name="area" value={respostas.area} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Web">Web</option>
            <option value="Mobile">Mobile</option>
            <option value="Game Dev">Game Dev</option>
            <option value="IA">IA</option>
          </select>
        </label>

        <label>
          Nível de Experiência:
          <select name="experiencia" value={respostas.experiencia} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="iniciante">Iniciante</option>
            <option value="intermediário">Intermediário</option>
            <option value="avançado">Avançado</option>
          </select>
        </label>

        <label>
          Tipo de Projeto:
          <select name="tipo" value={respostas.tipo} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="Individual">Individual</option>
            <option value="Grupo">Grupo</option>
          </select>
        </label>

        <button type="submit">Ver Recomendados</button>
      </form>

      {recomendacoes.length > 0 && (
        <div className="resultados">
          <h3>Projetos recomendados:</h3>
          {recomendacoes.map(p => (
            <div key={p.id} className="projeto">
              <strong>{p.nome}</strong> — {p.area}, {p.tipo}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}