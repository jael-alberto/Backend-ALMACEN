const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { validarRole } = require('../middlewares/roleValidar');

// Aplicar el middleware aquí
router.post('/', validarRole, roleController.create);
router.put('/:id', validarRole, roleController.update);

router.get('/', roleController.getAll);
router.get('/:id', roleController.getById);
router.delete('/:id', roleController.delete);

module.exports = router;