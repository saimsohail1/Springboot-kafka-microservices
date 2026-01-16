// API Endpoints - Update these with your actual LoadBalancer URLs
const API_ENDPOINTS = {
    orders: 'http://adbcc4910f30149629bc3991c571aee6-1543059616.eu-west-1.elb.amazonaws.com/api/orders',
    inventory: 'http://a455119ef7ba44a87a6f2ed068ee6e08-2053129880.eu-west-1.elb.amazonaws.com/api/inventory',
    payments: 'http://a187a4efb141449dfa3b9194b3abd9f5-650600510.eu-west-1.elb.amazonaws.com/api/payments'
};

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');

    // Load data for the tab
    if (tabName === 'orders') {
        loadOrders();
    } else if (tabName === 'inventory') {
        loadInventory();
    } else if (tabName === 'payments') {
        loadPayments();
    }
}

// Load Orders
async function loadOrders() {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading orders...</td></tr>';

    try {
        const response = await fetch(API_ENDPOINTS.orders);
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const orders = await response.json();
        
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id.substring(0, 8)}...</td>
                <td>${order.productId || 'N/A'}</td>
                <td>${order.quantity}</td>
                <td>$${order.price.toFixed(2)}</td>
                <td>$${(order.quantity * order.price).toFixed(2)}</td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="loading" style="color: #e74c3c;">Error: ${error.message}</td></tr>`;
        console.error('Error loading orders:', error);
    }
}

// Load Inventory
async function loadInventory() {
    const tbody = document.getElementById('inventory-tbody');
    tbody.innerHTML = '<tr><td colspan="2" class="loading">Loading inventory...</td></tr>';

    try {
        const response = await fetch(API_ENDPOINTS.inventory);
        if (!response.ok) throw new Error('Failed to fetch inventory');
        
        const inventory = await response.json();
        
        if (inventory.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" class="loading">No inventory items found</td></tr>';
            return;
        }

        tbody.innerHTML = inventory.map(item => `
            <tr>
                <td>${item.productId || 'N/A'}</td>
                <td>${item.availableQuantity || 0}</td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="2" class="loading" style="color: #e74c3c;">Error: ${error.message}</td></tr>`;
        console.error('Error loading inventory:', error);
    }
}

// Load Payments
async function loadPayments() {
    const tbody = document.getElementById('payments-tbody');
    tbody.innerHTML = '<tr><td colspan="4" class="loading">Loading payments...</td></tr>';

    try {
        const response = await fetch(API_ENDPOINTS.payments);
        if (!response.ok) throw new Error('Failed to fetch payments');
        
        const payments = await response.json();
        
        if (payments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="loading">No payments found</td></tr>';
            return;
        }

        tbody.innerHTML = payments.map(payment => `
            <tr>
                <td>${payment.id ? payment.id.substring(0, 8) + '...' : 'N/A'}</td>
                <td>${payment.orderId ? payment.orderId.substring(0, 8) + '...' : 'N/A'}</td>
                <td>$${payment.amount ? payment.amount.toFixed(2) : '0.00'}</td>
                <td><span class="status-badge ${payment.status ? payment.status.toLowerCase() : 'pending'}">${payment.status || 'Pending'}</span></td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="loading" style="color: #e74c3c;">Error: ${error.message}</td></tr>`;
        console.error('Error loading payments:', error);
    }
}

// Create Order Modal
function showCreateOrderModal() {
    document.getElementById('create-order-modal').style.display = 'block';
}

function closeCreateOrderModal() {
    document.getElementById('create-order-modal').style.display = 'none';
    document.getElementById('create-order-form').reset();
}

// Create Order
async function createOrder(event) {
    event.preventDefault();
    
    const formData = {
        productId: document.getElementById('productId').value,
        quantity: parseInt(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('price').value)
    };

    try {
        const response = await fetch(API_ENDPOINTS.orders, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create order');
        }

        const order = await response.json();
        alert(`Order created successfully! ID: ${order.id.substring(0, 8)}...`);
        
        closeCreateOrderModal();
        loadOrders();
        
        // Refresh inventory and payments after order creation
        setTimeout(() => {
            loadInventory();
            loadPayments();
        }, 2000);
    } catch (error) {
        alert(`Error creating order: ${error.message}`);
        console.error('Error creating order:', error);
    }
}

// Create Inventory Modal
function showCreateInventoryModal() {
    document.getElementById('create-inventory-modal').style.display = 'block';
}

function closeCreateInventoryModal() {
    document.getElementById('create-inventory-modal').style.display = 'none';
    document.getElementById('create-inventory-form').reset();
}

// Create Inventory Item
async function createInventoryItem(event) {
    event.preventDefault();
    
    const formData = {
        productId: document.getElementById('inv-productId').value,
        availableQuantity: parseInt(document.getElementById('availableQuantity').value)
    };

    try {
        const response = await fetch(API_ENDPOINTS.inventory, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create inventory item');
        }

        const item = await response.json();
        alert(`Inventory item created successfully! Product: ${item.productId}`);
        
        closeCreateInventoryModal();
        loadInventory();
    } catch (error) {
        alert(`Error creating inventory item: ${error.message}`);
        console.error('Error creating inventory item:', error);
    }
}

// Create Payment Modal
function showCreatePaymentModal() {
    document.getElementById('create-payment-modal').style.display = 'block';
}

function closeCreatePaymentModal() {
    document.getElementById('create-payment-modal').style.display = 'none';
    document.getElementById('create-payment-form').reset();
}

// Create Payment
async function createPayment(event) {
    event.preventDefault();
    
    const orderId = document.getElementById('payment-orderId').value;
    const amount = parseFloat(document.getElementById('payment-amount').value);

    try {
        const response = await fetch(`${API_ENDPOINTS.payments}?orderId=${orderId}&amount=${amount}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create payment');
        }

        const payment = await response.json();
        alert(`Payment created successfully! ID: ${payment.id.substring(0, 8)}...`);
        
        closeCreatePaymentModal();
        loadPayments();
    } catch (error) {
        alert(`Error creating payment: ${error.message}`);
        console.error('Error creating payment:', error);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const orderModal = document.getElementById('create-order-modal');
    const inventoryModal = document.getElementById('create-inventory-modal');
    const paymentModal = document.getElementById('create-payment-modal');
    
    if (event.target === orderModal) {
        closeCreateOrderModal();
    }
    if (event.target === inventoryModal) {
        closeCreateInventoryModal();
    }
    if (event.target === paymentModal) {
        closeCreatePaymentModal();
    }
}

// Load orders on page load
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});

