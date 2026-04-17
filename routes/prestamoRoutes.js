const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');
const { validarPrestamo } = require('../middlewares/prestamoValidar');

router.post('/', validarPrestamo, prestamoController.create);
router.put('/:id', validarPrestamo, prestamoController.update);

router.get('/', prestamoController.getAll);
router.get('/:id', prestamoController.getById);
router.delete('/:id', prestamoController.delete);

module.exports = router;