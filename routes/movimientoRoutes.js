const express = require('express');
const router = express.Router();
const movimientoController = require('../controllers/movimientoController');

router.get('/', movimientoController.getAll);
router.get('/:id', movimientoController.getById);
router.post('/', movimientoController.create);
router.put('/:id', movimientoController.update);
router.delete('/:id', movimientoController.delete);

module.exports = router;