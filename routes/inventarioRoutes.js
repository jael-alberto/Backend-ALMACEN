const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const { validarInventario } = require('../middlewares/inventarioValidar');

router.post('/', validarInventario, inventarioController.create);
router.put('/:id', validarInventario, inventarioController.update);

router.get('/', inventarioController.getAll);
router.get('/:id', inventarioController.getById);
router.delete('/:id', inventarioController.delete);

module.exports = router;