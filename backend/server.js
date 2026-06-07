const express = require('express');
const cors    = require('cors');
const path    = require('path');

const routes       = require('./routes/index');
const logger       = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Inicializa banco de dados (tabelas + seed)
require('./config/database');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── MIDDLEWARES GLOBAIS ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(logger);

// ── FRONTEND (arquivos estáticos) ─────────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

// ── API ───────────────────────────────────────────────────────────
app.use('/api', routes);

// ── FALLBACK → SPA ────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'index.html'));
});

// ── ERROR HANDLER (deve vir por último) ──────────────────────────
app.use(errorHandler);

// ── START ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n\x1b[36m╔══════════════════════════════════════╗');
  console.log('║      🔬 FabLab Inventory System      ║');
  console.log('╚══════════════════════════════════════╝\x1b[0m');
  console.log(`\x1b[32m✔\x1b[0m  API:      http://localhost:${PORT}/api`);
  console.log(`\x1b[32m✔\x1b[0m  Frontend: http://localhost:${PORT}`);
  console.log(`\x1b[32m✔\x1b[0m  Banco:    ./fablab.db\n`);
});
