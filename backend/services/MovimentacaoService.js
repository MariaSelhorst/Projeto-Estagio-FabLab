const db = require('../config/database');
const ItemModel = require('../models/ItemModel');
const MovimentacaoModel = require('../models/MovimentacaoModel');

// ─── VALIDAÇÕES ───────────────────────────────────────────────────────────────

function validarMovimentacao({ item_id, tipo, quantidade }) {
  const erros = [];
  if (!item_id)                          erros.push('O campo "item_id" é obrigatório.');
  if (!tipo)                             erros.push('O campo "tipo" é obrigatório.');
  if (!['entrada','saida'].includes(tipo)) erros.push('O tipo deve ser "entrada" ou "saida".');
  if (!quantidade || quantidade <= 0)    erros.push('A quantidade deve ser um número positivo.');
  return erros;
}

// ─── SERVICE ──────────────────────────────────────────────────────────────────

const MovimentacaoService = {
  listar(filtros) {
    return MovimentacaoModel.findAll(filtros);
  },

  /**
   * Registra uma entrada ou saída.
   * Usa transaction do SQLite para garantir atomicidade:
   * ou registra a movimentação E atualiza o estoque, ou nenhum dos dois.
   */
  registrar({ item_id, tipo, quantidade, motivo = '', usuario = 'Sistema' }) {
    const erros = validarMovimentacao({ item_id, tipo, quantidade });
    if (erros.length > 0) throw { status: 400, mensagem: erros.join(' ') };

    const item = ItemModel.findById(item_id);
    if (!item) throw { status: 404, mensagem: 'Item não encontrado.' };

    if (tipo === 'saida' && item.quantidade < quantidade) {
      throw {
        status: 400,
        mensagem: `Estoque insuficiente. Disponível: ${item.quantidade}, solicitado: ${quantidade}.`,
      };
    }

    const delta = tipo === 'entrada' ? quantidade : -quantidade;

    // TRANSACTION — atomicidade garantida
    const executar = db.transaction(() => {
      MovimentacaoModel.create({ item_id, tipo, quantidade, motivo, usuario });
      ItemModel.ajustarQuantidade(item_id, delta);
    });
    executar();

    const itemAtualizado = ItemModel.findById(item_id);
    return {
      mensagem: `${tipo === 'entrada' ? 'Entrada' : 'Saída'} de ${quantidade}x "${item.nome}" registrada com sucesso.`,
      item: itemAtualizado,
    };
  },
};

module.exports = MovimentacaoService;
