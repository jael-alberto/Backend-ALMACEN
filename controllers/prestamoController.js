const { prisma } = require('../db');

const prestamoController = {
    // Listar y filtrar por estado o búsqueda general
    getAll: async (req, res) => {
        const { search } = req.query;
        try {
            const prestamos = await prisma.prestamo.findMany({
                where: search ? {
                    OR: [
                        { estado: { contains: search, mode: 'insensitive' } },
                        { observaciones: { contains: search, mode: 'insensitive' } }
                    ]
                } : {},
                include: {
                    inventario: true, // Qué se prestó
                    persona: true,    // A quién se le prestó
                    usuario: true     // Quién registró el préstamo
                },
                orderBy: { fecha_prestamo: 'desc' } // Los más recientes primero
            });
            res.json(prestamos);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los préstamos" });
        }
    },

    // Crear un nuevo préstamo
    create: async (req, res) => {
        try {
            const nuevo = await prisma.prestamo.create({ data: req.body });
            res.status(201).json(nuevo);
        } catch (error) {
            res.status(500).json({ error: "Error al registrar el préstamo" });
        }
    },

    // Obtener un préstamo por ID con su detalle completo
    getById: async (req, res) => {
        try {
            const prestamo = await prisma.prestamo.findUnique({
                where: { id: req.params.id },
                include: {
                    inventario: true,
                    persona: true,
                    usuario: true
                }
            });
            if (!prestamo) return res.status(404).json({ error: "Préstamo no encontrado" });
            res.json(prestamo);
        } catch (error) {
            res.status(500).json({ error: "Error al buscar el préstamo" });
        }
    },

    // Actualizar (Útil para marcar como devuelto o cambiar estado)
    update: async (req, res) => {
        try {
            const actualizado = await prisma.prestamo.update({
                where: { id: req.params.id },
                data: req.body
            });
            res.json(actualizado);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el préstamo" });
        }
    },

    // Eliminar
    delete: async (req, res) => {
        try {
            await prisma.prestamo.delete({ where: { id: req.params.id } });
            res.json({ message: "Registro de préstamo eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el registro" });
        }
    }
};

module.exports = prestamoController;