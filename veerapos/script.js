/* Data */
const services = [
    { id: 1, name: "Passport Photo", category: "Photo", price: 100, icon: "📸" },
    { id: 2, name: "Nike Air Max", category: "Shoes", price: 7800, icon: "👟" }, // Demo item from UI image
    { id: 3, name: "Wedding Album", category: "Design", price: 5000, icon: "📖" },
    { id: 4, name: "IPhone 14", category: "Mobile", price: 15800, icon: "📱" }, // Demo item from UI image
    { id: 5, name: "Banner Design", category: "Design", price: 50, icon: "🎨" },
    { id: 6, name: "Flex Print", category: "Print", price: 250, icon: "🖨️" },
    { id: 7, name: "Visiting Card", category: "Design", price: 800, icon: "🎫" },
    { id: 8, name: "MacBook Pro", category: "Computer", price: 125000, icon: "💻" }, // Demo item
];

let cart = [];
let taxRate = 18;
let discountPercent = 0;

/* Elements */
const grid = document.getElementById('services-grid');
const cartWrapper = document.getElementById('cart-items-wrapper');
const subtotalEl = document.getElementById('subtotal-display');
const taxEl = document.getElementById('tax-display');
const totalEl = document.getElementById('total-display');
const searchInput = document.getElementById('search-input');
const discountInput = document.getElementById('discount-input');
const catPills = document.querySelectorAll('.cat-pill');

/* Init */
function init() {
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    renderGrid(services);
    renderCart();

    // Category Filter Logic
    catPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active class from all
            catPills.forEach(p => p.classList.remove('active'));
            // Add to clicked
            pill.classList.add('active');

            const cat = pill.dataset.cat;
            if (cat === 'all') {
                renderGrid(services);
            } else {
                const filtered = services.filter(s => s.category === cat);
                renderGrid(filtered);
            }
        });
    });
}

/* Render Grid */
function renderGrid(dataset) {
    grid.innerHTML = '';
    dataset.forEach(item => {
        const div = document.createElement('div');
        div.className = 'service-card';
        div.onclick = (e) => {
            if (!e.target.closest('.card-step-btn')) addToCart(item); // Don't double add if clicking stepper (if we had logic there)
        };

        div.innerHTML = `
            <div class="card-img-placeholder">${item.icon}</div>
            <div class="card-info">
                <span class="card-cat">${item.category}</span>
                <h3 class="card-title">${item.name}</h3>
            </div>
            <div class="card-footer">
                <span class="card-price">₹${item.price}</span>
                <div class="card-stepper">
                    <button class="card-step-btn">-</button>
                    <span class="card-step-val">1</span>
                    <button class="card-step-btn">+</button>
                </div>
            </div>
        `;
        grid.appendChild(div);
    });
}

/* Cart Logic */
function addToCart(item) {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
        existing.qty++;
    } else {
        // Init with item price if no custom price set
        cart.push({ ...item, qty: 1, customPrice: item.price });
    }
    renderCart();
}

function updateQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== id);
    }
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    renderCart();
}

let currentEditId = null;

function openPriceModal(id) {
    const item = cart.find(c => c.id === id);
    if (!item) return;

    currentEditId = id;
    document.getElementById('edit-price-input').value = item.customPrice;
    document.getElementById('price-modal').classList.remove('hidden');
    document.getElementById('edit-price-input').focus();
}

function savePrice() {
    if (currentEditId === null) return;

    const newPrice = parseFloat(document.getElementById('edit-price-input').value);
    if (!isNaN(newPrice) && newPrice >= 0) {
        const item = cart.find(c => c.id === currentEditId);
        if (item) {
            item.customPrice = newPrice;
            renderCart();
        }
    }
    document.getElementById('price-modal').classList.add('hidden');
    currentEditId = null;
}

function renderCart() {
    cartWrapper.innerHTML = '';

    if (cart.length === 0) {
        cartWrapper.innerHTML = '<div class="empty-cart-msg" style="text-align:center; color:#ccc; padding:2rem;">Cart is empty</div>';
    }

    cart.forEach(item => {
        const el = document.createElement('div');
        el.className = 'cart-item';
        // Use customPrice for calculation
        const itemPrice = item.customPrice !== undefined ? item.customPrice : item.price;

        el.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-del" onclick="removeFromCart(${item.id})">🗑️</span>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>
                        ₹${itemPrice} 
                        <span class="edit-icon" onclick="openPriceModal(${item.id})" title="Edit Price">✎</span>
                    </p>
                </div>
            </div>
            <div class="cart-controls">
                <div class="cart-stepper">
                    <button class="cart-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span class="cart-val">${item.qty}</span>
                    <button class="cart-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
                <span class="cart-price">₹${itemPrice * item.qty}</span>
            </div>
        `;
        cartWrapper.appendChild(el);
    });

    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((acc, item) => {
        const price = item.customPrice !== undefined ? item.customPrice : item.price;
        return acc + (price * item.qty);
    }, 0);

    const tax = subtotal * (taxRate / 100);

    // Discount input is percent in this logic
    const discountVal = parseFloat(discountInput.value) || 0;
    const discountAmt = subtotal * (discountVal / 100);

    const total = subtotal + tax - discountAmt;

    subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    taxEl.textContent = `₹${tax.toFixed(2)}`;
    totalEl.textContent = `₹${total.toFixed(2)}`;
}

/* Listeners */
document.getElementById('save-price-btn').addEventListener('click', savePrice);
document.getElementById('close-price-modal').addEventListener('click', () => {
    document.getElementById('price-modal').classList.add('hidden');
});

// Allow Enter key to save price
document.getElementById('edit-price-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') savePrice();
});

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = services.filter(s => s.name.toLowerCase().includes(term));
    renderGrid(filtered);
});

discountInput.addEventListener('input', updateTotals);

document.getElementById('clear-cart-btn').addEventListener('click', () => {
    cart = [];
    renderCart();
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    // Populate Modal
    const custName = document.getElementById('customer-name').value || 'Guest';
    document.getElementById('inv-customer').textContent = custName;

    const tbody = document.getElementById('inv-body');
    tbody.innerHTML = '';
    cart.forEach(item => {
        const itemPrice = item.customPrice !== undefined ? item.customPrice : item.price;
        tbody.innerHTML += `<tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>₹${itemPrice * item.qty}</td>
        </tr>`;
    });

    document.getElementById('inv-total').textContent = totalEl.textContent;

    document.getElementById('invoice-modal').classList.remove('hidden');
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('invoice-modal').classList.add('hidden');
});

init();
