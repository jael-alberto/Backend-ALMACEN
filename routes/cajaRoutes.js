const express = require('express');
const router = express.Router();
const cajaController = require('../controllers/cajaController');
const { validarCaja } = require('../middlewares/cajaValidar');

// Rutas
router.post('/', validarCaja, cajaController.create);
router.put('/:id', validarCaja, cajaController.update);
router.get('/', cajaController.getAll);
router.get('/:id', cajaController.getById);
router.delete('/:id', cajaController.delete);

module.exports = router;