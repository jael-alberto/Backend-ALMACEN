const express = require('express');
const router = express.Router();
const estanteController = require('../controllers/estanteController');

router.get('/', estanteController.getAll);
router.get('/:id', estanteController.getById);
router.post('/', estanteController.create);
router.put('/:id', estanteController.update);
router.delete('/:id', estanteController.delete);

module.exports = router;