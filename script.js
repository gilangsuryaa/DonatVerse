// ===============================================
// DONUT SHOP - MAIN JAVASCRIPT
// ===============================================

// ===============================================
// SHOPPING CART FUNCTIONALITY
// ===============================================

class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
        this.updateCartCount();
    }

    // Add item to cart
    addItem(name, price) {
        const existingItem = this.items.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        this.saveToStorage();
        this.updateCartCount();
        this.showNotification(`${name} ditambahkan ke keranjang!`);
    }

    // Remove item from cart
    removeItem(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.saveToStorage();
        this.updateCartCount();
    }

    // Get total items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Get total price
    getTotalPrice() {
        return this.items.reduce((total, item) => {
            const price = parseInt(item.price.replace(/\D/g, ''));
            return total + (price * item.quantity);
        }, 0);
    }

    // Update cart count display
    updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.getTotalItems();
        }
    }

    // Save to localStorage
    saveToStorage() {
        localStorage.setItem('donutCart', JSON.stringify(this.items));
    }

    // Load from localStorage
    loadFromStorage() {
        const savedCart = localStorage.getItem('donutCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// ===============================================
// ADD TO CART BUTTONS
// ===============================================

function initializeCartButtons() {
    const addToCartButtons = document.querySelectorAll('.btn-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info from card
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // Add to cart
            cart.addItem(productName, productPrice);
            
            // Button animation
            this.textContent = '✓ DITAMBAHKAN';
            this.style.background = '#28a745';
            
            setTimeout(() => {
                this.textContent = 'ADD TO CART';
                this.style.background = '';
            }, 2000);
        });
    });
}

// ===============================================
// SMOOTH SCROLL NAVIGATION
// ===============================================

function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a, .footer-column a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an anchor link
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===============================================
// ORDER FORM HANDLING
// ===============================================

function initializeOrderForm() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(orderForm);
            const formValues = {};
            
            // Collect all form values
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            // Show success message
            showOrderSuccess();
            
            // Reset form
            orderForm.reset();
            
            // Log order (in real app, this would send to server)
            console.log('Order submitted:', formValues);
            console.log('Cart items:', cart.items);
        });
    }
}

function showOrderSuccess() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 500px;
        animation: scaleIn 0.3s ease-out;
    `;
    
    modalContent.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 20px;">✓</div>
        <h2 style="color: #28a745; margin-bottom: 15px;">Pesanan Berhasil!</h2>
        <p style="color: #666; margin-bottom: 25px;">
            Terima kasih telah memesan. Kami akan segera menghubungi Anda untuk konfirmasi.
        </p>
        <button onclick="this.closest('div').parentElement.remove()" 
                style="background: #dc143c; color: white; border: none; 
                       padding: 12px 30px; border-radius: 25px; 
                       cursor: pointer; font-weight: 600;">
            Tutup
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===============================================
// NEWSLETTER FORM
// ===============================================

function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Show success notification
            showNewsletterSuccess(email);
            
            // Reset form
            emailInput.value = '';
        });
    }
}

function showNewsletterSuccess(email) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInBottom 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <strong>Berhasil!</strong><br>
        ${email} telah berlangganan newsletter kami.
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutBottom 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===============================================
// SCROLL ANIMATIONS
// ===============================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards
    const animatedElements = document.querySelectorAll(
        '.product-card, .service-card, .celebrate-card, .signup-card'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

// ===============================================
// NAVBAR SCROLL EFFECT
// ===============================================

function initializeNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===============================================
// ADD ANIMATION KEYFRAMES
// ===============================================

function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @keyframes slideInBottom {
            from {
                transform: translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutBottom {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100px);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0.8);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===============================================
// INITIALIZE ALL FEATURES
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🍩 Donut Shop Website Loaded!');
    
    // Initialize all features
    addAnimationStyles();
    initializeCartButtons();
    initializeSmoothScroll();
    initializeOrderForm();
    initializeNewsletterForm();
    initializeScrollAnimations();
    initializeNavbarScroll();
    initializeCartButton();
    
    console.log('✓ All features initialized successfully!');
});

// ===============================================
// EXPORT FOR EXTERNAL USE
// ===============================================

window.DonutShop = {
    cart: cart,
    showCartModal: showCartModal,
    showOrderSuccess: showOrderSuccess
};