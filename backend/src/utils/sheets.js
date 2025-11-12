// src/utils/sheets.js
const { GoogleSpreadsheet } = require('google-spreadsheet');
// 1. IMPORTAMOS JWT desde la librería oficial de autenticación
const { JWT } = require('google-auth-library'); 
// 2. Necesitamos el módulo 'fs' para leer el archivo JSON
const fs = require('fs'); 

// 3. Leemos el archivo JSON usando la ruta corregida del .env
const credsJson = fs.readFileSync(process.env.GOOGLE_CREDENTIALS_PATH, 'utf-8');
const creds = JSON.parse(credsJson);

// 4. Creamos el cliente de autenticación JWT
const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

// 5. Instanciamos GoogleSpreadsheet pasando el cliente de autenticación directamente
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

async function conectarGoogleSheets() {
    try {
        // La autenticación ya se hizo arriba. Aquí solo cargamos la información.
        await doc.loadInfo(); 
        console.log(`✅ Google Sheet ID: ${doc.title} cargada. Conexión exitosa.`);
    } catch (error) {
        console.error('❌ Error crítico al autenticar o conectar con Google Sheets:', error.message);
        throw new Error('Fallo al conectar con la fuente de verdad (Google Sheets).');
    }
}

async function cargarCatalogo() {
    try {
        const hojaCatalogo = doc.sheetsByTitle['Catálogo'];
        if (!hojaCatalogo) {
            throw new Error('La pestaña "Catálogo" no se encontró. Revise el nombre.');
        }

        const filas = await hojaCatalogo.getRows();
        
        const catalogo = filas.reduce((acc, row) => {
            acc[row.idProducto] = {
                id: row.idProducto,
                precio: parseFloat(row.precioUnitario) 
            };
            return acc;
        }, {});

        return catalogo;
    } catch (error) {
        console.error('❌ Error al cargar el catálogo:', error.message);
        throw new Error('No se pudo cargar la fuente de verdad del catálogo.');
    }
}

async function registrarPedido(datosPedido) {
    try {
        const hojaPedidos = doc.sheetsByTitle['Pedidos'];
        if (!hojaPedidos) {
            throw new Error('La pestaña "Pedidos" no se encontró. Revise el nombre.');
        }

        await hojaPedidos.addRow(datosPedido);
        console.log(`📝 Pedido ID ${datosPedido.idTransaccion} registrado en Sheets.`);
    } catch (error) {
        console.error('❌ Error al registrar el pedido:', error.message);
        throw new Error('Fallo la persistencia del pedido. Notificar al administrador.');
    }
}

module.exports = {
    conectarGoogleSheets,
    cargarCatalogo,
    registrarPedido
};