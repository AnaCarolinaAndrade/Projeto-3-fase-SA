// src/services/searchService.js

const projetos = [
  { id: '1', titulo: 'App de Inteligência Artificial' },
  { id: '2', titulo: 'Plataforma de Blockchain' },
  { id: '3', titulo: 'Sistema de Gestão de Projetos' },
];

function buscarProjetos(termo) {
  if (!termo || termo.trim() === '') return [];

  termo = termo.toLowerCase();

  return projetos.filter((p) => p.titulo.toLowerCase().includes(termo));
}

module.exports = { buscarProjetos };
