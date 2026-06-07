/**
 * Middleware de log simples.
 * Exibe método, rota e tempo de resposta no terminal.
 */
function logger(req, res, next) {
  const inicio = Date.now();
  res.on('finish', () => {
    const duracao = Date.now() - inicio;
    const cor = res.statusCode < 400 ? '\x1b[32m' : '\x1b[31m'; // verde ou vermelho
    console.log(
      `${cor}[${res.statusCode}]\x1b[0m ${req.method.padEnd(7)} ${req.originalUrl.padEnd(40)} ${duracao}ms`
    );
  });
  next();
}

module.exports = logger;
