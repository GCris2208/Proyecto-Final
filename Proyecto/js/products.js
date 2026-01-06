let allProducts = [];
let currentPage = 1;
const itemsPerPage = 12;
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});


async function loadProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '<div class="text-center w-100 mt-5"><div class="spinner-border" role="status"></div></div>';
    try {
        const categoryRequests = VESTIA_CONFIG.CATEGORIES.map(cat => 
            fetch(`${VESTIA_CONFIG.API_URL}/category/${cat}`).then(res => res.json())
        );
        const results = await Promise.all(categoryRequests);
        allProducts = results.flatMap(r => r.products);
        allProducts.sort(() => Math.random() - 0.5);
        renderProducts(allProducts);
    } catch (error) {
        console.error("Error cargando productos:", error);
        container.innerHTML = '<p class="text-center text-danger">Lo sentimos, hubo un error cargando el catálogo.</p>';
    }
}

function renderProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = products.slice(start, end);

    if (paginatedProducts.length === 0) {
        container.innerHTML = '<p class="text-center w-100">No se encontraron productos.</p>';
        return;
    }

    paginatedProducts.forEach(product => {
        const productCard = `
            <div class="col fade-in">
                <div class="card h-100 border-0 product-card" onclick="verDetalle(${product.id})">
                    <div class="bg-light position-relative mb-3 overflow-hidden" style="aspect-ratio: 1/1;">
                        <img src="${product.thumbnail}" class="img-fluid w-100 h-100 object-fit-cover" alt="${product.title}">
                        <button class="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 shadow-sm p-2 fav-btn" 
                                onclick="event.stopPropagation(); toggleFav(this)">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                        <button class="btn btn-dark position-absolute bottom-0 start-0 m-3 btn-sm rounded-pill px-3 fw-bold add-cart-btn"
                                onclick="event.stopPropagation(); addToCart(${product.id})">
                            + Agregar
                        </button>
                    </div>
                    <div class="card-body p-0">
                        <h5 class="card-title fw-bold fs-6 mb-1 text-truncate">${product.title}</h5>
                        <p class="card-text text-secondary small mb-2 text-uppercase">${product.category}</p>
                        <p class="card-text fw-bold">$${product.price}</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });

    updatePaginationControls();
}

function updatePaginationControls() {
    // Aquí puedes implementar lógica para actualizar botones "Anterior" y "Siguiente"
    // Por ahora, implementaremos un "Cargar Más" estilo botón si lo prefieres, o paginación clásica.
    // Dejaremos preparado el terreno.
}

function addToCart(id) {
    console.log("Añadido al carrito el objeto: ", id);
}

function toggleFav(btn) {
    const icon = btn.querySelector('i');
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
    icon.classList.toggle('text-danger');
}

function verDetalle(id) {
    console.log("Ver detalle:", id);
    // Opcional: Modal de detalle
}