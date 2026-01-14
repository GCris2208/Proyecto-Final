let cart = JSON.parse(localStorage.getItem('vestia_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
window.addToCart = function(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: parseFloat(product.price),
            thumbnail: product.thumbnail,
            category: product.category,
            quantity: 1
        });
    }
    saveCart();
    updateCartUI();
    console.log("Producto añadido:", product.title); 
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
};

window.updateQuantity = function(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
};

function saveCart() {
    localStorage.setItem('vestia_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    const offcanvasFooter = document.querySelector('.offcanvas-footer');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountBadge) {
        cartCountBadge.innerText = totalItems;
        cartCountBadge.style.display = totalItems > 0 ? 'block' : 'none'; 
    }
    let totalPrice = 0;
    cart.forEach(item => {
        totalPrice += parseFloat(item.price) * item.quantity;
    });
    if (cartTotalElement) {
        cartTotalElement.innerText = `$${totalPrice.toFixed(2)}`;
    }
    if (offcanvasFooter) {
        offcanvasFooter.innerHTML = `
            <div class="d-flex justify-content-between mb-3 fw-bold fs-5">
                <span>Total</span>
                <span>$${totalPrice.toFixed(2)}</span>
            </div>
            <button class="btn btn-dark w-100 rounded-pill py-3 fw-bold" 
                onclick="window.checkout()" 
                ${cart.length === 0 ? 'disabled' : ''}>
                Tramitar Pedido
            </button>
        `;
    }
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="text-center mt-5"><p class="text-secondary">Tu cesta está vacía.</p></div>';
        return;
    }

    let html = '<ul class="list-group list-group-flush">';
    cart.forEach(item => {
        html += `
            <li class="list-group-item d-flex align-items-center py-3 ps-0 pe-0">
                <img src="${item.thumbnail}" alt="${item.title}" class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                <div class="ms-3 flex-grow-1">
                    <h6 class="mb-0 fw-bold text-truncate" style="max-width: 150px;">${item.title}</h6>
                    <small class="text-muted">$${parseFloat(item.price).toFixed(2)} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-light rounded-circle border" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="mx-2 fw-bold small">${item.quantity}</span>
                    <button class="btn btn-sm btn-light rounded-circle border" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="btn btn-sm text-danger ms-2" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
            </li>
        `;
    });
    html += '</ul>';
    cartItemsContainer.innerHTML = html;
}
window.checkout = function() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        total: total.toFixed(2),
        items: cart.length,
        products: [...cart]
    };
    let user = JSON.parse(localStorage.getItem('vestia_user')) || { 
        name: "Usuario", 
        email: "", 
        orders: [] 
    };
    if (!user.orders) user.orders = [];
    user.orders.push(newOrder);
    localStorage.setItem('vestia_user', JSON.stringify(user));
    cart = [];
    saveCart();
    updateCartUI();
    const cartEl = document.getElementById('cartOffcanvas');
    const cartInstance = bootstrap.Offcanvas.getInstance(cartEl);
    if (cartInstance) cartInstance.hide();
    alert(`¡Compra realizada con éxito!\nTotal: $${total.toFixed(2)}\n\nTu pedido ha sido guardado en tu historial.`);
};