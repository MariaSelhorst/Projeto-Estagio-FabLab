const db = require('../config/database');

const stmts = {
  create: db.prepare(`
    INSERT INTO movimentacoes (item_id, tipo, quantidade, motivo, usuario)
    VALUES (@item_id, @tipo, @quantidade, @motivo, @usuario)
  `),
  findAll: db.prepare(`
    SELECT m.*, i.nome AS item_nome, i.categoria
    FROM movimentacoes m
    JOIN itens i ON m.item_id = i.id
    ORDER BY m.data_hora DESC
    LIMIT @limit
  `),
  findByItemId: db.prepare(`
    SELECT m.*, i.nome AS item_nome, i.categoria
    FROM movimentacoes m
    JOIN itens i ON m.item_id = i.id
    WHERE m.item_id = @item_id
    ORDER BY m.data_hora DESC
  `),
  findByTipo: db.prepare(`
    SELECT m.*, i.nome AS item_nome, i.categoria
    FROM movimentacoes m
    JOIN itens i ON m.item_id = i.id
    WHERE m.tipo = @tipo
    ORDER BY m.data_hora DESC
    LIMIT @limit
  `),
  findByItemAndTipo: db.prepare(`
    SELECT m.*, i.nome AS item_nome, i.categoria
    FROM movimentacoes m
    JOIN itens i ON m.item_id = i.id
    WHERE m.item_id = @item_id AND m.tipo = @tipo
    ORDER BY m.data_hora DESC
  `),
  countHoje: db.prepare(`
    SELECT COUNT(*) as c FROM movimentacoes
    WHERE date(data_hora) = date('now','localtime')
  `),
  ultimas: db.prepare(`
    SELECT m.*, i.nome AS item_nome FROM movimentacoes m
    JOIN itens i ON m.item_id = i.id
    ORDER BY m.data_hora DESC LIMIT @limit
  `),
};

const MovimentacaoModel = {
  create(data) {
    const result = stmts.create.run(data);
    return result.lastInsertRowid;
  },

  findAll({ item_id, tipo, limit = 100 } = {}) {
    const l = parseInt(limit);
    if (item_id && tipo)  return stmts.findByItemAndTipo.all({ item_id, tipo });
    if (item_id)          return stmts.findByItemId.all({ item_id });
    if (tipo)             return stmts.findByTipo.all({ tipo, limit: l });
    return stmts.findAll.all({ limit: l });
  },

  countHoje() {
    return stmts.countHoje.get().c;
  },

  ultimas(limit = 5) {
    return stmts.ultimas.all({ limit });
  },
};

module.exports = MovimentacaoModel;
