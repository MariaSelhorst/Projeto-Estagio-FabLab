/**
 * Middleware de tratamento global de erros.
 * Captura qualquer erro não tratado nos controllers e devolve JSON padronizado.
 * Deve ser o último middleware registrado no app.
 */
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const mensagem = err.mensagem || err.message || 'Erro interno do servidor.';

  console.error(`[${new Date().toLocaleString('pt-BR')}] ${req.method} ${req.path} → ${status}: ${mensagem}`);

  res.status(status).json({ erro: mensagem });
}

module.exports = errorHandler;
