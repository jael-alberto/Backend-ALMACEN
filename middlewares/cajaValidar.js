const { esUUID } = require('../utils/validadores');

const validarCaja = (req, res, next) => {
    const { codigo, estante_id, descripcion } = req.body;
    const errores = [];

    // 1. Validar Código (Obligatorio y único)
    if (!codigo || codigo.trim() === "") {
        errores.push("El código de la caja es obligatorio.");
    } else if (codigo.length > 50) {
        errores.push("El código de la caja no puede exceder los 50 caracteres.");
    }

    // 2. Validar Relación con Estante (Opcional, pero debe ser UUID si viene)
    if (estante_id && !esUUID(estante_id)) {
        errores.push("El estante_id debe ser un UUID válido.");
    }

    // 3. Validar Descripción (Opcional)
    if (descripcion && descripcion.length > 500) {
        errores.push("La descripción es demasiado larga (máximo 500 caracteres).");
    }

    // --- RESPUESTA ---
    if (errores.length > 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "Datos de caja inválidos",
            detalles: errores
        });
    }

    next();
};

module.exports = { validarCaja };