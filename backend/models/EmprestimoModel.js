const db = require('../config/database');

const stmts = {
  create: db.prepare(`
    INSERT INTO emprestimos (item_id, quantidade, usuario_nome, usuario_contato, motivo)
    VALUES (@item_id, @quantidade, @usuario_nome, @usuario_contato, @motivo)
  `),
  findById: db.prepare('SELECT * FROM emprestimos WHERE id = ?'),
  findAll: db.prepare(`
    SELECT e.*, i.nome AS item_nome, i.categoria, i.localizacao
    FROM emprestimos e
    JOIN itens i ON e.item_id = i.id
    ORDER BY e.data_retirada DESC
  `),
  findByStatus: db.prepare(`
    SELECT e.*, i.nome AS item_nome, i.categoria, i.localizacao
    FROM emprestimos e
    JOIN itens i ON e.item_id = i.id
    WHERE e.status = @status
    ORDER BY e.data_retirada DESC
  `),
  findByItemId: db.prepare(`
    SELECT e.*, i.nome AS item_nome FROM emprestimos e
    JOIN itens i ON e.item_id = i.id
    WHERE e.item_id = @item_id
    ORDER BY e.data_retirada DESC
  `),
  devolver: db.prepare(`
    UPDATE emprestimos
    SET status = 'devolvido', data_devolucao = datetime('now','localtime')
    WHERE id = ?
  `),
  countAtivos: db.prepare(`SELECT COUNT(*) as c FROM emprestimos WHERE status = 'ativo'`),
  countAtivosByItem: db.prepare(`SELECT COUNT(*) as c FROM emprestimos WHERE item_id = ? AND status = 'ativo'`),
};

const EmprestimoModel = {
  create(data) {
    const result = stmts.create.run(data);
    return stmts.findById.get(result.lastInsertRowid);
  },

  findById(id) {
    return stmts.findById.get(id);
  },

  findAll({ status, item_id } = {}) {
    if (item_id) return stmts.findByItemId.all({ item_id });
    if (status)  return stmts.findByStatus.all({ status });
    return stmts.findAll.all();
  },

  devolver(id) {
    return stmts.devolver.run(id);
  },

  countAtivos() {
    return stmts.countAtivos.get().c;
  },

  hasAtivosByItem(item_id) {
    return stmts.countAtivosByItem.get(item_id).c > 0;
  },
};

module.exports = EmprestimoModel;
