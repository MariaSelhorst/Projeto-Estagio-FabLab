const db = require('../config/database');
const MovimentacaoModel = require('../models/MovimentacaoModel');
const EmprestimoModel = require('../models/EmprestimoModel');

const DashboardService = {
  getResumo() {
    const total_itens = db.prepare('SELECT COUNT(*) as c FROM itens').get().c;
    const estoque_baixo = db.prepare('SELECT COUNT(*) as c FROM itens WHERE quantidade <= quantidade_minima').get().c;
    const emprestimos_ativos = EmprestimoModel.countAtivos();
    const movimentacoes_hoje = MovimentacaoModel.countHoje();

    const por_categoria = db.prepare(`
      SELECT categoria, COUNT(*) as total_tipos, SUM(quantidade) as quantidade_total
      FROM itens
      GROUP BY categoria
      ORDER BY total_tipos DESC
    `).all();

    const alertas = db.prepare(`
      SELECT id, nome, categoria, localizacao, quantidade, quantidade_minima
      FROM itens
      WHERE quantidade <= quantidade_minima
      ORDER BY quantidade ASC
      LIMIT 10
    `).all();

    const ultimas_movimentacoes = MovimentacaoModel.ultimas(5);

    return {
      total_itens,
      estoque_baixo,
      emprestimos_ativos,
      movimentacoes_hoje,
      por_categoria,
      alertas,
      ultimas_movimentacoes,
    };
  },
};

module.exports = DashboardService;
