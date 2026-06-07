const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'fablab.db');

const db = new Database(DB_PATH);

db.exec(`PRAGMA journal_mode=WAL;`);

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS itens (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      nome              TEXT    NOT NULL,
      numero_serie      TEXT    DEFAULT '',
      categoria         TEXT    NOT NULL,
      localizacao       TEXT    NOT NULL,
      quantidade        INTEGER NOT NULL DEFAULT 0,
      quantidade_minima INTEGER NOT NULL DEFAULT 2,
      observacao        TEXT    DEFAULT '',
      criado_em         TEXT    DEFAULT (datetime('now','localtime')),
      atualizado_em     TEXT    DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS movimentacoes (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id   INTEGER NOT NULL,
      tipo      TEXT    NOT NULL CHECK(tipo IN ('entrada','saida')),
      quantidade INTEGER NOT NULL,
      motivo    TEXT    DEFAULT '',
      usuario   TEXT    DEFAULT 'Sistema',
      data_hora TEXT    DEFAULT (datetime('now','localtime')),
      FOREIGN KEY(item_id) REFERENCES itens(id)
    );

    CREATE TABLE IF NOT EXISTS emprestimos (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id          INTEGER NOT NULL,
      quantidade       INTEGER NOT NULL,
      usuario_nome     TEXT    NOT NULL,
      usuario_contato  TEXT    DEFAULT '',
      motivo           TEXT    DEFAULT '',
      status           TEXT    NOT NULL DEFAULT 'ativo' CHECK(status IN ('ativo','devolvido')),
      data_retirada    TEXT    DEFAULT (datetime('now','localtime')),
      data_devolucao   TEXT,
      FOREIGN KEY(item_id) REFERENCES itens(id)
    );
  `);
}

function seedDatabase() {
  const count = db.prepare('SELECT COUNT(*) as c FROM itens').get();
  if (count.c > 0) return;

  const seedPath = path.join(__dirname, '..', 'seed_data.json');
  if (!fs.existsSync(seedPath)) return;

  const items = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  const insert = db.prepare(`
    INSERT INTO itens (nome, numero_serie, categoria, localizacao, quantidade, quantidade_minima, observacao)
    VALUES (@nome, @numero_serie, @categoria, @localizacao, @quantidade, @quantidade_minima, @observacao)
  `);
  const insertMany = db.transaction((rows) => { for (const row of rows) insert.run(row); });
  insertMany(items);
  console.log(`✅ Seed: ${items.length} itens importados do inventário FabLab`);
}

initTables();
seedDatabase();

module.exports = db;
