const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');
const { validarPersona } = require('../middlewares/personaValidar'); // Importamos el middleware

// Rutas protegidas por el validador
router.post('/', validarPersona, personaController.create);
router.put('/:id', validarPersona, personaController.update);


router.get('/', personaController.getAll);
router.get('/:id', personaController.getById);
router.delete('/:id', personaController.delete);

module.exports = router;