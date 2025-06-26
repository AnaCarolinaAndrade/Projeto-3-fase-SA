export function cadastrarUsuario({ nome, email, senha }) {
    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }
  
    return {
      id: '123',
      nome,
      email
    };
  }
  