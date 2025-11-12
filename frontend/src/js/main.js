// src/js/main.js
import { products } from './products.js'; // Importa el catálogo

const BACKEND_URL = 'http://localhost:3000'; // Debe coincidir con tu .env
const productListElement = document.getElementById('product-list');
const cartCountElement = document.querySelector('.cart-count');

// Inicialización del Carrito (usamos un array de objetos {sku, name, price, quantity})
let cart = JSON.parse(localStorage.getItem('df_cart')) || [];


// --- UTILITIES ---

const formatPrice = (price) => `$ ${price.toFixed(2).replace('.', ',')}`;

const updateCartDisplay = () => {
    // 1. Contar la cantidad total de ítems
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // 2. Guardar el carrito en el almacenamiento local
    localStorage.setItem('df_cart', JSON.stringify(cart));
    
    // 3. (Añadir aquí: lógica para mostrar el modal de carrito)
};


// --- CATALOGO RENDER ---

const renderProducts = () => {
    if (!productListElement) return;

    productListElement.innerHTML = ''; // Limpiar el contenedor
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Simplemente usa el nombre del archivo para la imagen, asumiendo que existen
        // En una app real, usarías la ruta correcta (e.g., ./imagenes/${product.img})
        productCard.innerHTML = `
            <img src="https://via.placeholder.com/400x180?text=${product.name}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <p class="product-description">${product.description}</p>
                <button class="btn-primary add-to-cart" data-sku="${product.sku}">Añadir al Carrito</button>
            </div>
        `;
        productListElement.appendChild(productCard);
    });

    // Añadir listeners después de que todos los productos se han renderizado
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
};


// --- CART LOGIC ---

const handleAddToCart = (event) => {
    const sku = event.target.dataset.sku;
    const product = products.find(p => p.sku === sku);

    if (!product) return;

    // Buscar si ya existe el producto en el carrito
    const existingItem = cart.find(item => item.sku === sku);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            sku: product.sku,
            name: product.name,
            price: product.price,
            quantity: 1,
            category: product.category
        });
    }

    updateCartDisplay();
    alert(`Añadido ${product.name} al carrito.`);
};


// --- CHECKOUT/BACKEND INTEGRATION (La clave de la conexión) ---

// Esta función simula el proceso de pago y envío de la orden al backend
async function simulateCheckoutAndSendOrder() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // 1. Calcular el total (¡Debe coincidir con la validación del backend!)
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 2. Simular datos del cliente (Esto se llenaría con un formulario de checkout)
    const customerData = {
        name: "Usuario Demo",
        phone: "+5491100000000",
        email: "demo@donfermin.com.ar"
    };
    
    // 3. Simular datos de entrega/retiro
    const orderDetails = {
        customer: customerData,
        deliveryOption: "Retiro en Tienda",
        deliveryTime: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        totalAmount: totalAmount,
        // Los ítems del carrito ya tienen la estructura adecuada
        items: cart.map(item => ({ 
             sku: item.sku, 
             name: item.name, 
             quantity: item.quantity, 
             price: item.price 
        }))
    };
    
    // 4. Integración con la Pasarela de Pago (SIMULADO)
    // En una app real, aquí se llamaría al SDK de Mercado Pago/Stripe para obtener un 'paymentToken'.
    const paymentToken = "SIMULATED_TOKEN_12345"; 

    // 5. Construir el Payload para el Backend
    const payload = {
        order: orderDetails,
        token: paymentToken 
    };

    console.log("Enviando orden al backend:", payload);
    
    // --- LLAMADA AL BACKEND ---
    try {
        const response = await fetch(`${BACKEND_URL}/api/pago`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) { // 200 OK
            alert(`✅ ¡Pedido Exitoso! ID Transacción: ${data.transactionId}. Don Fermín ha sido notificado por email.`);
            cart = []; // Vaciar carrito
            updateCartDisplay();
        } else { // 400 Bad Request, 500 Server Error
            alert(`❌ ERROR: ${data.message || 'Fallo en el servidor.'}`);
        }
    } catch (error) {
        console.error("Fallo de conexión:", error);
        alert("❌ ERROR: No se pudo conectar con el servidor backend (revisar que esté corriendo en el puerto 3000).");
    }
}


// --- INICIALIZACIÓN ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderiza los productos
    renderProducts(); 
    
    // 2. Carga la cuenta del carrito
    updateCartDisplay(); 
    
    // 3. ASIGNAR SIMULACIÓN DE CHECKOUT (Para pruebas rápidas)
    // Asignaremos la función al icono del carrito, solo para probar la conexión
    const checkoutButton = document.querySelector('.cart-icon'); 
    checkoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Solo simular el checkout si hay ítems
        if (cart.length > 0) {
            simulateCheckoutAndSendOrder();
        } else {
            alert("El carrito está vacío. Agregue productos para simular el checkout.");
        }
    });

});