/* eslint-disable */
/* exported cartPageInit */
/* eslint-disable no-param-reassign */
/* -------------------------------------------------------------------------- */
/*                            Cart Page Rendering                             */
/* -------------------------------------------------------------------------- */

const cartPageInit = () => {
  const container = document.getElementById('cart-items-container');
  const emptyMsg = document.getElementById('empty-cart-msg');
  const summary = document.getElementById('cart-summary');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  
  if (!container) return;

  const renderCart = () => {
    const cart = JSON.parse(localStorage.getItem('optix-cart') || '[]');
    
    if (cart.length === 0) {
      container.innerHTML = '';
      emptyMsg.classList.remove('d-none');
      summary.classList.add('d-none');
      return;
    }

    emptyMsg.classList.add('d-none');
    summary.classList.remove('d-none');

    let subtotal = 0;

    container.innerHTML = cart.map((item) => {
      // Remove commas from price string for calculation
      const priceNum = parseInt(item.price.replace(/,/g, ''), 10);
      subtotal += priceNum * item.quantity;

      return `
        <div class="card border-0 shadow-sm rounded-3 p-3 mb-3 cart-item" data-product-id="${item.id}">
          <div class="row align-items-center">
            <div class="col-md-2">
              <img src="assets/img/gallery/${item.image}" alt="${item.brand}" class="img-fluid rounded">
            </div>
            <div class="col-md-4">
              <h6 class="fw-bold mb-1">${item.brand}</h6>
              <p class="text-muted small mb-0">Premium Eyewear</p>
            </div>
            <div class="col-md-3">
              <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-dark rounded-circle btn-quantity" data-action="dec" style="width: 28px; height: 28px; padding: 0;">-</button>
                <span class="fw-bold">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-dark rounded-circle btn-quantity" data-action="inc" style="width: 28px; height: 28px; padding: 0;">+</button>
              </div>
            </div>
            <div class="col-md-2 text-end">
              <p class="fw-bold mb-0">₹${item.price}</p>
            </div>
            <div class="col-md-1 text-end">
              <button class="btn btn-link text-danger p-0 btn-remove-cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    subtotalEl.innerText = `₹${subtotal.toLocaleString()}`;
    totalEl.innerText = `₹${subtotal.toLocaleString()}`;

    // Add Listeners
    container.querySelectorAll('.btn-quantity').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const id = btn.closest('.cart-item').dataset.productId;
        let currentCart = JSON.parse(localStorage.getItem('optix-cart') || '[]');
        
        const item = currentCart.find(i => i.id === id);
        if (action === 'inc') {
          item.quantity += 1;
        } else if (action === 'dec' && item.quantity > 1) {
          item.quantity -= 1;
        }
        
        localStorage.setItem('optix-cart', JSON.stringify(currentCart));
        renderCart();
      });
    });

    container.querySelectorAll('.btn-remove-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.cart-item').dataset.productId;
        let currentCart = JSON.parse(localStorage.getItem('optix-cart') || '[]');
        currentCart = currentCart.filter(i => i.id !== id);
        localStorage.setItem('optix-cart', JSON.stringify(currentCart));
        renderCart();
      });
    });
  };

  renderCart();
};
