const { esUUID } = require('../utils/validadores');

const validarPrestamo = (req, res, next) => {
    const {
        inventario_id, persona_id, usuario_id,
        cantidad, fecha_prestamo, fecha_devolucion, estado, observaciones
    } = req.body;

    const errores = [];

    // 1. Validar Relaciones Obligatorias
    if (!inventario_id || !esUUID(inventario_id)) errores.push("Falta el artículo (inventario_id).");
    if (!persona_id || !esUUID(persona_id)) errores.push("Falta la persona (persona_id).");
    if (!usuario_id || !esUUID(usuario_id)) errores.push("Falta el usuario (usuario_id).");

    // 2. Validar Cantidad
    if (!cantidad || !Number.isInteger(cantidad) || cantidad <= 0) {
        errores.push("La cantidad debe ser un número entero positivo.");
    }

    // 3. Lógica de Fechas (Flexible)
    let fechaInicio = new Date(); // Si no mandan fecha, asumimos que es HOY

    if (fecha_prestamo) {
        fechaInicio = new Date(fecha_prestamo);
        if (isNaN(fechaInicio.getTime())) {
            errores.push("El formato de la fecha de préstamo no es válido.");
        }
    }

    if (fecha_devolucion) {
        const fechaFin = new Date(fecha_devolucion);
        if (isNaN(fechaFin.getTime())) {
            errores.push("El formato de la fecha de devolución no es válido.");
        } else {
            // Comparamos los días (Time) para asegurar que no sea un día anterior.
            // Si quieres permitir que se devuelva el mismo día (aunque sea un minuto después),
            // solo validamos que el tiempo final no sea menor al inicial.
            if (fechaFin < fechaInicio) {
                errores.push("La fecha de devolución no puede ser anterior al momento del préstamo.");
            }
        }
    }

    // 4. Validar Estado
    const estadosPermitidos = ["Prestado", "Devuelto", "Vencido", "Parcial"];
    if (estado && !estadosPermitidos.some(e => e.toLowerCase() === estado.toLowerCase())) {
        errores.push("Estado no válido.");
    }

    // --- RESPUESTA ---
    if (errores.length > 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "Datos de préstamo inválidos",
            detalles: errores
        });
    }

    next();
};

module.exports = { validarPrestamo };