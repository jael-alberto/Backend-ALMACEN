const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movimientoController');
const { validarMovimiento } = require('../middlewares/movimientoValidar');

router.get('/', movimientoController.getAll);
router.get('/:id', movimientoController.getById);
router.post('/', validarMovimiento, movimientoController.create);
router.put('/:id', validarMovimiento, movimientoController.update);
router.delete('/:id', movimientoController.delete);

module.exports = router;