const { prisma } = require('../db');

const movimientoController = {
    // Listar todos los movimientos con filtros
    getAll: async (req, res) => {
        const { search } = req.query;
        try {
            const movimientos = await prisma.movimiento.findMany({
                where: search ? {
                    OR: [
                        { tipo: { contains: search, mode: 'insensitive' } },
                        { observaciones: { contains: search, mode: 'insensitive' } }
                    ]
                } : {},
                include: {
                    inventario: true,
                    caja_origen: true,
                    caja_destino: true,
                    est_origen: true,
                    est_destino: true,
                    persona: true,
                    usuario: true,
                    prestamo: true
                },
                orderBy: { fecha: 'desc' } // Ver lo más reciente primero
            });
            res.json(movimientos);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los movimientos" });
        }
    },

    // Registrar un movimiento (Entrada, Salida, Traslado)
    create: async (req, res) => {
        try {
            const nuevo = await prisma.movimiento.create({ data: req.body });
            res.status(201).json(nuevo);
        } catch (error) {
            res.status(500).json({ error: "Error al registrar el movimiento" });
        }
    },

    // Obtener detalle de un movimiento específico
    getById: async (req, res) => {
        try {
            const movimiento = await prisma.movimiento.findUnique({
                where: { id: req.params.id },
                include: {
                    inventario: true,
                    caja_origen: true,
                    caja_destino: true,
                    est_origen: true,
                    est_destino: true,
                    persona: true,
                    usuario: true
                }
            });
            if (!movimiento) return res.status(404).json({ error: "Movimiento no encontrado" });
            res.json(movimiento);
        } catch (error) {
            res.status(500).json({ error: "Error al buscar el movimiento" });
        }
    },

    // Actualizar (generalmente solo para corregir observaciones)
    update: async (req, res) => {
        try {
            const actualizado = await prisma.movimiento.update({
                where: { id: req.params.id },
                data: req.body
            });
            res.json(actualizada);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el movimiento" });
        }
    },

    // Eliminar registro
    delete: async (req, res) => {
        try {
            await prisma.movimiento.delete({ where: { id: req.params.id } });
            res.json({ message: "Movimiento eliminado del historial" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el registro" });
        }
    }
};

module.exports = movimientoController;