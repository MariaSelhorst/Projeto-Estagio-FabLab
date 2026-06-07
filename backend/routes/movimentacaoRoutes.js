const { Router } = require('express');
const MovimentacaoController = require('../controllers/MovimentacaoController');

const router = Router();

router.get('/',    MovimentacaoController.index);  // GET  /api/movimentacoes
router.post('/',   MovimentacaoController.store);  // POST /api/movimentacoes

module.exports = router;
