document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sortFilter');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            if (window.sortProducts) window.sortProducts(e.target.value);
        });
    }
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const text = e.target.innerText.toLowerCase().trim();
            if (window.filterByCategory) {
                if (text.includes('hombre')) window.filterByCategory('mens');
                else if (text.includes('mujer')) window.filterByCategory('womens');
                else if (text.includes('accesorios')) window.filterByCategory('accessories');
                else window.filterByCategory('all');
            }
        });
    });
    const sidebarLinks = document.querySelectorAll('#filterSidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const text = e.target.innerText.toLowerCase().trim();
            sidebarLinks.forEach(l => l.classList.remove('fw-bold', 'text-primary'));
            e.target.classList.add('fw-bold', 'text-primary');
            if (window.filterByCategory) {
                if (text.includes('vestidos')) window.filterByCategory('dresses');
                else if (text.includes('tops')) window.filterByCategory('tops');
                else if (text.includes('zapatos')) window.filterByCategory('shoes');
                else if (text.includes('franelas')) window.filterByCategory('franelas');
                else if (text.includes('todos')) window.filterByCategory('all');
                else if (text.includes('bolsos')) window.filterByCategory('accessories');
            }
        });
    });
    const toggleBtn = document.getElementById('toggleFilters');
    const filterList = document.getElementById('filterSidebar');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const sidebarContainer = toggleBtn.closest('.col-lg-3');
            const listGroup = sidebarContainer.querySelector('.list-group');
            
            if (listGroup) {
                if (listGroup.style.display === 'none') {
                    listGroup.style.display = 'block';
                    toggleBtn.innerHTML = '<i class="fa-solid fa-angle-left"></i> Ocultar filtros';
                } else {
                    listGroup.style.display = 'none';
                    toggleBtn.innerHTML = '<i class="fa-solid fa-angle-right"></i> Mostrar filtros';
                }
            }
        });
    }
});