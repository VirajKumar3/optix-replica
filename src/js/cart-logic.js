/* eslint-disable */
/* exported cartLogicInit */
/* eslint-disable no-param-reassign */
/* -------------------------------------------------------------------------- */
/*                            Cart Logic Functionality                        */
/* -------------------------------------------------------------------------- */

const cartLogicInit = () => {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.buy-now-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const wrapper = btn.closest('.eyewear-card-wrapper');
    if (!wrapper) return;

    const product = {
      id: wrapper.dataset.productId,
      image: wrapper.dataset.productImage,
      brand: wrapper.dataset.productBrand,
      price: wrapper.dataset.productPrice,
      originalPrice: wrapper.dataset.productOriginalPrice,
      discount: wrapper.dataset.productDiscount,
      quantity: 1,
    };

    let cart = JSON.parse(localStorage.getItem('optix-cart') || '[]');
    
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem('optix-cart', JSON.stringify(cart));
    
    const originalText = btn.innerText;
    btn.innerText = 'ADDED TO CART';
    const originalBg = btn.style.backgroundColor;
    btn.style.backgroundColor = '#28a745';
    btn.style.borderColor = '#28a745';
    
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.backgroundColor = originalBg;
      btn.style.borderColor = '';
    }, 1500);
  });
};
