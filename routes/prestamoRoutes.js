const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');

router.get('/', prestamoController.getAll);
router.get('/:id', prestamoController.getById);
router.post('/', prestamoController.create);
router.put('/:id', prestamoController.update);
router.delete('/:id', prestamoController.delete);

module.exports = router;