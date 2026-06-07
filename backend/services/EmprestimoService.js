const db = require('../config/database');
const ItemModel = require('../models/ItemModel');
const EmprestimoModel = require('../models/EmprestimoModel');

// ─── VALIDAÇÕES ───────────────────────────────────────────────────────────────

function validarEmprestimo({ item_id, quantidade, usuario_nome }) {
  const erros = [];
  if (!item_id)                        erros.push('O campo "item_id" é obrigatório.');
  if (!quantidade || quantidade <= 0)  erros.push('A quantidade deve ser um número positivo.');
  if (!usuario_nome || usuario_nome.trim() === '') erros.push('O campo "usuario_nome" é obrigatório.');
  return erros;
}

// ─── SERVICE ──────────────────────────────────────────────────────────────────

const EmprestimoService = {
  listar(filtros) {
    return EmprestimoModel.findAll(filtros);
  },

  /**
   * Registra uma retirada (empréstimo).
   * Diminui estoque e cria registro de empréstimo atomicamente.
   */
  registrar({ item_id, quantidade, usuario_nome, usuario_contato = '', motivo = '' }) {
    const erros = validarEmprestimo({ item_id, quantidade, usuario_nome });
    if (erros.length > 0) throw { status: 400, mensagem: erros.join(' ') };

    const item = ItemModel.findById(item_id);
    if (!item) throw { status: 404, mensagem: 'Item não encontrado.' };

    if (item.quantidade < quantidade) {
      throw {
        status: 400,
        mensagem: `Estoque insuficiente. Disponível: ${item.quantidade}, solicitado: ${quantidade}.`,
      };
    }

    let emprestimo;
    const executar = db.transaction(() => {
      emprestimo = EmprestimoModel.create({
        item_id,
        quantidade,
        usuario_nome: usuario_nome.trim(),
        usuario_contato: usuario_contato.trim(),
        motivo: motivo.trim(),
      });
      ItemModel.ajustarQuantidade(item_id, -quantidade);
    });
    executar();

    return {
      mensagem: `Empréstimo de ${quantidade}x "${item.nome}" registrado para ${usuario_nome}.`,
      emprestimo,
      item: ItemModel.findById(item_id),
    };
  },

  /**
   * Registra a devolução de um empréstimo.
   * Devolve a quantidade ao estoque atomicamente.
   */
  devolver(id) {
    const emprestimo = EmprestimoModel.findById(id);
    if (!emprestimo) throw { status: 404, mensagem: 'Empréstimo não encontrado.' };
    if (emprestimo.status === 'devolvido') {
      throw { status: 400, mensagem: 'Este empréstimo já foi devolvido.' };
    }

    const executar = db.transaction(() => {
      EmprestimoModel.devolver(id);
      ItemModel.ajustarQuantidade(emprestimo.item_id, emprestimo.quantidade);
    });
    executar();

    const item = ItemModel.findById(emprestimo.item_id);
    return {
      mensagem: `Devolução de ${emprestimo.quantidade}x "${item.nome}" registrada com sucesso.`,
      item,
    };
  },
};

module.exports = EmprestimoService;
