const validarEstante = (req, res, next) => {
    const { codigo, ubicacion, descripcion } = req.body;
    const errores = [];

    // 1. Validar Código (Obligatorio y único)
    if (!codigo || codigo.trim() === "") {
        errores.push("El código del estante es obligatorio.");
    } else if (codigo.length > 50) {
        errores.push("El código del estante no puede exceder los 50 caracteres.");
    }

    // 2. Validar Ubicación (Opcional)
    if (ubicacion && ubicacion.length > 100) {
        errores.push("La ubicación es demasiado larga (máximo 100 caracteres).");
    }

    // 3. Validar Descripción (Opcional)
    // Aunque es tipo Text en Prisma, limitamos para evitar payloads gigantes
    if (descripcion && descripcion.length > 500) {
        errores.push("La descripción no puede exceder los 500 caracteres.");
    }

    // --- RESPUESTA ---
    if (errores.length > 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "Datos de estante inválidos",
            detalles: errores
        });
    }

    next();
};

module.exports = { validarEstante };