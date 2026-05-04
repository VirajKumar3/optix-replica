/* eslint-disable */
/* exported favButtonInit */
/* eslint-disable no-param-reassign */
/* -------------------------------------------------------------------------- */
/*                            Favorite Button Functionality                   */
/* -------------------------------------------------------------------------- */

const favButtonInit = () => {
  const updateActiveStates = () => {
    const wishlist = JSON.parse(localStorage.getItem('optix-wishlist') || '[]');
    document.querySelectorAll('.btn-fav').forEach((btn) => {
      const wrapper = btn.closest('.eyewear-card-wrapper');
      if (wrapper && wishlist.some((item) => item.id === wrapper.dataset.productId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  updateActiveStates();

  window.addEventListener('productsLoaded', updateActiveStates);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-fav');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const wrapper = btn.closest('.eyewear-card-wrapper');
    if (!wrapper) return;

    btn.classList.toggle('active');
    const productId = wrapper.dataset.productId;
    let currentWishlist = JSON.parse(localStorage.getItem('optix-wishlist') || '[]');

    if (btn.classList.contains('active')) {
      const product = {
        id: wrapper.dataset.productId,
        image: wrapper.dataset.productImage,
        brand: wrapper.dataset.productBrand,
        price: wrapper.dataset.productPrice,
        originalPrice: wrapper.dataset.productOriginalPrice,
        discount: wrapper.dataset.productDiscount,
      };
      if (!currentWishlist.some((item) => item.id === product.id)) {
        currentWishlist.push(product);
      }
    } else {
      currentWishlist = currentWishlist.filter((item) => item.id !== productId);
    }

    localStorage.setItem('optix-wishlist', JSON.stringify(currentWishlist));
    
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
  });
};
