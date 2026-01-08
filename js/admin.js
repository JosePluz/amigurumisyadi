document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN Y AUTENTICACIÓN ---
    const GITHUB_CONFIG = {
        owner: 'JosePluz',
        repo: 'amigurumisyadi',
        token: '{{ secrets.ADMIN_TOKEN }}', // injected by Render
        dbPath: 'data/db.json'
    };

    const DEFAULT_DB_DATA = {
        products: [],
        messages: []
    };

    const authScreen = document.getElementById('auth-screen');
    const adminPanel = document.getElementById('admin-panel');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const passwordInput = document.getElementById('password');
    const authError = document.getElementById('auth-error');

    // Revisar sessionStorage para mantener la sesión
    if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
        showAdminPanel();
    }

    loginBtn.addEventListener('click', () => {
        // En un caso real, la contraseña no estaría hardcodeada aquí.
        if (passwordInput.value === 'yadi123') {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            showAdminPanel();
        } else {
            authError.textContent = 'Contraseña incorrecta.';
            passwordInput.value = '';
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        location.reload();
    });

    function showAdminPanel() {
        authScreen.style.display = 'none';
        adminPanel.style.display = 'block';
        loadAdminData();
    }

    // --- NAVEGACIÓN POR PESTAÑAS ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(link.dataset.tab).classList.add('active');
        });
    });

    // --- LÓGICA DE LA API DE GITHUB ---
    async function getDbFile() {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.dbPath}`;
        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` }
            });
            if (response.status === 404) {
                return { sha: null, content: DEFAULT_DB_DATA };
            }
            if (!response.ok) {
                throw new Error(`Error de GitHub: ${response.statusText}`);
            }
            const data = await response.json();
            const content = JSON.parse(atob(data.content));
            return { sha: data.sha, content };
        } catch (error) {
            console.error('Error al obtener db.json:', error);
            return null;
        }
    }

    async function updateDbFile(content, sha) {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.dbPath}`;
        const newContentBase64 = btoa(JSON.stringify(content, null, 2));

        const body = {
            message: 'chore: update content',
            content: newContentBase64,
            branch: 'main'
        };
        if (sha) {
            body.sha = sha;
        }

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al guardar en GitHub: ${errorData.message}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al actualizar db.json:', error);
            return null;
        }
    }


    // --- CARGA Y GESTIÓN DE DATOS ---
    let currentDb = { sha: null, content: DEFAULT_DB_DATA };

    async function loadAdminData() {
        const dbFile = await getDbFile();
        if (dbFile) {
            currentDb = dbFile;
            renderProductsEditor(currentDb.content.products);
            renderMessages(currentDb.content.messages);
        } else {
            // Manejar error de carga inicial
            document.getElementById('products-editor').innerHTML = '<p class="error">No se pudo cargar la base de datos.</p>';
        }
    }

    // --- PESTAÑA DE PRODUCTOS ---
    const productsEditor = document.getElementById('products-editor');
    const savePublishBtn = document.getElementById('save-publish-btn');
    const publishStatus = document.getElementById('publish-status');

    function renderProductsEditor(products) {
        if (!products || products.length === 0) {
            productsEditor.innerHTML = '<p>No hay productos para mostrar. Agrega el primero en el archivo `data/db.json`.</p>';
            return;
        }
        productsEditor.innerHTML = products.map((p, index) => `
            <div class="product-item" data-index="${index}">
                <h4>Producto ID: ${p.id}</h4>
                <label>Nombre:</label>
                <input type="text" class="product-name" value="${p.name}">
                <label>Precio:</label>
                <input type="number" step="0.01" class="product-price" value="${p.price}">
                <label>Descripción:</label>
                <textarea class="product-description">${p.description}</textarea>
                <label>URL de Imagen:</label>
                <input type="text" class="product-imageUrl" value="${p.imageUrl}">
            </div>
        `).join('');
    }

    savePublishBtn.addEventListener('click', async () => {
        publishStatus.textContent = 'Guardando y publicando...';
        publishStatus.className = '';

        // Recolectar datos del editor
        const updatedProducts = [];
        document.querySelectorAll('#products-editor .product-item').forEach(item => {
            const product = currentDb.content.products[item.dataset.index];
            product.name = item.querySelector('.product-name').value;
            product.price = parseFloat(item.querySelector('.product-price').value);
            product.description = item.querySelector('.product-description').value;
            product.imageUrl = item.querySelector('.product-imageUrl').value;
            updatedProducts.push(product);
        });
        
        const newDbContent = { ...currentDb.content, products: updatedProducts };
        
        // Si no hay SHA, significa que el archivo no existe y se creará
        if (currentDb.sha === null) {
            console.log("El archivo data/db.json no existe. Se creará antes del commit.");
        }

        const result = await updateDbFile(newDbContent, currentDb.sha);

        if (result) {
            publishStatus.textContent = '¡Cambios guardados y publicados con éxito!';
            publishStatus.className = 'success';
            // Actualizar el SHA local para el próximo guardado
            currentDb.sha = result.content.sha;
            currentDb.content = newDbContent;
        } else {
            publishStatus.textContent = 'Error al publicar los cambios.';
            publishStatus.className = 'error';
        }
    });

    // --- PESTAÑA DE MENSAJES ---
    const messagesList = document.getElementById('messages-list');
    const clearMessagesBtn = document.getElementById('clear-messages-btn');

    function renderMessages(messages) {
        if (!messages || messages.length === 0) {
            messagesList.innerHTML = '<p class="no-messages">No hay mensajes nuevos.</p>';
            clearMessagesBtn.style.display = 'none';
        } else {
            messagesList.innerHTML = messages.map(msg => `
                <div class="message-item">
                    <p class="message-meta"><strong>De:</strong> ${msg.name} (${msg.email})</p>
                    <p>${msg.message}</p>
                </div>
            `).join('');
            clearMessagesBtn.style.display = 'block';
        }
    }
    
    clearMessagesBtn.addEventListener('click', async () => {
       if (confirm('¿Estás seguro de que quieres borrar todos los mensajes? Esta acción no se puede deshacer.')) {
           const newDbContent = { ...currentDb.content, messages: [] };
           const result = await updateDbFile(newDbContent, currentDb.sha);
           if (result) {
               alert('Mensajes eliminados con éxito.');
               currentDb.sha = result.content.sha;
               currentDb.content = newDbContent;
               renderMessages([]);
           } else {
               alert('Error al eliminar los mensajes.');
           }
       } 
    });
});
