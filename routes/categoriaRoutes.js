const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { validarCategoria } = require('../middlewares/categoriaValidar');

// Crear categoría
router.post('/', validarCategoria, categoriaController.create);

// Actualizar categoría
router.put('/:id', validarCategoria, categoriaController.update);

router.get('/', categoriaController.getAll);
router.get('/:id', categoriaController.getById);
router.delete('/:id', categoriaController.delete);

module.exports = router;
