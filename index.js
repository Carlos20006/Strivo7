document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    
    // Función para actualizar el carrito en la UI
    function updateCartUI() {
        const cartItemsElement = document.getElementById('cartItems');
        const cartCountElement = document.getElementById('cartCount');
        const cartTotalElement = document.getElementById('cartTotal');
        
        // Actualizar contador
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Actualizar lista de items
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<p class="text-muted">Tu carrito está vacío</p>';
            cartTotalElement.textContent = 'Total: $0 COP';
            return;
        }
        
        cartItemsElement.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace(/\./g, '').replace(',', '.'));
            const itemTotal = price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h6>${item.name}</h6>
                    <small>Talla: ${item.size} | Cantidad: ${item.quantity}</small>
                    <p>$${(itemTotal).toLocaleString('es-CO')} COP</p>
                </div>
                <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            cartItemsElement.appendChild(itemElement);
        });
        
        // Actualizar total
        cartTotalElement.textContent = `Total: $${total.toLocaleString('es-CO')} COP`;
        
        // Añadir event listeners para los botones de eliminar
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    }
    
    // Función para añadir productos al carrito
    const addToCartButtons = document.querySelectorAll('.modal .btn-danger');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            const productId = modal.id.replace('productModal', '');
            
            const product = {
                id: productId,
                name: modal.querySelector('.modal-title').textContent,
                price: modal.querySelector('.text-danger').textContent.replace('$', '').trim(),
                size: modal.querySelector('select').value,
                quantity: parseInt(modal.querySelector('input[type="number"]').value),
                image: modal.querySelector('img').src
            };
            
            // Validar que se haya seleccionado una talla
            if (product.size === 'Selecciona tu talla') {
                alert('Por favor, selecciona una talla');
                return;
            }
            
            // Verificar si el producto ya está en el carrito
            const existingItemIndex = cart.findIndex(item => 
                item.id === product.id && item.size === product.size
            );
            
            if (existingItemIndex !== -1) {
                // Si ya existe, actualizar la cantidad
                cart[existingItemIndex].quantity += product.quantity;
            } else {
                // Si no existe, añadirlo al carrito
                cart.push(product);
            }
            
            updateCartUI();
            
            // Mostrar feedback al usuario
            const toast = document.createElement('div');
            toast.className = 'position-fixed bottom-0 end-0 p-3';
            toast.style.zIndex = '11';
            toast.innerHTML = `
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Strivo</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        Producto añadido al carrito
                    </div>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Ocultar el toast después de 3 segundos
            setTimeout(() => {
                toast.remove();
            }, 3000);
            
            // Cerrar el modal
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        });
    });
    
    // Función para validar el formulario de suscripción
    const subscriptionForm = document.querySelector('.subscription-section form');
    
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('emailSubscription').value;
            const privacyCheck = document.getElementById('privacyCheck').checked;
            
            if (!email || !privacyCheck) {
                alert('Por favor, completa todos los campos requeridos.');
                return;
            }
            
            alert('¡Gracias por suscribirte a nuestra newsletter!');
            this.reset();
        });
    }
    
    // Event listeners para los botones del carrito
    document.getElementById('viewCart')?.addEventListener('click', function() {
        alert('Funcionalidad de "Ver Carrito" en desarrollo');
    });
    
    document.getElementById('checkout')?.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        alert('Procediendo al pago...');
        // Aquí iría la lógica para redirigir al checkout
    });
    
    // Mostrar/ocultar el dropdown del carrito
    const cartIcon = document.getElementById('cartIcon');
    const cartDropdown = document.getElementById('cartDropdown');
    
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
    });
    
    // Cerrar el dropdown al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.style.display = 'none';
        }
    });
});