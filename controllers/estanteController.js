const { prisma } = require('../db');

const estanteController = {
    // Listar y buscar por código o ubicación
    getAll: async (req, res) => {
        const { search } = req.query;
        try {
            const estantes = await prisma.estante.findMany({
                where: search ? {
                    OR: [
                        { codigo: { contains: search, mode: 'insensitive' } },
                        { ubicacion: { contains: search, mode: 'insensitive' } }
                    ]
                } : {},
                orderBy: { codigo: 'asc' }
            });
            res.json(estantes);
        } catch (error) {
            console.error("Error en estantes.getAll:", error);
            res.status(500).json({ error: "Error al obtener estantes" });
        }
    },

    // Crear estante
    create: async (req, res) => {
        try {
            const nuevo = await prisma.estante.create({ data: req.body });
            res.status(201).json(nuevo);
        } catch (error) {
            console.error("Error en estantes.create:", error);
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "El código de estante ya existe" });
            }
            res.status(500).json({ error: "Error al crear estante" });
        }
    },

    // Obtener uno por ID
    getById: async (req, res) => {
        try {
            const estante = await prisma.estante.findUnique({
                where: { id: req.params.id },
                include: { cajas: true } // Opcional: ver qué cajas tiene el estante
            });
            if (!estante) return res.status(404).json({ error: "Estante no encontrado" });
            res.json(estante);
        } catch (error) {
            res.status(500).json({ error: "Error al buscar estante" });
        }
    },

    // Actualizar
    update: async (req, res) => {
        try {
            const actualizado = await prisma.estante.update({
                where: { id: req.params.id },
                data: req.body
            });
            res.json(actualizada);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar estante" });
        }
    },

    // Eliminar
    delete: async (req, res) => {
        try {
            await prisma.estante.delete({ where: { id: req.params.id } });
            res.json({ message: "Estante eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar (puede tener cajas o productos asociados)" });
        }
    }
};

module.exports = estanteController;