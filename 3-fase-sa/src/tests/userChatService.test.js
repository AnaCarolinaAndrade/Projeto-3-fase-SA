const { enviarMensagem } = require('./userChatService.js');

describe('Chat - Envio de mensagens', () => {
  it('deve enviar uma mensagem de texto com sucesso', () => {
    const msg = enviarMensagem({
      remetenteId: 'user1',
      destinatarioId: 'user2',
      conteudo: 'Olá, tudo bem?',
      tipo: 'texto',
    });

    expect(msg.status).toBe('enviado');
    expect(msg.tipo).toBe('texto');
  });

  it('deve enviar uma mensagem do tipo texto', () => {
    const msg = enviarMensagem({
      remetenteId: 'user1',
      destinatarioId: 'user2',
      conteudo: 'texto',
      tipo: 'texto',
    });

    expect(msg.tipo).toBe('texto');
  });

  it('deve rejeitar mensagens com tipo inválido', () => {
    expect(() => {
      enviarMensagem({
        remetenteId: 'user1',
        destinatarioId: 'user2',
        conteudo: 'conteúdo',
        tipo: 'arquivo',
      });
    }).toThrow('Tipo de mensagem não suportado');
  });

  it('deve rejeitar mensagens com conteúdo vazio', () => {
    expect(() => {
      enviarMensagem({
        remetenteId: 'user1',
        destinatarioId: 'user2',
        conteudo: '   ',
        tipo: 'texto',
      });
    }).toThrow('Conteúdo da mensagem não pode ser vazio');
  });
});