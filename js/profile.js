const defaultUser = {
    name: "Usuario",
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
    const headerName = document.getElementById('headerUserName');

    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";
    if (styleInput) styleInput.value = user.style || "casual";
    if (sizeInput) sizeInput.value = user.size || "M";
    if (headerName) headerName.innerText = user.name || "Usuario VestIA";
    actualizarInsigniaDeEstilo(user.orders);
    renderOrderHistory(user.orders);
    updateNavDisplay(user);
}
window.saveProfile = function() {
    let user = JSON.parse(localStorage.getItem('vestia_user')) || defaultUser;
    user.name = document.getElementById('profileName').value;
    user.email = document.getElementById('profileEmail').value;
    user.style = document.getElementById('profileStyle').value;
    user.size = document.getElementById('profileSize').value;
    localStorage.setItem('vestia_user', JSON.stringify(user));
    document.getElementById('headerUserName').innerText = user.name;
    updateNavDisplay(user);
    alert("¡Perfil actualizado correctamente!");
};

function actualizarInsigniaDeEstilo(orders) {
    const badgeEl = document.getElementById('styleBadge');
    if (!badgeEl) return;

    if (!orders || orders.length === 0) {
        badgeEl.innerHTML = '<i class="fa-solid fa-seedling"></i> Nuevo Cliente';
        badgeEl.className = "badge bg-light text-dark mt-2 rounded-pill px-3 py-2 shadow-sm";
        return;
    }
    let stats = {
        mens: 0,
        womens: 0,
        shoes: 0,
        accessories: 0
    };
    orders.forEach(order => {
        order.products.forEach(prod => {
            const cat = prod.category.toLowerCase();
            if (cat.includes('shoes') || cat.includes('sneakers') || cat.includes('boots')) {
                stats.shoes++;
            }
            else if (cat.includes('women') || cat.includes('dress') || cat === 'tops' || cat.includes('skirt')) {
                stats.womens++;
            }
            else if (cat.includes('men') && !cat.includes('women')) { 
                stats.mens++;
            }
            else if (cat.includes('sunglasses') || cat.includes('bag') || cat.includes('jewel') || cat.includes('watch')) {
                stats.accessories++;
            }
        });
    });
    console.log("Estadísticas de estilo:", stats); 
    let maxCategory = 'neutral';
    let maxCount = -1;
    for (const [key, value] of Object.entries(stats)) {
        if (value > maxCount) {
            maxCount = value;
            maxCategory = key;
        }
    }
    if (maxCount === 0) maxCategory = 'neutral';
    let titulo = "Amante de la Moda";
    let icono = "fa-heart";
    let claseColor = "bg-light text-dark";
    switch (maxCategory) {
        case 'mens':
            titulo = "Estilo Caballero";
            icono = "fa-user-tie";
            claseColor = "bg-primary text-white";
            break;
        case 'womens':
            titulo = "Estilo Dama";
            icono = "fa-person-dress";
            claseColor = "bg-danger text-white";
            break;
        case 'shoes':
            titulo = "Sneakerhead"; 
            icono = "fa-shoe-prints";
            claseColor = "bg-warning text-dark";
            break;
        case 'accessories':
            titulo = "Detallista";
            icono = "fa-gem";
            claseColor = "bg-info text-dark";
            break;
        case 'neutral':
        default:
            titulo = "Explorador de Estilos";
            icono = "fa-layer-group";
            claseColor = "bg-secondary text-white";
            break;
    }
    badgeEl.className = `badge ${claseColor} mt-2 rounded-pill px-3 py-2 shadow-sm`;
    badgeEl.innerHTML = `<i class="fa-solid ${icono}"></i> ${titulo}`;
}

function renderOrderHistory(orders) {
    const container = document.getElementById('orders-history');
    if (!container) return;
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fa-solid fa-basket-shopping fa-2x mb-2 opacity-25"></i>
                <p class="small">Aún no has realizado compras.</p>
                <button class="btn btn-sm btn-outline-dark mt-2" data-bs-dismiss="modal" onclick="window.location.href='#catalogo'">Ir a comprar</button>
            </div>`;
        return;
    }
    let html = '<div class="list-group list-group-flush">';
    orders.slice().reverse().forEach((order, index) => {
        const dateObj = new Date(order.date);
        const dateStr = dateObj.toLocaleDateString();
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const realOrderNumber = orders.length - index;
        html += `
            <div class="list-group-item px-0 py-3 border-bottom">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <span class="fw-bold text-dark">Pedido #${1000 + realOrderNumber}</span>
                        <div class="small text-muted">
                            <i class="fa-regular fa-calendar me-1"></i> ${dateStr} 
                            <span class="mx-1">•</span> ${timeStr}
                        </div>
                    </div>
                    <span class="badge bg-dark rounded-pill">$${order.total}</span>
                </div>
                <div class="d-flex gap-2 mt-2 overflow-auto" style="scrollbar-width: none;">
                    ${order.products.map(p => `
                        <img src="${p.thumbnail}" 
                             alt="${p.title}" 
                             class="rounded border" 
                             style="width: 40px; height: 40px; object-fit: cover;" 
                             title="${p.title}">
                    `).join('')}
                </div>
                <div class="mt-2 small text-muted">
                    ${order.items} artículo${order.items > 1 ? 's' : ''}
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}
function updateNavDisplay(user) {
}