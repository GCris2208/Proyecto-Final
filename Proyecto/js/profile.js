const defaultUser = {
    name: "",
    email: "",
    style: "casual",
    size: "M",
    orders: []
};
document.addEventListener('DOMContentLoaded', () => {
    loadProfileUI();
});
function loadProfileUI() {
    const user = JSON.parse(localStorage.getItem('vestia_user')) || defaultUser;
    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    const styleInput = document.getElementById('profileStyle');
    const sizeInput = document.getElementById('profileSize');
    if (nameInput) nameInput.value = user.name;
    if (emailInput) emailInput.value = user.email;
    if (styleInput) styleInput.value = user.style;
    if (sizeInput) sizeInput.value = user.size;
    updateNavDisplay(user);
    renderOrderHistory(user.orders);
}
window.saveProfile = function() {
    const user = JSON.parse(localStorage.getItem('vestia_user')) || defaultUser;
    user.name = document.getElementById('profileName').value;
    user.email = document.getElementById('profileEmail').value;
    user.style = document.getElementById('profileStyle').value;
    user.size = document.getElementById('profileSize').value;
    localStorage.setItem('vestia_user', JSON.stringify(user));
    updateNavDisplay(user);
    alert("¡Perfil actualizado correctamente!");
}
function updateNavDisplay(user) {
    const navUserBtn = document.getElementById('user-menu-btn');
    if (navUserBtn && user.name) {
        navUserBtn.innerHTML = `<i class="fa-solid fa-user me-1"></i> ${user.name.split(' ')[0]}`;
    }
}
function renderOrderHistory(orders) {
    const container = document.getElementById('orders-history');
    if (!container) return;
    if (!orders || orders.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-3">Aún no has realizado compras.</p>';
        return;
    }
    let html = '<ul class="list-group list-group-flush">';
    orders.slice().reverse().forEach((order, index) => {
        const date = new Date(order.date).toLocaleDateString();
        html += `
            <li class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fw-bold">Pedido #${1000 + (orders.length - index)}</span>
                        <br>
                        <small class="text-muted">${date} - ${order.items} artículos</small>
                    </div>
                    <span class="badge bg-dark rounded-pill">$${order.total}</span>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}
window.checkout = function() {
    let cart = JSON.parse(localStorage.getItem('vestia_cart')) || [];
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    const user = JSON.parse(localStorage.getItem('vestia_user')) || defaultUser;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder = {
        date: new Date(),
        items: cart.length,
        total: total.toFixed(2),
        products: cart
    };
    user.orders.push(newOrder);
    localStorage.setItem('vestia_user', JSON.stringify(user));
    localStorage.removeItem('vestia_cart');
    alert("¡Compra realizada con éxito! Actualizando recomendaciones...");
    window.location.reload(); 
};