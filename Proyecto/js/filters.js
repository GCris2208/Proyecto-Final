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
            if (window.filterByCategory) {
                if (text.includes('vestidos')) window.filterByCategory('dresses');
                else if (text.includes('tops')) window.filterByCategory('tops');
                else if (text.includes('zapatos')) window.filterByCategory('shoes');
                else if (text.includes('franelas')) window.filterByCategory('franelas');
                else if (text.includes('todos')) window.filterByCategory('todos');
                else if (text.includes('bolsos')) window.filterByCategory('accessories');
            }
        });
    });
});