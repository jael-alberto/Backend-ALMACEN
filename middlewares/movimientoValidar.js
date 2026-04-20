const { esUUID } = require('../utils/validadores');

const validarMovimiento = (req, res, next) => {
    const { inventario_id, tipo, cantidad, usuario_id } = req.body;
    const errores = [];

    // Validaciones mínimas de estructura para evitar que la DB explote
    if (!inventario_id || !esUUID(inventario_id)) errores.push("Falta inventario_id.");
    if (!usuario_id || !esUUID(usuario_id)) errores.push("Falta usuario_id.");
    if (!cantidad || cantidad <= 0) errores.push("Cantidad inválida.");

    const tiposPermitidos = ['ENTRADA', 'SALIDA', 'TRASLADO', 'PRESTAMO'];
    if (!tipo || !tiposPermitidos.includes(tipo.toUpperCase())) {
        errores.push("Tipo de movimiento no reconocido.");
    }

    if (errores.length > 0) {
        return res.status(500).json({ // Usamos 500 porque sería un error de nuestra lógica interna
            status: "error",
            mensaje: "Error de sistema al registrar movimiento",
            detalles: errores
        });
    }

    next();
};

module.exports = { validarMovimiento };