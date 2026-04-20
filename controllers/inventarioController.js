const { prisma } = require('../db');
const { generarCodigoAleatorio } = require('../utils/generadores');

const inventarioController = {
    // Listar y buscar por nombre o código
    getAll: async (req, res) => {
        const { search, categoria, ubicacion } = req.query;
        try {
            const items = await prisma.inventario.findMany({
                where: {
                    AND: [
                        categoria ? { categoria_id: categoria } : {},
                        ubicacion ? { ubicacion_id: ubicacion } : {},
                        search ? {
                            OR: [
                                { nombre: { contains: search, mode: 'insensitive' } },
                                { codigo: { contains: search, mode: 'insensitive' } }
                            ]
                        } : {}
                    ]
                },
                include: {
                    proveedor: true,
                    categoria: true,
                    ubicacion: {
                        include: { padre: true } // Para saber en qué estante está la caja, por ejemplo
                    }
                },
                orderBy: { nombre: 'asc' }
            });
            res.json(items);
        } catch (error) {
            console.error("Error en inventario.getAll:", error);
            res.status(500).json({ error: "Error al obtener el inventario" });
        }
    },

    // Crear artículo en inventario
    create: async (req, res) => {
        try {
            let data = req.body;

            // LÓGICA DE CÓDIGO AUTOMÁTICO
            if (!data.codigo || data.codigo.trim() === "") {
                let codigoGenerado;
                let existe = true;

                while (existe) {
                    codigoGenerado = generarCodigoAleatorio("INV");
                    const duplicado = await prisma.inventario.findUnique({
                        where: { codigo: codigoGenerado }
                    });
                    if (!duplicado) existe = false;
                }
                data.codigo = codigoGenerado;
            }

            // Convertir tipos de datos necesarios
            if (data.cantidad) data.cantidad = parseInt(data.cantidad);
            if (data.valor_estimado) data.valor_estimado = parseFloat(data.valor_estimado);

            const nuevo = await prisma.inventario.create({
                data,
                include: { ubicacion: true }
            });

            res.status(201).json(nuevo);
        } catch (error) {
            console.error("Error en inventario.create:", error);
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "El código de inventario ya existe" });
            }
            res.status(500).json({ error: "Error al crear artículo" });
        }
    },

    // Obtener uno por ID con detalle de ubicación
    getById: async (req, res) => {
        try {
            const item = await prisma.inventario.findUnique({
                where: { id: req.params.id },
                include: {
                    proveedor: true,
                    categoria: true,
                    ubicacion: {
                        include: { padre: true }
                    },
                    movimientos: {
                        take: 10,
                        orderBy: { fecha: 'desc' }
                    }
                }
            });
            if (!item) return res.status(404).json({ error: "Artículo no encontrado" });
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: "Error al buscar el artículo" });
        }
    },

    // Actualizar (Cambio de estado, ubicación, etc.)
    update: async (req, res) => {
        try {
            const data = req.body;

            // Asegurar tipos de datos
            if (data.cantidad) data.cantidad = parseInt(data.cantidad);
            if (data.valor_estimado) data.valor_estimado = parseFloat(data.valor_estimado);

            const actualizado = await prisma.inventario.update({
                where: { id: req.params.id },
                data: data
            });
            res.json(actualizado);
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "El código ya está en uso" });
            }
            res.status(500).json({ error: "Error al actualizar el artículo" });
        }
    },

    // Eliminar
    delete: async (req, res) => {
        try {
            await prisma.inventario.delete({ where: { id: req.params.id } });
            res.json({ message: "Artículo eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar (puede tener préstamos o movimientos registrados)" });
        }
    }
};

module.exports = inventarioController;