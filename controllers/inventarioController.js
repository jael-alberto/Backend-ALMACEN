const { prisma } = require('../db');

const inventarioController = {
    // Listar y buscar por nombre o código
    getAll: async (req, res) => {
        const { search } = req.query;
        try {
            const items = await prisma.inventario.findMany({
                where: search ? {
                    OR: [
                        { nombre: { contains: search, mode: 'insensitive' } },
                        { codigo: { contains: search, mode: 'insensitive' } }
                    ]
                } : {},
                include: {
                    proveedor: true,
                    categoria: true,
                    caja: true,
                    estante: true
                },
                orderBy: { nombre: 'asc' }
            });
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el inventario" });
        }
    },

    // Crear artículo en inventario
    create: async (req, res) => {
        try {
            const nuevo = await prisma.inventario.create({ data: req.body });
            res.status(201).json(nuevo);
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "El código de inventario ya existe" });
            }
            res.status(500).json({ error: "Error al crear artículo" });
        }
    },

    // Obtener uno por ID con todo su detalle
    getById: async (req, res) => {
        try {
            const item = await prisma.inventario.findUnique({
                where: { id: req.params.id },
                include: {
                    proveedor: true,
                    categoria: true,
                    caja: true,
                    estante: true
                }
            });
            if (!item) return res.status(404).json({ error: "Artículo no encontrado" });
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: "Error al buscar el artículo" });
        }
    },

    // Actualizar (cambiar cantidad, mover de estante, etc.)
    update: async (req, res) => {
        try {
            const actualizado = await prisma.inventario.update({
                where: { id: req.params.id },
                data: req.body
            });
            res.json(actualizada);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el artículo" });
        }
    },

    // Eliminar
    delete: async (req, res) => {
        try {
            await prisma.inventario.delete({ where: { id: req.params.id } });
            res.json({ message: "Artículo eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar (puede tener préstamos o movimientos)" });
        }
    }
};

module.exports = inventarioController;