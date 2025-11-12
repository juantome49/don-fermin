// Constantes de DOM y Storage
const CART_STORAGE_KEY = 'don_fermin_cart';
const cartListElement = document.getElementById('cart-list');
const subtotalDisplay = document.getElementById('subtotal-display');
const totalDisplay = document.getElementById('total-display');
const checkoutForm = document.getElementById('checkout-form');
const retiroSelect = document.getElementById('retiro');
const direccionGroup = document.getElementById('direccion-group');

// ===========================================
// FUNCIONES BÁSICAS DE CARRITO Y FORMATO
// ===========================================

/**
 * Carga el carrito desde localStorage.
 */
function getCart() {
    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        return [];
    }
}

/**
 * Guarda el carrito actualizado en localStorage.
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Formatea un número como moneda argentina (ARS). 
 */
function formatPrice(price) {
    if (typeof price !== 'number') return 'Precio no disponible';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
}

// ===========================================
// LÓGICA DE ACTUALIZACIÓN Y RENDERIZADO
// ===========================================


function calculateTotals(cart) {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    // Nota: Aquí se podría añadir la lógica de costo de envío si 'retiro' es 'envio'
    const total = subtotal; // Por simplicidad, el total es igual al subtotal por ahora.

    subtotalDisplay.textContent = formatPrice(subtotal);
    totalDisplay.textContent = formatPrice(total);
    
    // Devolvemos el total para usarlo en la llamada al backend
    return { subtotal, total };
}



function updateCartCount() {
    const cart = getCart();
    const countElement = document.getElementById('cart-count');
    const totalUniqueItems = cart.length; 
    
    if (countElement) {
        countElement.textContent = totalUniqueItems;
        countElement.style.display = totalUniqueItems > 0 ? 'inline-block' : 'none'; 
    }
}

/**
 * Renderiza la lista de productos del carrito.
 */
function renderCart() {
    const cart = getCart();
    cartListElement.innerHTML = ''; // Limpiar la lista

    if (cart.length === 0) {
        cartListElement.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío. <a href="menu.html">Ver menú</a></p>';
        document.getElementById('pay-button').disabled = true;
    } else {
        document.getElementById('pay-button').disabled = false;
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.setAttribute('data-sku', item.sku);

            itemElement.innerHTML = `
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${formatPrice(item.price)}</span>
                </div>
                <div class="item-controls">
                    <button data-action="decrement" data-sku="${item.sku}">-</button>
                    <input type="number" min="1" value="${item.quantity}" data-sku="${item.sku}" class="item-quantity">
                    <button data-action="increment" data-sku="${item.sku}">+</button>
                </div>
                <button class="remove-btn" data-action="remove" data-sku="${item.sku}">🗑️</button>
            `;
            cartListElement.appendChild(itemElement);
        });
    }
    
    calculateTotals(cart);
    updateCartCount(); // Actualiza el contador en el header
}

// ===========================================
// MANEJO DE EVENTOS DEL CARRITO
// ===========================================

/**
 * Maneja los cambios de cantidad y eliminación de ítems.
 */
cartListElement.addEventListener('click', function(e) {
    const sku = e.target.getAttribute('data-sku');
    const action = e.target.getAttribute('data-action');
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.sku === sku);

    if (itemIndex > -1) {
        if (action === 'increment') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'decrement') {
            cart[itemIndex].quantity -= 1;
            if (cart[itemIndex].quantity < 1) {
                cart.splice(itemIndex, 1); // Elimina si la cantidad llega a cero
            }
        } else if (action === 'remove') {
            cart.splice(itemIndex, 1);
        }
    }
    
    saveCart(cart);
    renderCart();
});

/**
 * Maneja el cambio manual de cantidad en el input.
 */
cartListElement.addEventListener('change', function(e) {
    if (e.target.classList.contains('item-quantity')) {
        const sku = e.target.getAttribute('data-sku');
        const newQuantity = parseInt(e.target.value, 10);
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.sku === sku);
        
        if (itemIndex > -1 && newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else if (itemIndex > -1 && newQuantity <= 0) {
            cart.splice(itemIndex, 1); // Elimina si la cantidad es inválida
        }
        
        saveCart(cart);
        renderCart();
    }
});

/**
 * Muestra/oculta el campo de dirección según el tipo de retiro.
 */
retiroSelect.addEventListener('change', function() {
    if (this.value === 'envio') {
        direccionGroup.style.display = 'block';
        document.getElementById('direccion').required = true;
    } else {
        direccionGroup.style.display = 'none';
        document.getElementById('direccion').required = false;
    }
});


// ===========================================
// LÓGICA DE PAGO Y CONEXIÓN CON EL BACKEND
// ===========================================

checkoutForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const cart = getCart();
    const { total } = calculateTotals(cart);
    
    if (cart.length === 0) {
        alert('El carrito está vacío. Agregue productos para continuar.');
        return;
    }
    
    // 1. Recolección de Datos del Cliente
    const cliente = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        retiro: retiroSelect.value,
        direccion: retiroSelect.value === 'envio' ? document.getElementById('direccion').value : 'N/A',
        notas: document.getElementById('notas').value
    };
    
    // 2. Preparación del Payload para el Backend
    // Se envía SOLO el SKU y la cantidad. El backend verifica el precio (Antifraude - backend.odt).
    const carritoPayload = cart.map(item => ({
        sku: item.sku,
        cantidad: item.quantity
    }));
    
    const pedidoData = {
        carrito: carritoPayload,
        cliente: cliente,
        // Este es el monto enviado por el cliente (EL BACKEND DEBE VALIDARLO)
        montoEnviado: total 
        // Nota: Aquí iría el token de pago si fuera una pasarela real
    };
    
    try {
        document.getElementById('pay-button').textContent = 'Procesando pago...';
        document.getElementById('pay-button').disabled = true;

        // 3. Llamada al Backend (Ruta POST /api/pago)
        const response = await fetch('/api/pago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('🎉 ¡Pedido y Pago exitoso! Recibirás la confirmación por email.');
            localStorage.removeItem(CART_STORAGE_KEY); // Limpia el carrito
            window.location.href = 'menu.html'; // Redirige al menú o a una página de gracias
        } else {
            // Manejo de errores de validación (fraude) o pasarela
            alert(`❌ Error en el pago: ${result.message || 'Ocurrió un error inesperado.'}`);
        }

    } catch (error) {
        console.error('Error de conexión con el backend:', error);
        alert('❌ Error de red: No se pudo conectar con el servidor para procesar el pago.');
    } finally {
        document.getElementById('pay-button').textContent = 'PAGAR AHORA';
        document.getElementById('pay-button').disabled = false;
    }
});

// ===========================================
// INICIALACIÓN
// ===========================================

document.addEventListener('DOMContentLoaded', renderCart);
