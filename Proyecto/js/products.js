let allProducts = [];
let currentFiltered = [];
let visibleCount = 12;

function traducirCategoria(input) {
    if (!input) return '';
    const termino = input.toLowerCase().trim();
    const diccionario = {
        'todo': 'all',
        'todos': 'all',
        'variado': 'all',
        'ver todo': 'all',
        'zapato': 'shoes',
        'zapatos': 'shoes',
        'zapatilla': 'shoes',
        'zapatillas': 'shoes',
        'bota': 'shoes',
        'botas': 'shoes',
        'calzado': 'shoes',
        'calzados': 'shoes',
        'franela': 'mens-shirts',
        'franelas': 'mens-shirts',
        'camisa': 'mens-shirts',
        'camisas': 'mens-shirts',
        'camiseta': 'mens-shirts',
        'camisetas': 'mens-shirts',
        'chemise': 'mens-shirts',
        'chemises': 'mens-shirts',
        'top': 'tops',
        'tops': 'tops',
        'blusa': 'tops',
        'hombre': 'mens',
        'caballero': 'mens',
        'hombres': 'mens',
        'caballeros': 'mens',
        'mujer': 'womens',
        'dama': 'womens',
        'mujeres': 'womens',
        'damas': 'womens',
        'vestido': 'dresses',
        'vestidos': 'dresses',
        'lente': 'sunglasses',
        'lentes': 'sunglasses',
        'gafas': 'sunglasses',
        'bolso': 'womens-bags',
        'bolsos': 'womens-bags',
        'cartera': 'womens-bags',
        'carteras': 'womens-bags',
        'accesorio': 'accessories',
        'accesorios': 'accessories'
    };
    const claves = Object.keys(diccionario);
    for (let i = 0; i < claves.length; i++) {
        if (claves[i].startsWith(termino)) {
            return diccionario[claves[i]];
        }
    }
    return '';
}
window.traducirCategoria = traducirCategoria;

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 12;
            renderProducts(currentFiltered, false);
        });
    }

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (term === '') {
            currentFiltered = allProducts;
            const titleEl = document.querySelector('h2');
            if(titleEl) titleEl.innerText = "Novedades";
            renderProducts(allProducts, true);
            return;
        }
        const terminoTraducido = traducirCategoria(term); 
        console.log(`Buscando: "${term}" | Traducido a: "${terminoTraducido}"`);
        const searchResults = allProducts.filter(product => {
            const titleMatch = product.title.toLowerCase().includes(term);
            const categoryMatch = product.category.toLowerCase().includes(term);
            const translatedMatch = terminoTraducido ? product.category.toLowerCase().includes(terminoTraducido) : false;
            return titleMatch || categoryMatch || translatedMatch;
        });
        const titleEl = document.querySelector('h2');
        if(titleEl) titleEl.innerText = `Resultados para: "${term}"`;
        renderProducts(searchResults, true);
    });
}
});

window.openQuickView = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    document.getElementById('modalImg').src = product.thumbnail;
    document.getElementById('modalTitle').innerText = product.title;
    document.getElementById('modalPrice').innerText = `$${product.price}`;
    document.getElementById('modalDesc').innerText = product.description || "Sin descripción disponible.";
    document.getElementById('modalCategory').innerText = product.category.replace('-', ' ');
    const ratingContainer = document.getElementById('modalRating');
    ratingContainer.innerHTML = `<i class="fa-solid fa-star"></i> ${product.rating}`;
    const addBtn = document.getElementById('modalAddToCartBtn');
    addBtn.replaceWith(addBtn.cloneNode(true));
    const newAddBtn = document.getElementById('modalAddToCartBtn');
    newAddBtn.addEventListener('click', () => {
        window.addToCart(product);
        const modalEl = document.getElementById('quickViewModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
    });
    const myModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    myModal.show();
};

async function loadProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '<div class="text-center w-100 mt-5"><div class="spinner-border" role="status"></div></div>';
    try {
        const categoryRequests = VESTIA_CONFIG.CATEGORIES.map(cat => 
            fetch(`${VESTIA_CONFIG.API_URL}/category/${cat}`).then(res => res.json())
        );
        const results = await Promise.all(categoryRequests);
        allProducts = results.flatMap(r => r.products);
        currentFiltered = allProducts;
        const user = JSON.parse(localStorage.getItem('vestia_user'));
        let recommendedCategory = null;
        if (user && user.orders && user.orders.length > 0) {
            const lastOrder = user.orders[user.orders.length - 1];
            if (lastOrder.products && lastOrder.products.length > 0) {
                recommendedCategory = lastOrder.products[0].category;
            }
        }
        renderProducts(allProducts, true);
    } catch (error) {
        console.error("Error cargando productos:", error);
        container.innerHTML = '<p class="text-center text-danger">Error al cargar el catálogo.</p>';
    }
}

function renderProducts(products, resetVisibility = false) {
    const container = document.getElementById('products-container');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (resetVisibility) {
        visibleCount = 12;
        currentFiltered = products;
    }
    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center mt-5">
                <i class="fa-solid fa-magnifying-glass fs-1 text-muted mb-3"></i>
                <h4 class="text-secondary">No encontramos productos.</h4>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }
    const toShow = products.slice(0, visibleCount);
    let html = '';
    toShow.forEach(product => {
        html += `
            <div class="col-6 col-md-4 col-lg-3 mb-4">
                <div class="card h-100 border-0 shadow-sm product-card">
                    <div class="position-relative overflow-hidden group">
                        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" 
                             style="height: 250px; object-fit: cover; cursor: pointer;"
                             onclick="openQuickView(${product.id})">
                        
                        <button class="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 shadow-sm"
                                onclick="addToCart({id: ${product.id}, title: '${product.title.replace(/'/g, "\\'")}', price: ${product.price}, thumbnail: '${product.thumbnail}', category: '${product.category}'})">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <small class="text-muted text-uppercase" style="font-size: 0.7rem;">${product.category.replace('-', ' ')}</small>
                        <h6 class="card-title fw-bold text-truncate" style="cursor: pointer;" onclick="openQuickView(${product.id})">${product.title}</h6>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <span class="fw-bold">$${product.price}</span>
                            <div class="text-warning small">
                                <i class="fa-solid fa-star"></i> ${product.rating}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    if (loadMoreBtn) {
        loadMoreBtn.style.display = (visibleCount >= products.length) ? 'none' : 'block';
    }
}
window.filterByCategory = function(categoryInput) {
    const categoryType = categoryInput.toLowerCase().trim();
    console.log("Filtro recibido:", categoryInput, "-> Procesado:", categoryType);
    if (categoryType === 'all') {
        currentFiltered = allProducts;
        renderProducts(allProducts, true);
        const titleEl = document.querySelector('h2');
        if(titleEl) titleEl.innerText = "Novedades (Todos los productos)";
        const sidebar = document.getElementById('filterSidebar');
        return;
    }
    let filtered = [];
    if (categoryType === 'mens') {
        filtered = allProducts.filter(p => p.category.startsWith('mens-'));
    }
    else if (categoryType === 'womens') {
        filtered = allProducts.filter(p => p.category.startsWith('womens-') && !p.category.includes('shoes'));
    }
    else {
        filtered = allProducts.filter(p => p.category.toLowerCase().includes(categoryType));
    }
    currentFiltered = filtered;
    visibleCount = 12;
    renderProducts(filtered, true);
    const titleEl = document.querySelector('h2'); 
    if(titleEl) {
        titleEl.innerText = "Categoría: " + categoryInput.charAt(0).toUpperCase() + categoryInput.slice(1);
    }
};

window.sortProducts = function(sortValue) {
    let sorted = [...currentFiltered];
    if (sortValue === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortValue === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortValue === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    renderProducts(sorted, true);
};