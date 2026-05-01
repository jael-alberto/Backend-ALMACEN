const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');
const { validarPrestamo, validarDevolucion } = require('../middlewares/prestamoValidar');

router.get('/', prestamoController.getAll);

router.get('/pendientes', prestamoController.getPendientes);

router.get('/:id', prestamoController.getById);

router.post('/', validarPrestamo, prestamoController.create);

router.patch('/:id/devolucion', validarDevolucion, prestamoController.registrarDevolucion);

router.put('/:id', validarPrestamo, prestamoController.update);

router.delete('/:id', prestamoController.delete);

module.exports = router;