const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { validarUsuario } = require('../middlewares/usuarioValidar');

// --- RUTAS DE ESCRITURA (Llevan el middleware) ---
router.post('/', validarUsuario, usuarioController.create);
router.put('/:id', validarUsuario, usuarioController.update);

router.get('/', usuarioController.getAll);
router.get('/:id', usuarioController.getById);
router.delete('/:id', usuarioController.delete);

module.exports = router;