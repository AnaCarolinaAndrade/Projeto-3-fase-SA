function enviarMensagem({ remetenteId, destinatarioId, conteudo, tipo }) {
  const tiposAceitos = ['texto', 'link'];

  if (!tiposAceitos.includes(tipo)) {
    throw new Error('Tipo de mensagem não suportado');
  }
  if (!conteudo || conteudo.trim() === '') {
    throw new Error('Conteúdo da mensagem não pode ser vazio');
  }

  // Simula salvar a mensagem no banco
  return {
    id: 'msg123',
    remetenteId,
    destinatarioId,
    conteudo,
    tipo,
    status: 'enviado',
  };
}

module.exports = { enviarMensagem };