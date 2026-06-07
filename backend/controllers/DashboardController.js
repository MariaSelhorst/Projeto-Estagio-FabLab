const DashboardService = require('../services/DashboardService');

const DashboardController = {
  index(req, res) {
    try {
      const resumo = DashboardService.getResumo();
      res.json(resumo);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao carregar dashboard.' });
    }
  },
};

module.exports = DashboardController;
