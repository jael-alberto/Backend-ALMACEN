const { prisma } = require('../db');
const { generarCodigoAleatorio } = require('../utils/generadores');

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
                    estante: true
                },
                orderBy: { codigo: 'asc' }
            });
            res.json(cajas);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener las cajas" });
        }
    },

    // Crear caja con Código Automático
    create: async (req, res) => {
        try {
            let data = req.body;

            // Lógica de Código Automático
            if (!data.codigo || data.codigo.trim() === "") {
                data.codigo = generarCodigoAleatorio("CAJA");
            }

            const nueva = await prisma.caja.create({ data });
            res.status(201).json(nueva);
        } catch (error) {
            console.error("Error en crear caja:", error);
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "El código de caja ya existe. Intente de nuevo." });
            }
            if (error.code === 'P2003') {
                return res.status(400).json({ error: "El estante_id proporcionado no existe" });
            }
            res.status(500).json({ error: "Error al crear la caja" });
        }
    },

    // Obtener una por ID con sus herramientas
    getById: async (req, res) => {
        try {
            const caja = await prisma.caja.findUnique({
                where: { id: req.params.id },
                include: {
                    estante: true,
                    inventarios: true // Para ver qué herramientas hay dentro de esta caja
                }
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
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "Ese código de caja ya está en uso" });
            }
            res.status(500).json({ error: "Error al actualizar la caja" });
        }
    },

    // Eliminar
    delete: async (req, res) => {
        try {
            await prisma.caja.delete({ where: { id: req.params.id } });
            res.json({ message: "Caja eliminada correctamente" });
        } catch (error) {
            // Captura si la caja tiene herramientas adentro (integridad referencial)
            res.status(500).json({ error: "No se puede eliminar: la caja contiene herramientas registradas" });
        }
    }
};

module.exports = cajaController;