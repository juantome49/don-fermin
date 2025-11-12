// Variable global para almacenar el catálogo de productos cargado
let CATALOGO_PANADERIA = [];
const grid = document.getElementById('products-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

// ===========================================
// FUNCIONES DE UTILIDAD
// ===========================================

/**
 * Carga los productos desde el archivo products.json.
 * Esta es la fuente de verdad para mostrar los ítems.
 */
async function loadProducts() {
    try {
        // La ruta 'products.json' debe ser accesible desde el navegador
        const response = await fetch('products.json'); 
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo: ${response.statusText}`);
        }
        const data = await response.json();
        return data.products; // Devuelve el array de productos
    } catch (error) {
        console.error("❌ Error al cargar el catálogo de productos:", error);
        grid.innerHTML = '<p class="error-message">No pudimos cargar el menú. Asegúrate de que products.json existe.</p>';
        return []; 
    }
}

/**
 * Formatea un número como moneda argentina (ARS).
 */
function formatPrice(price) {
    if (typeof price !== 'number') return 'Precio no disponible';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
}

/**
 * Crea el elemento HTML (tarjeta) para un producto dado.
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    // Se usa la categoría del producto para el filtrado. 
    // Si products.json no tiene 'category', usa 'general'.
    card.setAttribute('data-category', product.category || 'general'); 

    card.innerHTML = `
        <div class="product-image" style="background-image: url('${product.imageUrl}');"></div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="add-to-cart-btn" data-sku="${product.id}">➕ Agregar</button>
    `;
    return card;
}

/**
 * Renderiza los productos en la grilla.
 */
function renderProducts(productsToDisplay) {
    grid.innerHTML = ''; 
    if (productsToDisplay.length === 0) {
        grid.innerHTML = '<p class="no-products-message">No hay productos disponibles en esta categoría.</p>';
        return;
    }
    productsToDisplay.forEach(product => {
        grid.appendChild(createProductCard(product));
    });
}

// ===========================================
// MANEJO DEL CARRITO (USANDO localStorage)
// ===========================================

/**
 * Carga el carrito desde localStorage. Si no existe, devuelve un array vacío.
 */
function getCart() {
    try {
        const cart = localStorage.getItem('don_fermin_cart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        console.error("Error al leer el carrito de localStorage:", e);
        return [];
    }
}

/**
 * Guarda el carrito actualizado en localStorage.
 */
function saveCart(cart) {
    localStorage.setItem('don_fermin_cart', JSON.stringify(cart));
}

/**
 * Actualiza el contador del carrito visible en el header.
 */
function updateCartCount() {
    const cart = getCart();
    const countElement = document.getElementById('cart-count');
    
    // Sumamos la cantidad de ítems únicos (diferentes productos)
    const totalUniqueItems = cart.length; 
    
    if (countElement) {
        countElement.textContent = totalUniqueItems;
        // Muestra/Oculta el contador si está vacío
        countElement.style.display = totalUniqueItems > 0 ? 'inline-block' : 'none'; 
    }
}

/**
 * Agrega o incrementa un producto al carrito.
 */
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.sku === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Almacena solo la info esencial (sku, nombre, precio) para ahorrar espacio
        cart.push({
            sku: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    alert(`✅ ¡"${product.name}" agregado al carrito!`);
}

// ===========================================
// LÓGICA DE EVENTOS E INICIALIZACIÓN
// ===========================================

// 1. Lógica de Filtrado de Categorías
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const category = this.getAttribute('data-category');
        let filteredProducts;

        if (category === 'all') {
            filteredProducts = CATALOGO_PANADERIA;
        } else {
            filteredProducts = CATALOGO_PANADERIA.filter(p => p.category === category);
        }

        renderProducts(filteredProducts);
    });
});

// 2. Lógica de "Agregar al Carrito" (Delegación de eventos)
grid.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const sku = e.target.getAttribute('data-sku');
        const productData = CATALOGO_PANADERIA.find(p => p.id === sku);

        if (productData) {
            addToCart(productData); 
        }
    }
});


// 3. Inicialización: Cargar productos y contador al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar productos del JSON
    CATALOGO_PANADERIA = await loadProducts();
    renderProducts(CATALOGO_PANADERIA);
    
    // Cargar y mostrar el contador inicial del carrito
    updateCartCount(); 
});