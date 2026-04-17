const { prisma } = require('../db');
const { generarCodigoAleatorio } = require('../utils/generadores');

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

    // Crear estante con código automático
    create: async (req, res) => {
        try {
            let data = req.body;

            // LÓGICA DE CÓDIGO AUTOMÁTICO (4 números)
            if (!data.codigo || data.codigo.trim() === "") {
                data.codigo = generarCodigoAleatorio("EST");
            }

            const nuevo = await prisma.estante.create({ data });
            res.status(201).json(nuevo);
        } catch (error) {
            console.error("Error en estantes.create:", error);
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "El código de estante generado ya existe. Intente de nuevo." });
            }
            res.status(500).json({ error: "Error al crear estante" });
        }
    },

    // Obtener uno por ID
    getById: async (req, res) => {
        try {
            const estante = await prisma.estante.findUnique({
                where: { id: req.params.id },
                include: {
                    cajas: true,
                    // Si tienes relación directa de herramientas que no están en cajas:
                    // inventario: true 
                }
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
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "Ese código de estante ya está en uso" });
            }
            res.status(500).json({ error: "Error al actualizar estante" });
        }
    },

    // Eliminar
    delete: async (req, res) => {
        try {
            await prisma.estante.delete({ where: { id: req.params.id } });
            res.json({ message: "Estante eliminado correctamente" });
        } catch (error) {
            // Nota: Prisma lanzará error si hay herramientas o cajas vinculadas por la integridad referencial
            res.status(500).json({ error: "No se puede eliminar: el estante tiene cajas o herramientas asignadas" });
        }
    }
};

module.exports = estanteController;