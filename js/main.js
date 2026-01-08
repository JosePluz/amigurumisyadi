document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'data/db.json';

    // Cargar productos en la página principal
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                const products = data.products;
                productsGrid.innerHTML = products.map(product => `
                    <div class="product-card">
                        <img src="public/${product.imageUrl}" alt="${product.name}" loading="lazy">
                        <div class="product-card-content">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <div class="price">€${product.price.toFixed(2)}</div>
                        </div>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
                productsGrid.innerHTML = '<p>No se pudieron cargar las creaciones en este momento.</p>';
            });
    }

    // Gestionar formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const responseEl = document.getElementById('form-response');
            responseEl.textContent = 'Enviando...';
            
            // Simulación de envío. En un proyecto real, se enviaría a un backend.
            // Para este caso, solo mostramos un mensaje de éxito.
            setTimeout(() => {
                responseEl.textContent = '¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.';
                responseEl.style.color = 'green';
                contactForm.reset();
            }, 1000);
            
            // Nota: La lógica para guardar mensajes en db.json está en admin.js,
            // ya que este script no tiene permisos para escribir archivos.
        });
    }
});
