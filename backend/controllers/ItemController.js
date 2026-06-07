const ItemService = require('../services/ItemService');

const ItemController = {
  index(req, res) {
    try {
      const itens = ItemService.listar(req.query);
      res.json(itens);
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' });
    }
  },

  show(req, res) {
    try {
      const item = ItemService.buscarPorId(Number(req.params.id));
      res.json(item);
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' });
    }
  },

  store(req, res) {
    try {
      const item = ItemService.criar(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' });
    }
  },

  update(req, res) {
    try {
      const item = ItemService.atualizar(Number(req.params.id), req.body);
      res.json(item);
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' });
    }
  },

  destroy(req, res) {
    try {
      const resultado = ItemService.deletar(Number(req.params.id));
      res.json(resultado);
    } catch (err) {
      res.status(err.status || 500).json({ erro: err.mensagem || 'Erro interno.' });
    }
  },

  categorias(req, res) {
    res.json(ItemService.getCategorias());
  },

  localizacoes(req, res) {
    res.json(ItemService.getLocalizacoes());
  },
};

module.exports = ItemController;
