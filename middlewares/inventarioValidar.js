const { esUUID } = require('../utils/validadores'); // Asegúrate de tener esta utilidad

const validarInventario = (req, res, next) => {
    const {
        nombre,
        proveedor_id,
        categoria_id,
        ubicacion_id,
        valor_estimado,
        cantidad,
        estado
    } = req.body;

    const errores = [];

    // 1. Validar Nombre (Obligatorio)
    if (!nombre || nombre.trim() === "") {
        errores.push("El nombre del artículo es obligatorio.");
    } else if (nombre.length > 150) {
        errores.push("El nombre no puede exceder los 150 caracteres.");
    }

    // 2. Validar Cantidad (Debe ser un número entero positivo)
    if (cantidad !== undefined) {
        if (!Number.isInteger(Number(cantidad)) || Number(cantidad) < 0) {
            errores.push("La cantidad debe ser un número entero mayor o igual a 0.");
        }
    }

    // 3. Validar Valor Estimado (Debe ser un número decimal positivo)
    if (valor_estimado !== undefined && valor_estimado !== null) {
        if (isNaN(valor_estimado) || Number(valor_estimado) < 0) {
            errores.push("El valor estimado debe ser un número válido mayor o igual a 0.");
        }
    }

    // 4. Validar IDs de Relación (Deben ser UUIDs válidos si se proporcionan)
    if (proveedor_id && !esUUID(proveedor_id)) {
        errores.push("El ID del proveedor no tiene un formato válido (UUID).");
    }

    if (categoria_id && !esUUID(categoria_id)) {
        errores.push("El ID de la categoría no tiene un formato válido (UUID).");
    }

    if (ubicacion_id && !esUUID(ubicacion_id)) {
        errores.push("El ID de la ubicación no tiene un formato válido (UUID).");
    }

    // 5. Validar Estado (Opcional, pero limitado)
    if (estado && estado.length > 50) {
        errores.push("El estado no puede exceder los 50 caracteres.");
    }

    // --- RESPUESTA ---
    if (errores.length > 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "Datos de inventario inválidos",
            detalles: errores
        });
    }

    // Si todo está bien, pasamos al controlador
    next();
};

module.exports = { validarInventario };