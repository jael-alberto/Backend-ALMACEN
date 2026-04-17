const express = require('express');
const router = express.Router();
const estanteController = require('../controllers/estanteController');
const { validarEstante } = require('../middlewares/estanteValidar');

// Rutas con validación
router.post('/', validarEstante, estanteController.create);
router.put('/:id', validarEstante, estanteController.update);
router.get('/', estanteController.getAll);
router.get('/:id', estanteController.getById);
router.delete('/:id', estanteController.delete);

module.exports = router;