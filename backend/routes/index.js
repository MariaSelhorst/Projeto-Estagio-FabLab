const { Router } = require('express');

const itemRoutes         = require('./itemRoutes');
const movimentacaoRoutes = require('./movimentacaoRoutes');
const emprestimoRoutes   = require('./emprestimoRoutes');
const DashboardController = require('../controllers/DashboardController');

const router = Router();

router.get('/dashboard',       DashboardController.index);
router.use('/itens',           itemRoutes);
router.use('/movimentacoes',   movimentacaoRoutes);
router.use('/emprestimos',     emprestimoRoutes);

module.exports = router;
