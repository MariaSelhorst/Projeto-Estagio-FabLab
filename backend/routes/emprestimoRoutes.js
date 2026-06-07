const { Router } = require('express');
const EmprestimoController = require('../controllers/EmprestimoController');

const router = Router();

router.get('/',                   EmprestimoController.index);    // GET  /api/emprestimos
router.post('/',                  EmprestimoController.store);    // POST /api/emprestimos
router.put('/:id/devolver',       EmprestimoController.devolver); // PUT  /api/emprestimos/:id/devolver

module.exports = router;
