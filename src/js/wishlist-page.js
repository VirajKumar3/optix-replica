/* eslint-disable */
/* exported wishlistPageInit */
/* eslint-disable no-param-reassign */
/* -------------------------------------------------------------------------- */
/*                            Wishlist Page Rendering                         */
/* -------------------------------------------------------------------------- */

const wishlistPageInit = () => {
  const container = document.getElementById('wishlist-container');
  const emptyMsg = document.getElementById('empty-wishlist-msg');
  
  if (!container) return;

  const renderWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('optix-wishlist') || '[]');
    
    if (wishlist.length === 0) {
      container.innerHTML = '';
      emptyMsg.classList.remove('d-none');
      return;
    }

    emptyMsg.classList.add('d-none');
    container.innerHTML = wishlist.map((product) => `
      <div class="eyewear-card-wrapper is-visible" 
           data-product-id="${product.id}"
           data-product-image="${product.image}"
           data-product-brand="${product.brand}"
           data-product-price="${product.price}"
           data-product-original-price="${product.originalPrice}"
           data-product-discount="${product.discount}">
        <div class="card eyewear-card h-100 border-0">
          <div class="eyewear-img-container">
            <img class="card-img-top" src="assets/img/gallery/${product.image}" alt="${product.brand}" />
          </div>
          <div class="card-body pb-0">
            <p class="product-brand">${product.brand}</p>
            <div class="price-section">
              <span class="current-price">₹${product.price}</span>
              <span class="original-price">₹${product.originalPrice}</span>
            </div>
            <p class="discount-badge">${product.discount}% OFF</p>
          </div>
          <div class="card-footer eyewear-card-footer bg-transparent border-0 pt-0 pb-4 px-3">
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-dark flex-grow-1 buy-now-btn">BUY NOW</button>
              <button class="btn btn-fav active">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ff4d4d" stroke="#ff4d4d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Re-initialize listeners for the newly rendered buttons
    container.querySelectorAll('.btn-fav').forEach(btn => {
      btn.addEventListener('click', () => {
        const wrapper = btn.closest('.eyewear-card-wrapper');
        const productId = wrapper.dataset.productId;
        
        let currentWishlist = JSON.parse(localStorage.getItem('optix-wishlist') || '[]');
        currentWishlist = currentWishlist.filter(item => item.id !== productId);
        localStorage.setItem('optix-wishlist', JSON.stringify(currentWishlist));
        
        renderWishlist(); // Re-render the page
      });
    });
  };

  renderWishlist();
};
