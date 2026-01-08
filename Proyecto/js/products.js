let allProducts = [];
let currentFiltered = [];
let visibleCount = 12;

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
            const searchResults = allProducts.filter(product => 
                product.title.toLowerCase().includes(term) || 
                product.category.toLowerCase().replace('-', ' ').includes(term)
            );
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
window.filterByCategory = function(categoryType) {
    let filtered = [];
    if (categoryType === 'all' || categoryType === 'novedades') filtered = allProducts;
    else if (categoryType === 'franelas') filtered = allProducts.filter(p => p.category === 'mens-shirts' || p.category === 'tops');
    else if (categoryType === 'tops') filtered = allProducts.filter(p => p.category === 'tops');
    else if (categoryType === 'mens') filtered = allProducts.filter(p => p.category.startsWith('mens-'));
    else if (categoryType === 'womens') filtered = allProducts.filter(p => p.category.startsWith('womens-') || p.category === 'tops');
    else if (categoryType === 'accessories') filtered = allProducts.filter(p => p.category === 'sunglasses' || p.category === 'womens-bags');
    else if (categoryType === 'dresses') filtered = allProducts.filter(p => p.category === 'womens-dresses');
    else if (categoryType === 'shoes') filtered = allProducts.filter(p => p.category.includes('shoes'));
    const titleEl = document.querySelector('h2'); 
    if(titleEl) titleEl.innerText = categoryType === 'all' ? "Catálogo Completo" : categoryType.toUpperCase();
    renderProducts(filtered, true);
};

window.sortProducts = function(sortValue) {
    let sorted = [...currentFiltered];
    if (sortValue === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sortValue === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sortValue === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    renderProducts(sorted, true);
};