const { prisma } = require('../db');
const { generarCodigoAleatorio } = require('../utils/generadores');

const proveedorController = {
    // 1. Obtener todos (con búsqueda opcional)
    getAll: async (req, res) => {
        const { search } = req.query;
        try {
            const proveedores = await prisma.proveedor.findMany({
                where: search ? {
                    OR: [
                        { nombre_empresa: { contains: search, mode: 'insensitive' } },
                        { nombre_contacto: { contains: search, mode: 'insensitive' } },
                        { codigo: { contains: search, mode: 'insensitive' } } // Añadida búsqueda por código
                    ]
                } : {},
                orderBy: { nombre_empresa: 'asc' }
            });
            res.json(proveedores);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener proveedores" });
        }
    },

    // 2. Crear con Código Automático
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

            const nuevo = await prisma.proveedor.create({ data });
            res.status(201).json(nuevo);
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "El código de proveedor ya existe. Intente de nuevo." });
            }
            res.status(500).json({ error: "Error al crear proveedor" });
        }
    },

    // 3. Obtener uno por ID
    getById: async (req, res) => {
        try {
            const proveedor = await prisma.proveedor.findUnique({
                where: { id: req.params.id },
                include: {
                    // Opcional: ver qué productos nos suministra este proveedor
                    inventario: true
                }
            });
            if (!proveedor) return res.status(404).json({ error: "Proveedor no encontrado" });
            res.json(proveedor);
        } catch (error) {
            res.status(500).json({ error: "Error al buscar proveedor" });
        }
    },

    // 4. Actualizar
    update: async (req, res) => {
        try {
            const actualizado = await prisma.proveedor.update({
                where: { id: req.params.id },
                data: req.body
            });
            res.json(actualizado);
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: "Ese código de proveedor ya está en uso" });
            }
            res.status(500).json({ error: "Error al actualizar proveedor" });
        }
    },

    // 5. Eliminar
    delete: async (req, res) => {
        try {
            await prisma.proveedor.delete({ where: { id: req.params.id } });
            res.json({ message: "Proveedor eliminado correctamente" });
        } catch (error) {
            // El catch captura si intentas borrar un proveedor que tiene herramientas en el inventario
            res.status(500).json({ error: "No se puede eliminar: existen artículos en el inventario asociados a este proveedor" });
        }
    }
};

module.exports = proveedorController;