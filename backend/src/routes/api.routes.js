// api.routes.js
const express = require('express');
const router = express.Router();
const { procesarPago } = require('./services/pago.service'); 

// Ruta de pago
router.post('/pago', async (req, res) => {
    try {
        const { pedido, tokenPago } = req.body;
        
        // Verifica datos mínimos
        if (!pedido || !tokenPago) {
            return res.status(400).json({ error: 'Datos de pedido o token de pago faltantes.' });
        }

        // Ejecuta la lógica de pago y validación (que usa Google Sheets)
        const resultado = await procesarPago(pedido, tokenPago);
        
        return res.status(200).json(resultado);

    } catch (error) {
        // Manejo Unificado de Errores
        
        // Usa el código 400 si el error es de validación/fraude, si no, usa 500
        const statusCode = error.code === 400 ? 400 : 500;
        
        console.error(`Error en el proceso de pago. Mensaje: ${error.message}`);
        
        return res.status(statusCode).json({ 
            error: error.message || 'Error interno del servidor al procesar el pago.' 
        });
    }
});

module.exports = router;