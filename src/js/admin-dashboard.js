/* eslint-disable */
/* exported adminDashboardInit */
/* -------------------------------------------------------------------------- */
/*                            Admin Dashboard Logic                           */
/* -------------------------------------------------------------------------- */

const adminDashboardInit = () => {
  const views = document.querySelectorAll('.admin-view');
  const navLinks = document.querySelectorAll('.admin-nav .nav-link');
  const productForm = document.getElementById('product-form');
  const imageInput = document.getElementById('image-input');
  const previewContainer = document.getElementById('image-preview-container');
  const tableBody = document.getElementById('products-table-body');
  const searchInput = document.getElementById('product-search');
  const API_BASE = 'http://localhost:8080/api/products';

  if (!productForm) return;

  let allProducts = [];

  // --- View Switching Logic ---
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.target;
      console.log('Switching to view:', targetId);
      
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      views.forEach(view => {
        if (view.id === targetId) {
          view.classList.remove('d-none');
        } else {
          view.classList.add('d-none');
        }
      });

      if (targetId === 'manage-products-view' || targetId === 'dashboard-view') {
        loadProducts();
      }
      
      if (targetId === 'add-product-view') {
        const isProgrammatic = e.isTrusted === false;
        if (!isProgrammatic) {
          // Reset to Add mode
          link.innerHTML = '<i class="me-2" data-feather="plus-square"></i>Add Product';
          if (window.feather) feather.replace();
          
          document.getElementById('form-title').innerText = 'Add New Eyewear';
          document.getElementById('product-id').value = '';
          productForm.reset();
          previewContainer.innerHTML = '';
        }
      } else {
        // Reset the Add link text when switching to other views
        const addViewLink = document.querySelector('[data-target="add-product-view"]');
        if (addViewLink) {
          addViewLink.innerHTML = '<i class="me-2" data-feather="plus-square"></i>Add Product';
          if (window.feather) feather.replace();
        }
      }
    });
  });

  // --- Image Preview Logic ---
  imageInput.addEventListener('change', () => {
    previewContainer.innerHTML = '';
    const files = Array.from(imageInput.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'preview-thumb';
        previewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

  // --- CRUD: Load Products ---
  const loadProducts = () => {
    console.log('Fetching products from:', API_BASE);
    fetch(API_BASE)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('API Response received:', data);
        if (data.success) {
          allProducts = data.products || [];
          console.log('Current Inventory Prices:');
          allProducts.forEach(p => console.log(`- ${p.brand} ${p.name}: ₹${p.price}`));
          updateStats(data);
          renderTable(allProducts);
        } else {
          console.error('API Error:', data.message);
        }
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        if (tableBody) {
          tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-danger">Error loading products: ${err.message}</td></tr>`;
        }
      });
  };

  const updateStats = (data) => {
    const totalEl = document.getElementById('stat-total-products');
    if (totalEl) totalEl.innerText = data.total || (data.products ? data.products.length : 0);
  };

  const renderTable = (products) => {
    if (!tableBody) {
      console.warn('Table body element not found!');
      return;
    }
    
    if (!products || products.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No products found in inventory</td></tr>';
      return;
    }

    tableBody.innerHTML = products.map(product => {
      // Robust image path logic
      let imgPath = 'assets/img/gallery/glasses-aviator.png';
      if (product.image) {
        if (product.image.startsWith('/uploads')) {
          imgPath = `http://localhost:8080${product.image}`;
        } else {
          imgPath = `assets/img/gallery/${product.image}`;
        }
      }

      return `
        <tr>
          <td class="ps-4">
            <div class="d-flex align-items-center gap-3">
              <img src="${imgPath}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" onerror="this.src='assets/img/gallery/glasses-aviator.png'">
              <div>
                <span class="d-block fw-bold text-1000">${product.brand || 'No Brand'}</span>
                <span class="d-block text-700 small">${product.name || 'Unnamed Product'}</span>
              </div>
            </div>
          </td>
          <td class="text-capitalize small">${product.category || 'N/A'}</td>
          <td class="text-capitalize small">${product.gender || 'N/A'}</td>
          <td class="fw-bold">₹${product.price || 0}</td>
          <td><span class="badge ${product.stock > 5 ? 'bg-light text-dark' : 'bg-danger-soft text-danger'}">${product.stock || 0}</span></td>
          <td class="text-end pe-4">
            <button class="btn btn-sm btn-light border me-1 edit-btn" data-id="${product._id}">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product._id}">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    // Re-attach listeners after rendering
    tableBody.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editProduct(btn.dataset.id));
    });
    tableBody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
  };

  // --- Search Logic ---
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(term)) || 
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
      );
      renderTable(filtered);
    });
  }

  // --- CRUD: Add / Update Product ---
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    const productId = document.getElementById('product-id').value;
    
    console.log('--- Form Submission Start ---');
    console.log('Action:', productId ? 'Updating existing product' : 'Adding new product');
    console.log('Product ID:', productId || 'NONE');

    submitBtn.disabled = true;
    submitBtn.innerText = 'Saving...';

    const formData = new FormData(productForm);
    
    // Log the data being sent
    const formEntries = {};
    formData.forEach((value, key) => { formEntries[key] = value; });
    console.log('Form Data payload:', formEntries);

    const url = productId ? `${API_BASE}/${productId}` : API_BASE;
    const method = productId ? 'PUT' : 'POST';

    console.log(`Sending ${method} request to: ${url}`);

    fetch(url, {
      method: method,
      body: formData
    })
    .then(res => {
      console.log('Server response status:', res.status);
      return res.json();
    })
    .then(data => {
      console.log('API Response data:', data);
      if (data.success) {
        showToast(productId ? 'Changes saved successfully!' : 'Product added to inventory!');
        productForm.reset();
        document.getElementById('product-id').value = ''; // Explicitly clear
        previewContainer.innerHTML = '';
        
        // Return to management view
        const manageLink = document.querySelector('[data-target="manage-products-view"]');
        if (manageLink) manageLink.click();
      } else {
        console.error('Save failed:', data.message);
        alert('Could not save: ' + (data.message || 'Unknown error'));
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      alert('Network Error: ' + err.message);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Save Product';
      console.log('--- Form Submission End ---');
    });
  });

  // --- CRUD: Delete ---
  const deleteProduct = (id) => {
    if (confirm('Are you sure you want to remove this product from inventory?')) {
      fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            showToast('Product removed successfully');
            loadProducts();
          }
        });
    }
  };

  // --- CRUD: Edit (Prefill) ---
  const editProduct = (id) => {
    console.log('Attempting to edit product ID:', id);
    const product = allProducts.find(p => p._id === id);
    if (product) {
      console.log('Product found:', product.name);
      
      // 1. Update Nav Link Text
      const addViewLink = document.querySelector('[data-target="add-product-view"]');
      if (addViewLink) {
        addViewLink.innerHTML = '<i class="me-2" data-feather="edit"></i>Edit Product';
        if (window.feather) feather.replace();
        addViewLink.click();
      }

      // 2. Fill Data
      setTimeout(() => {
        document.getElementById('form-title').innerText = `Editing: ${product.name}`;
        document.getElementById('product-id').value = product._id;
        
        const inputs = productForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          if (input.name && product[input.name] !== undefined) {
            input.value = product[input.name];
          }
        });
        
        // Handle images preview if any
        if (product.image) {
          previewContainer.innerHTML = `<img src="${product.image.startsWith('/uploads') ? 'http://localhost:8080'+product.image : 'assets/img/gallery/'+product.image}" class="preview-thumb">`;
        }
        
        console.log('Form pre-filled successfully');
      }, 50);
    } else {
      console.error('Product not found in local cache!');
    }
  };

  const showToast = (msg) => {
    const toastEl = document.getElementById('admin-toast');
    if (!toastEl) return;
    document.getElementById('toast-message').innerText = msg;
    if (window.bootstrap) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    } else {
      alert(msg);
    }
  };

  // Initial Load
  loadProducts();
};
