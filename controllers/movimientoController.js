const { prisma } = require('../db');

const movimientoController = {
    // Listar movimientos con filtros por tipo, inventario o persona
    getAll: async (req, res) => {
        const { tipo, inventario_id, persona_id } = req.query;
        try {
            const movimientos = await prisma.movimiento.findMany({
                where: {
                    AND: [
                        tipo ? { tipo: tipo.toUpperCase() } : {},
                        inventario_id ? { inventario_id } : {},
                        persona_id ? { persona_id } : {}
                    ]
                },
                include: {
                    inventario: true,
                    ubicacion_origen: true,
                    ubicacion_destino: true,
                    persona: true,
                    usuario: { select: { nombre_usuario: true } } // Seguridad: no enviar password
                },
                orderBy: { fecha: 'desc' } // Los más recientes primero
            });
            res.json(movimientos);
        } catch (error) {
            console.error("Error en movimientos.getAll:", error);
            res.status(500).json({ error: "Error al obtener historial de movimientos" });
        }
    },

    // Registrar un movimiento y actualizar inventario automáticamente
    create: async (req, res) => {
        const {
            inventario_id,
            tipo,
            cantidad,
            ubicacion_destino_id,
            ubicacion_origen_id,
            persona_id,
            usuario_id,
            observaciones
        } = req.body;

        try {
            // Usamos una transacción para que el historial y el cambio físico ocurran juntos
            const resultado = await prisma.$transaction(async (tx) => {

                // 1. Crear el registro del movimiento
                const nuevoMovimiento = await tx.movimiento.create({
                    data: {
                        inventario_id,
                        tipo: tipo.toUpperCase(),
                        cantidad: parseInt(cantidad),
                        ubicacion_origen_id,
                        ubicacion_destino_id,
                        persona_id,
                        usuario_id,
                        observaciones
                    }
                });

                // 2. Si es un TRASLADO o ENTRADA, actualizamos la ubicación actual en Inventario
                if ((tipo === 'TRASLADO' || tipo === 'ENTRADA') && ubicacion_destino_id) {
                    await tx.inventario.update({
                        where: { id: inventario_id },
                        data: { ubicacion_id: ubicacion_destino_id }
                    });
                }

                // 3. Si es SALIDA o PRESTAMO, podríamos querer limpiar la ubicación o marcar estado
                // Aquí puedes añadir lógica según las reglas del taller

                return nuevoMovimiento;
            });

            res.status(201).json(resultado);
        } catch (error) {
            console.error("Error en movimientos.create:", error);
            res.status(500).json({ error: "Error al procesar el movimiento" });
        }
    },

    // Obtener detalle de un movimiento específico
    getById: async (req, res) => {
        try {
            const movimiento = await prisma.movimiento.findUnique({
                where: { id: req.params.id },
                include: {
                    inventario: true,
                    ubicacion_origen: true,
                    ubicacion_destino: true,
                    persona: true,
                    prestamo: true
                }
            });
            if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
            res.json(movimiento);
        } catch (error) {
            res.status(500).json({ error: "Error al buscar movimiento" });
        }
    },

    // Los movimientos generalmente NO se actualizan ni eliminan para mantener la integridad del historial.
    // Solo permitimos eliminar en caso de error administrativo extremo.
    delete: async (req, res) => {
        try {
            await prisma.movimiento.delete({ where: { id: req.params.id } });
            res.json({ message: "Registro de movimiento eliminado" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el registro" });
        }
    }
};

module.exports = movimientoController;