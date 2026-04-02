document.addEventListener('DOMContentLoaded', function() {
    // 1. Cek apakah user sudah login
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Anda belum login!');
        window.location.href = '../homepage.html';
        return;
    }

    // 2. Load Cart Data
    const cartData = JSON.parse(localStorage.getItem('donutCart')) || [];
    if (cartData.length === 0) {
        alert('Keranjang belanjamu kosong! Silakan pilih donat terlebih dahulu.');
        window.location.href = '../homepage.html';
        return;
    }

    // 3. Kalkulasi dan Print ke Textarea
    const orderDetails = document.getElementById('orderDetails');
    let summary = 'ORDER SUMMARY:\n';
    summary += '========================\n';
    
    let totalHarga = 0;
    cartData.forEach(item => {
        // Asumsi struktur cart: { id, name, price (integer/string), quantity }
        let hargaNumeric = parseInt(item.price.replace(/[^\d]/g, ''));
        if (isNaN(hargaNumeric)) { hargaNumeric = item.price; /* Fallback */ }
        
        let itemTotal = hargaNumeric * item.quantity;
        totalHarga += itemTotal;
        summary += `${item.quantity}x ${item.name} - Rp ${itemTotal.toLocaleString('id-ID')}\n`;
    });
    
    summary += '========================\n';
    summary += `TOTAL ESTIMATION: Rp ${totalHarga.toLocaleString('id-ID')}\n`;
    summary += `PAYMENT METHOD: Cash on Delivery (COD)\n\n`;
    summary += 'Catatan Tambahan untuk penjual:\n';
    
    if (orderDetails) {
        orderDetails.value = summary;
    }

    // 4. Hapus Keranjang setelah user menekan Submit Order
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function() {
            localStorage.removeItem('donutCart');
        });
    }
});
