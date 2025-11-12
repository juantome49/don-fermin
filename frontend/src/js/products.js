// src/js/products.js

// Lista de productos y precios que usa el frontend para mostrar y calcular
export const products = [
    // Panadería
    { sku: "PAN_FRANCES_KG", name: "Pan Francés / Flautitas (x Kg)", price: 1500.00, category: "Panadería", description: "Clásico pan de todos los días.", img: "pan-frances.jpg" },
    { sku: "PAN_MIGÑON_KG", name: "Pan Migñón (x Kg)", price: 1700.00, category: "Panadería", description: "Pan suave y blanco, ideal para sándwiches.", img: "pan-mignon.jpg" },
    { sku: "PAN_DE_MOLDE_INTEGRAL", name: "Pan de Molde Integral (500g)", price: 2500.00, category: "Panadería", description: "Saludable y delicioso, con semillas.", img: "pan-integral.jpg" },
    { sku: "PAN_DE_CAMPO", name: "Pan de Campo Artesanal (Und)", price: 3200.00, category: "Panadería", description: "Miga compacta, ideal para tostar.", img: "pan-campo.jpg" },
    { sku: "PAN_HAMBURGUESA_X4", name: "Pan de Hamburguesa (Pack x 4)", price: 1800.00, category: "Panadería", description: "Suaves y grandes.", img: "pan-hamburguesa.jpg" },
    { sku: "PAN_PANCHOS_X6", name: "Pan de Pancho (Pack x 6)", price: 1600.00, category: "Panadería", description: "Frescos y tiernos.", img: "pan-pancho.jpg" },
    { sku: "GRISINES_X100G", name: "Grisines Clásicos (100g)", price: 900.00, category: "Panadería", description: "Ideales para acompañar.", img: "grisines.jpg" },
    { sku: "CHIPAS_X250G", name: "Chipás Recién Hechos (250g)", price: 4500.00, category: "Panadería", description: "Mandioca y queso, irresistibles.", img: "chipas.jpg" },
    
    // Facturas y Medialunas
    { sku: "MEDIALUNA_MANTECA_UND", name: "Medialuna de Manteca (Und)", price: 550.00, category: "Facturas", description: "La favorita, con el toque justo de almíbar.", img: "medialuna-manteca.jpg" },
    { sku: "MEDIALUNA_GRASA_UND", name: "Medialuna de Grasa (Und)", price: 480.00, category: "Facturas", description: "Crujientes y sabrosas.", img: "medialuna-grasa.jpg" },
    { sku: "FACTURA_CREMA_UND", name: "Factura de Crema Pastelera (Und)", price: 650.00, category: "Facturas", description: "Relleno suave de vainilla.", img: "factura-crema.jpg" },
    { sku: "FACTURA_MEMBRILLO_UND", name: "Factura de Membrillo (Und)", price: 600.00, category: "Facturas", description: "Con el dulce de membrillo casero.", img: "factura-membrillo.jpg" },
    { sku: "FACTURA_DOCE_MIX", name: "Docena de Facturas Surtidas", price: 6500.00, category: "Facturas", description: "Selección de nuestras mejores 12 facturas.", img: "facturas-mix.jpg" },
    
    // Pastelería
    { sku: "LEMON_PIE_ENTERO", name: "Lemon Pie (Torta Entera)", price: 12500.00, category: "Pastelería", description: "Base crocante, relleno cítrico y merengue.", img: "lemon-pie.jpg" },
    { sku: "TARTA_FRUTILLA_ENTERA", name: "Tarta de Frutillas con Crema", price: 15800.00, category: "Pastelería", description: "Frutillas frescas y crema chantilly.", img: "tarta-frutilla.jpg" },
    { sku: "PASTA_FROLA_BATATA", name: "Pasta Frola de Batata (Entera)", price: 8900.00, category: "Pastelería", description: "Masa tradicional con dulce de batata.", img: "pasta-frola-batata.jpg" },
    { sku: "TORTA_CHOCOLINAS", name: "Chocotorta (Torta Mediana)", price: 14500.00, category: "Pastelería", description: "La torta argentina de galletas y dulce de leche.", img: "chocotorta.jpg" },
    { sku: "SELVA_NEGRA_KG", name: "Torta Selva Negra (por Kg)", price: 19500.00, category: "Pastelería", description: "Chocolate, crema y cerezas.", img: "selva-negra.jpg" },
    { sku: "TIRAMISU_IND", name: "Tiramisú (Porción Individual)", price: 3500.00, category: "Pastelería", description: "El clásico italiano en porción individual.", img: "tiramisu.jpg" },

    // Masas y Secos
    { sku: "MASAS_FINAS_X250G", name: "Masas Finas Surtidas (250g)", price: 6800.00, category: "Masas", description: "Pequeñas delicias variadas.", img: "masas-finas.jpg" },
    { sku: "MASAS_SECAS_X250G", name: "Masas Secas (250g)", price: 5500.00, category: "Masas", description: "Ideales para el café.", img: "masas-secas.jpg" },
    { sku: "BUDÍN_NARANJA", name: "Budín de Naranja y Glaseado", price: 3900.00, category: "Masas", description: "Húmedo y aromático.", img: "budin-naranja.jpg" },
    { sku: "CUADRADO_BROWNIE", name: "Cuadrado de Brownie (Und)", price: 1800.00, category: "Masas", description: "Intenso sabor a chocolate.", img: "brownie.jpg" },
    { sku: "ALFAJOR_MAICENA_UNIDAD", name: "Alfajor de Maicena Gigante", price: 750.00, category: "Masas", description: "Con mucho dulce de leche y coco.", img: "alfajor-maicena.jpg" },
    
    // Salados
    { sku: "SANDWICH_MIGA_J_Q_X6", name: "Sándwich de Miga JyQ (Pack x 6)", price: 4900.00, category: "Salados", description: "Jamón y queso en pan fresco.", img: "sandwich-miga.jpg" },
    { sku: "EMPANA_JYQ_UND", name: "Empanada de Jamón y Queso (Und)", price: 800.00, category: "Salados", description: "Masa casera, mucho relleno.", img: "empanada.jpg" },
    { sku: "TARTA_IND_VERDURA", name: "Tarta Individual de Verdura", price: 3800.00, category: "Salados", description: "Opción ligera y nutritiva.", img: "tarta-individual.jpg" },
    { sku: "FOSFORITO_JYQ_UND", name: "Fosforito de Jamón y Queso (Und)", price: 1100.00, category: "Salados", description: "Hojaldre y relleno, un clásico.", img: "fosforito.jpg" },
    
    // Bebidas (Extras)
    { sku: "JUGO_NARANJA_LITRO", name: "Jugo de Naranja Natural (Litro)", price: 3100.00, category: "Bebidas", description: "Recién exprimido.", img: "jugo-naranja.jpg" },
    { sku: "AGUA_MINERAL_LITRO", name: "Agua Mineral (1.5 Litros)", price: 900.00, category: "Bebidas", description: "Con o sin gas.", img: "agua-mineral.jpg" }
];