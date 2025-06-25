const { cadastrarUsuario } = require('./useService');

describe('Cadastro de Usuário', () => {
  it('deve cadastrar com sucesso um usuário válido', () => {
    const user = cadastrarUsuario({
      nome: 'Ana',
      email: 'ana@dexes.com',
      senha: '123456'
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('ana@dexes.com');
  });

  it('deve lançar erro para email inválido', () => {
    expect(() => {
      cadastrarUsuario({ nome: 'Ana', email: 'anaemail.com', senha: '123' });
    }).toThrow('Email inválido');
  });
});
