const express = require('express');
const router = express.Router();
const ubicacionController = require('../controllers/ubicacionController');
const { validarUbicacion } = require('../middlewares/ubicacionValidar'); // Tu middleware de validación

// Rutas de escritura (Protegidas por el validador)
router.post('/', validarUbicacion, ubicacionController.create);
router.put('/:id', validarUbicacion, ubicacionController.update);

// Rutas de lectura y eliminación
router.get('/', ubicacionController.getAll);
router.get('/:id', ubicacionController.getById);
router.delete('/:id', ubicacionController.delete);

module.exports = router;