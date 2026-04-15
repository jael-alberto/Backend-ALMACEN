const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
const app = express();

// Importar rutas
const proveedorRoutes = require('./routes/proveedorRoutes');
const personaRoutes = require('./routes/personaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const roleRoutes = require('./routes/roleRoutes');
const permisoRoutes = require('./routes/permisoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const estanteRoutes = require('./routes/estanteRoutes');
const cajaRoutes = require('./routes/cajaRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');
const movimientoRoutes = require('./routes/movimientoRoutes');

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permisos', permisoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/estantes', estanteRoutes);
app.use('/api/cajas', cajaRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/movimientos', movimientoRoutes);



// Ruta de prueba para ver si funciona
app.get('/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ mensaje: "Conexión exitosa", hora: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 4000; // Usamos el 4000 para no chocar con el frontend
app.listen(PORT, () => {
    console.log(`Servidor de la API corriendo en http://localhost:${PORT}`);
});