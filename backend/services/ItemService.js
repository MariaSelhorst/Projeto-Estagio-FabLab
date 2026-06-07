const ItemModel = require('../models/ItemModel');
const EmprestimoModel = require('../models/EmprestimoModel');

// ─── VALIDAÇÕES ───────────────────────────────────────────────────────────────

function validarItem({ nome, categoria, localizacao }) {
  const erros = [];
  if (!nome || nome.trim() === '')           erros.push('O campo "nome" é obrigatório.');
  if (!categoria || categoria.trim() === '') erros.push('O campo "categoria" é obrigatório.');
  if (!localizacao || localizacao.trim() === '') erros.push('O campo "localização" é obrigatório.');
  return erros;
}

// ─── SERVICE ──────────────────────────────────────────────────────────────────

const ItemService = {
  listar(filtros) {
    return ItemModel.findAll(filtros);
  },

  buscarPorId(id) {
    const item = ItemModel.findById(id);
    if (!item) throw { status: 404, mensagem: 'Item não encontrado.' };
    return item;
  },

  criar(dados) {
    const erros = validarItem(dados);
    if (erros.length > 0) throw { status: 400, mensagem: erros.join(' ') };

    const payload = {
      nome:              dados.nome.trim(),
      numero_serie:      (dados.numero_serie || '').trim(),
      categoria:         dados.categoria.trim(),
      localizacao:       dados.localizacao.trim(),
      quantidade:        parseInt(dados.quantidade) || 0,
      quantidade_minima: parseInt(dados.quantidade_minima) || 2,
      observacao:        (dados.observacao || '').trim(),
    };

    return ItemModel.create(payload);
  },

  atualizar(id, dados) {
    const item = ItemModel.findById(id);
    if (!item) throw { status: 404, mensagem: 'Item não encontrado.' };

    const payload = {
      nome:              dados.nome?.trim()              || null,
      numero_serie:      dados.numero_serie?.trim()      || null,
      categoria:         dados.categoria?.trim()         || null,
      localizacao:       dados.localizacao?.trim()       || null,
      quantidade:        dados.quantidade != null ? parseInt(dados.quantidade) : null,
      quantidade_minima: dados.quantidade_minima != null ? parseInt(dados.quantidade_minima) : null,
      observacao:        dados.observacao?.trim()        || null,
    };

    return ItemModel.update(id, payload);
  },

  deletar(id) {
    const item = ItemModel.findById(id);
    if (!item) throw { status: 404, mensagem: 'Item não encontrado.' };

    if (EmprestimoModel.hasAtivosByItem(id)) {
      throw { status: 400, mensagem: 'Não é possível excluir um item com empréstimo ativo.' };
    }

    ItemModel.delete(id);
    return { mensagem: `Item "${item.nome}" excluído com sucesso.` };
  },

  getCategorias() {
    return ItemModel.getCategorias();
  },

  getLocalizacoes() {
    return ItemModel.getLocalizacoes();
  },
};

module.exports = ItemService;
