const EmprestimoService = require('../services/EmprestimoService');

const EmprestimoController = {
  index(req, res) {
    try {
      const emprestimos = EmprestimoService.listar(req.query);
      res.json(emprestimos);
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' });
    }
  },

  store(req, res) {
    try {
      const { item_id, quantidade, usuario_nome, usuario_contato, motivo } = req.body;
      const resultado = EmprestimoService.registrar({
        item_id: Number(item_id),
        quantidade: Number(quantidade),
        usuario_nome,
        usuario_contato,
        motivo,
      });
      res.status(201).json(resultado);
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' });
    }
  },

  devolver(req, res) {
    try {
      const resultado = EmprestimoService.devolver(Number(req.params.id));
      res.json(resultado);
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' });
    }
  },
};

module.exports = EmprestimoController;
