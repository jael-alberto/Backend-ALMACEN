const { prisma } = require('../db');
const { generarCodigoAleatorio } = require('../utils/generadores');

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
            let data = req.body;

            // LÓGICA DE CÓDIGO AUTOMÁTICO
            if (!data.codigo || data.codigo.trim() === "") {
                data.codigo = generarCodigoAleatorio("INV");
            }

            // Crear el artículo y el movimiento de ENTRADA en una sola transacción
            const resultado = await prisma.$transaction(async (tx) => {
                const nuevoItem = await tx.inventario.create({ data });

                // Registrar movimiento automático de entrada
                await tx.movimiento.create({
                    data: {
                        inventario_id: nuevoItem.id,
                        tipo: 'ENTRADA',
                        cantidad: nuevoItem.cantidad || 0,
                        usuario_id: data.usuario_id_registro || null, // Asegúrate de mandar quién lo crea
                        observaciones: "Ingreso inicial al sistema"
                    }
                });

                return nuevoItem;
            });

            res.status(201).json(resultado);
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "El código de inventario ya existe" });
            }
            res.status(500).json({ error: "Error al crear artículo" });
        }
    },

    // Obtener uno por ID
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
            const id = req.params.id;
            const dataNueva = req.body;

            // Buscamos el estado actual para comparar si hubo un traslado
            const anterior = await prisma.inventario.findUnique({ where: { id } });
            if (!anterior) return res.status(404).json({ error: "Artículo no encontrado" });

            const actualizado = await prisma.$transaction(async (tx) => {
                const itemActualizado = await tx.inventario.update({
                    where: { id },
                    data: dataNueva
                });

                // LÓGICA DE TRASLADO: Si cambió la caja o el estante, registramos el movimiento
                if (dataNueva.caja_id !== anterior.caja_id || dataNueva.estante_id !== anterior.estante_id) {
                    await tx.movimiento.create({
                        data: {
                            inventario_id: id,
                            tipo: 'TRASLADO',
                            cantidad: itemActualizado.cantidad,
                            caja_origen_id: anterior.caja_id,
                            caja_destino_id: itemActualizado.caja_id,
                            estante_origen: anterior.estante_id,
                            estante_destino: itemActualizado.estante_id,
                            usuario_id: dataNueva.usuario_id_registro || null,
                            observaciones: "Cambio de ubicación mediante edición"
                        }
                    });
                }

                return itemActualizado;
            });

            res.json(actualizado);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el artículo" });
        }
    },

    // Eliminar
    delete: async (req, res) => {
        try {
            const id = req.params.id;

            await prisma.$transaction(async (tx) => {
                // Antes de borrar, registramos la SALIDA final
                const item = await tx.inventario.findUnique({ where: { id } });

                if (item) {
                    await tx.movimiento.create({
                        data: {
                            inventario_id: id,
                            tipo: 'SALIDA',
                            cantidad: item.cantidad,
                            usuario_id: null, // O el ID del usuario que borra si lo tienes
                            observaciones: "Artículo eliminado del inventario"
                        }
                    });
                }

                await tx.inventario.delete({ where: { id } });
            });

            res.json({ message: "Artículo eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar (puede tener préstamos activos)" });
        }
    }
};

module.exports = inventarioController;