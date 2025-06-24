import { buscarProjetos }  from './userAbaPesquisaService.js';

describe('Pesquisa de Projetos', () => {
  it('deve retornar projetos que contenham a palavra-chave', () => {
    const resultados = buscarProjetos('inteligência artificial');
    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados[0].titulo.toLowerCase()).toContain('inteligência artificial');
  });

  it('deve retornar lista vazia para termo vazio', () => {
    const resultados = buscarProjetos('');
    expect(resultados).toEqual([]);
  });

  it('deve retornar lista vazia para termo que não existe', () => {
    const resultados = buscarProjetos('termo inexistente');
    expect(resultados).toEqual([]);
  });

  it('deve fazer busca case-insensitive', () => {
    const resultados = buscarProjetos('BLOCKCHAIN');
    expect(resultados.length).toBe(1);
    expect(resultados[0].titulo.toLowerCase()).toContain('blockchain');
  });
});