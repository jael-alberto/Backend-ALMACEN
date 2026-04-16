const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { validarProveedor } = require('../middlewares/proveedorValidar');

// Crear proveedor
router.post('/', validarProveedor, proveedorController.create);
router.put('/:id', validarProveedor, proveedorController.update);

// Definir los puntos de entrada (Endpoints)
router.get('/', proveedorController.getAll);        // Listar y buscar
router.get('/:id', proveedorController.getById);    // Ver uno solo
router.delete('/:id', proveedorController.delete);  // Eliminar

module.exports = router;