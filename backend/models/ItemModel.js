const db = require('../config/database');

// ─── PREPARED STATEMENTS ──────────────────────────────────────────────────────
// Preparar uma vez, reutilizar muitas vezes (melhor performance)

const stmts = {
  findAll: (where, params) => db.prepare(`SELECT * FROM itens ${where} ORDER BY nome ASC`).all(...params),
  findById: db.prepare('SELECT * FROM itens WHERE id = ?'),
  create: db.prepare(`
    INSERT INTO itens (nome, numero_serie, categoria, localizacao, quantidade, quantidade_minima, observacao)
    VALUES (@nome, @numero_serie, @categoria, @localizacao, @quantidade, @quantidade_minima, @observacao)
  `),
  update: db.prepare(`
    UPDATE itens SET
      nome              = COALESCE(@nome, nome),
      numero_serie      = COALESCE(@numero_serie, numero_serie),
      categoria         = COALESCE(@categoria, categoria),
      localizacao       = COALESCE(@localizacao, localizacao),
      quantidade        = COALESCE(@quantidade, quantidade),
      quantidade_minima = COALESCE(@quantidade_minima, quantidade_minima),
      observacao        = COALESCE(@observacao, observacao),
      atualizado_em     = datetime('now','localtime')
    WHERE id = @id
  `),
  delete: db.prepare('DELETE FROM itens WHERE id = ?'),
  updateQuantidade: db.prepare(`
    UPDATE itens SET
      quantidade    = quantidade + @delta,
      atualizado_em = datetime('now','localtime')
    WHERE id = @id
  `),
  categorias: db.prepare('SELECT DISTINCT categoria FROM itens ORDER BY categoria'),
  localizacoes: db.prepare('SELECT DISTINCT localizacao FROM itens ORDER BY localizacao'),
};

// ─── MODEL ────────────────────────────────────────────────────────────────────

const ItemModel = {
  findAll({ busca, categoria, localizacao, estoque_baixo } = {}) {
    const conditions = ['1=1'];
    const params = [];

    if (busca) {
      conditions.push('(nome LIKE ? OR numero_serie LIKE ? OR observacao LIKE ?)');
      const q = `%${busca}%`;
      params.push(q, q, q);
    }
    if (categoria)    { conditions.push('categoria = ?');   params.push(categoria); }
    if (localizacao)  { conditions.push('localizacao = ?'); params.push(localizacao); }
    if (estoque_baixo === 'true') conditions.push('quantidade <= quantidade_minima');

    const where = 'WHERE ' + conditions.join(' AND ');
    return stmts.findAll(where, params);
  },

  findById(id) {
    return stmts.findById.get(id);
  },

  create(data) {
    const result = stmts.create.run(data);
    return stmts.findById.get(result.lastInsertRowid);
  },

  update(id, data) {
    stmts.update.run({ ...data, id });
    return stmts.findById.get(id);
  },

  delete(id) {
    return stmts.delete.run(id);
  },

  // Usado internamente pelos services de movimentação/empréstimo
  ajustarQuantidade(id, delta) {
    stmts.updateQuantidade.run({ delta, id });
    return stmts.findById.get(id);
  },

  getCategorias() {
    return stmts.categorias.all().map(r => r.categoria);
  },

  getLocalizacoes() {
    return stmts.localizacoes.all().map(r => r.localizacao);
  },
};

module.exports = ItemModel;
