const { esUUID } = require('../utils/validadores');

const validarInventario = (req, res, next) => {
    const {
        codigo, nombre, proveedor_id, categoria_id,
        valor_estimado, caja_id, estante_id, estado, cantidad
    } = req.body;

    const errores = [];

    // 1. Validar Código y Nombre (Obligatorios)
    if (!codigo || codigo.trim() === "") {
        errores.push("El código del artículo es obligatorio.");
    } else if (codigo.length > 50) {
        errores.push("El código no puede exceder los 50 caracteres.");
    }

    if (!nombre || nombre.trim() === "") {
        errores.push("El nombre del artículo es obligatorio.");
    } else if (nombre.length > 150) {
        errores.push("El nombre no puede exceder los 150 caracteres.");
    }

    // 2. Lógica de Almacenamiento (Exclusión Mutua)
    // Caso A: Ambos están llenos
    if (caja_id && estante_id) {
        errores.push("No puede asignar una caja y un estante al mismo tiempo. Si la herramienta está en una caja, el estante se hereda de la ubicación de la caja.");
    }

    // Caso B: Ambos están vacíos (Opcional, depende si permites herramientas "en el aire")
    if (!caja_id && !estante_id) {
        errores.push("Debe especificar una ubicación: ya sea una caja o un estante directamente.");
    }

    // 3. Validar Formato de UUIDs
    const relaciones = { proveedor_id, categoria_id, caja_id, estante_id };
    for (const [campo, valor] of Object.entries(relaciones)) {
        if (valor && !esUUID(valor)) {
            errores.push(`El campo ${campo} debe ser un UUID válido.`);
        }
    }

    // 4. Validar Cantidad
    if (cantidad !== undefined) {
        if (!Number.isInteger(cantidad) || cantidad < 0) {
            errores.push("La cantidad debe ser un número entero mayor o igual a 0.");
        }
    }

    // 5. Validar Valor Estimado
    if (valor_estimado !== undefined && valor_estimado !== null) {
        if (isNaN(valor_estimado) || valor_estimado < 0) {
            errores.push("El valor estimado debe ser un número positivo.");
        }
    }

    // --- RESPUESTA ---
    if (errores.length > 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "Datos de inventario inválidos",
            detalles: errores
        });
    }

    next();
};

module.exports = { validarInventario };