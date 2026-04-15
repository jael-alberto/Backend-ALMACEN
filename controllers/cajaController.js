const { prisma } = require('../db');

const cajaController = {
    // Listar y buscar por código o descripción
    getAll: async (req, res) => {
        const { search } = req.query;
        try {
            const cajas = await prisma.caja.findMany({
                where: search ? {
                    OR: [
                        { codigo: { contains: search, mode: 'insensitive' } },
                        { descripcion: { contains: search, mode: 'insensitive' } }
                    ]
                } : {},
                include: {
                    estante: true // Para saber en qué estante está la caja
                },
                orderBy: { codigo: 'asc' }
            });
            res.json(cajas);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener las cajas" });
        }
    },

    // Crear caja
    create: async (req, res) => {
        try {
            const nueva = await prisma.caja.create({ data: req.body });
            res.status(201).json(nueva);
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "El código de caja ya existe" });
            }
            res.status(500).json({ error: "Error al crear la caja" });
        }
    },

    // Obtener una por ID
    getById: async (req, res) => {
        try {
            const caja = await prisma.caja.findUnique({
                where: { id: req.params.id },
                include: { estante: true, inventarios: true }
            });
            if (!caja) return res.status(404).json({ error: "Caja no encontrada" });
            res.json(caja);
        } catch (error) {
            res.status(500).json({ error: "Error al buscar la caja" });
        }
    },

    // Actualizar (Mover de estante, cambiar descripción, etc.)
    update: async (req, res) => {
        try {
            const actualizada = await prisma.caja.update({
                where: { id: req.params.id },
                data: req.body
            });
            res.json(actualizada);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar la caja" });
        }
    },

    // Eliminar
    delete: async (req, res) => {
        try {
            await prisma.caja.delete({ where: { id: req.params.id } });
            res.json({ message: "Caja eliminada correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar (puede tener productos o movimientos asociados)" });
        }
    }
};

module.exports = cajaController;