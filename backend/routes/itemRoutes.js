const { Router } = require('express');
const ItemController = require('../controllers/ItemController');

const router = Router();

// Auxiliares (antes do /:id para não conflitar)
router.get('/categorias',  ItemController.categorias);
router.get('/localizacoes', ItemController.localizacoes);

// CRUD principal
router.get('/',     ItemController.index);    // GET    /api/itens
router.get('/:id',  ItemController.show);     // GET    /api/itens/:id
router.post('/',    ItemController.store);    // POST   /api/itens
router.put('/:id',  ItemController.update);   // PUT    /api/itens/:id
router.delete('/:id', ItemController.destroy);// DELETE /api/itens/:id

module.exports = router;
