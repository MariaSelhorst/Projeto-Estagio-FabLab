const MovimentacaoService = require('../services/MovimentacaoService');

const MovimentacaoController = {
  index(req, res) {
    try {
      const movimentacoes = MovimentacaoService.listar(req.query);
      res.json(movimentacoes);
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' });
    }
  },

  store(req, res) {
    try {
      const { item_id, tipo, quantidade, motivo, usuario } = req.body;
      const resultado = MovimentacaoService.registrar({
        item_id: Number(item_id),
        tipo,
        quantidade: Number(quantidade),
        motivo,
        usuario,
      });
      res.status(201).json(resultado);
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' });
    }
  },
};

module.exports = MovimentacaoController;
