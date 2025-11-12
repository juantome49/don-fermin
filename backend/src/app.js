const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); //  NECESARIO para email
require('dotenv').config(); 

// Importa las utilidades de Sheets.js 
const { conectarGoogleSheets, cargarCatalogo, registrarPedido } = require('./utils/sheets'); 

const app = express(); 
const PORT = process.env.PORT || 3000;
const DON_FERMIN_EMAIL = process.env.DON_FERMIN_EMAIL;

// Configuración del transportador de email (Node)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: DON_FERMIN_EMAIL,
        pass: process.env.EMAIL_PASS, 
    },
});


// Middleware
app.use(express.json());
app.use(cors());

// =================================================================
// 1. LÓGICA DE EMAIL 
// =================================================================


  //Función para enviar el correo de notificación

async function enviarNotificacion(pedido) {
    const mailOptions = {
        from: DON_FERMIN_EMAIL,
        to: DON_FERMIN_EMAIL, // Se envía a sí mismo
        subject: `NUEVO PEDIDO RECIBIDO: ${pedido.cliente.nombre} - ${new Date().toLocaleDateString()}`,
        html: `
            <h1>Detalles del Pedido #${pedido.idTransaccion}</h1>
            <p><strong>Cliente:</strong> ${pedido.cliente.nombre}</p>
            <p><strong>Email:</strong> ${pedido.cliente.email}</p>
            <p><strong>Método de Pago:</strong> ${pedido.metodoPago}</p>
            <p><strong>Monto Total:</strong> $${pedido.montoTotal.toFixed(2)}</p>
            <h2>Productos:</h2>
            <ul>
                ${pedido.carrito.map(item => `<li>${item.cantidad} x ${item.nombre || item.id}</li>`).join('')}
            </ul>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✉️ Notificación de pedido enviada a Don Fermín.');
    } catch (error) {
        console.error('❌ Error al enviar notificación por email:', error.message);
    }
}


// =================================================================
// 2. LÓGICA DE NEGOCIO 
// =================================================================

async function finalizarPedido(pedido) {
    await enviarNotificacion(pedido); 
    
    // REGISTRO EN GOOGLE SHEETS
    const datosParaSheets = {
        fecha: new Date().toISOString(),
        idTransaccion: pedido.idTransaccion || 'SIN_PAGO',
        cliente: pedido.cliente.nombre,
        email: pedido.cliente.email,
        total: pedido.montoTotal,
        metodo: pedido.metodoPago,
        productos: JSON.stringify(pedido.carrito), 
    };

    await registrarPedido(datosParaSheets); 
    
    return { mensaje: "Pedido finalizado y registrado." };
}

// =================================================================
// 3. LÓGICA DE NEGOCIO 
// =================================================================

async function procesarPago(pedidoCliente, tokenPago) {
    const catalogoReal = await cargarCatalogo(); 
    let montoRecalculado = 0;

    // Validación Antifraude
    for (const item of pedidoCliente.carrito) {
        const productoCatalogo = catalogoReal[item.id];
        
        if (!productoCatalogo) {
            const error = new Error(`Producto ID ${item.id} no encontrado en el catálogo.`);
            error.code = 400; 
            throw error; 
        }
        montoRecalculado += productoCatalogo.precio * item.cantidad;
    }

    // Validación de Monto
    if (montoRecalculado.toFixed(2) !== pedidoCliente.montoTotal.toFixed(2)) {
        const error = new Error('Error de validación de monto: Los precios no coinciden.');
        error.code = 400; 
        throw error;
    }

    // Simulación de Pago 
    const idTransaccion = `TXN_${Date.now()}`; 

    const pedidoCompleto = { 
        ...pedidoCliente, 
        montoTotal: montoRecalculado, 
        idTransaccion, 
        metodoPago: 'Tarjeta' 
    };
    
    await finalizarPedido(pedidoCompleto); 

    return { idTransaccion, estado: 'aprobado', mensaje: 'Pago procesado y pedido registrado.' };
}


// =================================================================
// 4. SISTEMA DE RUTAS 
// =================================================================

// Ruta de pago (POST /api/pago)
app.post('/api/pago', async (req, res) => {
    try {
        const { pedido, tokenPago } = req.body;
        
        if (!pedido || !tokenPago) {
            return res.status(400).json({ error: 'Datos de pedido o token de pago faltantes.' });
        }

        const resultado = await procesarPago(pedido, tokenPago);
        
        return res.status(200).json(resultado);

    } catch (error) {
        // Manejo de Errores Unificado
        const statusCode = error.code === 400 ? 400 : 500;
        
        console.error(`Error en el proceso de pago. Mensaje: ${error.message}`);
        
        return res.status(statusCode).json({ 
            error: error.message || 'Error interno del servidor al procesar el pago.' 
        });
    }
});


// =================================================================
// 5. INICIO DEL SERVIDOR
// =================================================================

async function iniciarServidor() {
    // Conexión crítica con Google Sheets
    try {
        await conectarGoogleSheets();
    } catch (error) {
        console.error("🛑 Servidor detenido debido a un fallo crítico en la conexión a Google Sheets.");
        process.exit(1); 
    }
    
    app.listen(PORT, () => {
        console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
    });
}

iniciarServidor();
