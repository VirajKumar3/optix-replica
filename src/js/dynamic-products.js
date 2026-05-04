/* eslint-disable */
/* exported dynamicProductsInit */
/* -------------------------------------------------------------------------- */
/*                            Dynamic Product Loader                          */
/* -------------------------------------------------------------------------- */

const dynamicProductsInit = () => {
  const grid = document.querySelector('.eyewear-grid[data-category]');
  if (!grid) return;

  const category = grid.dataset.category;
  const API_URL = `http://localhost:8080/api/products?category=${category}`;

  // Using .then instead of async/await to avoid regeneratorRuntime errors
  fetch(API_URL)
    .then((response) => {
      if (!response.ok) throw new Error('API connection failed');
      return response.json();
    })
    .then((products) => {
      if (products && products.length > 0) {
        grid.innerHTML = ''; // Clear static fallback products

        products.forEach((product, index) => {
          const cardHtml = `
            <div class="eyewear-card-wrapper animate-on-scroll is-visible" 
                 style="transition-delay: ${index * 0.1}s"
                 data-product-id="${product.brand}-${product.image}"
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
                    <button class="btn btn-fav">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
          grid.insertAdjacentHTML('beforeend', cardHtml);
        });

        window.dispatchEvent(new Event('productsLoaded'));
        console.log(`Successfully loaded ${products.length} products from database.`);
      }
    })
    .catch((error) => {
      console.warn('Backend not available. Displaying static fallback products.', error.message);
    });
};
