const { esEmail, esTelefono } = require('../utils/validadores');

const validarProveedor = (req, res, next) => {
    const { codigo, nombre_empresa, nombre_contacto, telefono, email } = req.body;
    const errores = [];

    // 1. Validar Código (Obligatorio y longitud)
    if (!codigo || codigo.trim() === "") {
        errores.push("El código del proveedor es obligatorio.");
    } else if (codigo.length > 50) {
        errores.push("El código no puede exceder los 50 caracteres.");
    }

    // 2. Validar Nombre de Empresa (Obligatorio)
    if (!nombre_empresa || nombre_empresa.trim() === "") {
        errores.push("El nombre de la empresa es obligatorio.");
    } else if (nombre_empresa.length > 100) {
        errores.push("El nombre de la empresa es demasiado largo (máximo 100).");
    }

    // 3. Validar Nombre de Contacto (Opcional)
    if (nombre_contacto && nombre_contacto.length > 50) {
        errores.push("El nombre del contacto no puede exceder los 50 caracteres.");
    }

    // 4. Validar Teléfono (Opcional, pero si viene, validar formato)
    if (telefono && !esTelefono(telefono)) {
        errores.push("El teléfono debe tener el formato: 000-000-0000.");
    }

    // 5. Validar Email (Opcional, pero si viene, validar formato)
    if (email && email.trim() !== "") {
        if (!esEmail(email)) {
            errores.push("El formato del correo electrónico no es válido.");
        }
    }

    // --- RESPUESTA ---
    if (errores.length > 0) {
        return res.status(400).json({
            status: "error",
            mensaje: "Datos de proveedor inválidos",
            detalles: errores
        });
    }

    next();
};

module.exports = { validarProveedor };