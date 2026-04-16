const express = require('express');
const router = express.Router();
const permisoController = require('../controllers/permisoController');
const { validarPermiso } = require('../middlewares/permisoValidar');

// Aplicar validación en creación y actualización
router.post('/', validarPermiso, permisoController.create);
router.put('/:id', validarPermiso, permisoController.update);

router.get('/', permisoController.getAll);
router.get('/:id', permisoController.getById);
router.delete('/:id', permisoController.delete);

module.exports = router;