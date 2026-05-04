"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* -------------------------------------------------------------------------- */

/*                                    Utils                                   */

/* -------------------------------------------------------------------------- */
var docReady = function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    setTimeout(fn, 1);
  }
};

var resize = function resize(fn) {
  return window.addEventListener('resize', fn);
};

var isIterableArray = function isIterableArray(array) {
  return Array.isArray(array) && !!array.length;
};

var camelize = function camelize(str) {
  var text = str.replace(/[-_\s.]+(.)?/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
  return "".concat(text.substr(0, 1).toLowerCase()).concat(text.substr(1));
};

var getData = function getData(el, data) {
  try {
    return JSON.parse(el.dataset[camelize(data)]);
  } catch (e) {
    return el.dataset[camelize(data)];
  }
};
/* ----------------------------- Colors function ---------------------------- */


var hexToRgb = function hexToRgb(hexValue) {
  var hex;
  hexValue.indexOf('#') === 0 ? hex = hexValue.substring(1) : hex = hexValue; // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")

  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  }));
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

var rgbaColor = function rgbaColor() {
  var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#fff';
  var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
  return "rgba(".concat(hexToRgb(color), ", ").concat(alpha, ")");
};
/* --------------------------------- Colors --------------------------------- */


var colors = {
  primary: '#0057FF',
  secondary: '#748194',
  success: '#00d27a',
  info: '#27bcfd',
  warning: '#f5803e',
  danger: '#e63757',
  light: '#F9FAFD',
  dark: '#000'
};
var grays = {
  white: '#fff',
  100: '#f9fafd',
  200: '#edf2f9',
  300: '#d8e2ef',
  400: '#b6c1d2',
  500: '#9da9bb',
  600: '#748194',
  700: '#5e6e82',
  800: '#4d5969',
  900: '#344050',
  1000: '#232e3c',
  1100: '#0b1727',
  black: '#000'
};

var hasClass = function hasClass(el, className) {
  !el && false;
  return el.classList.value.includes(className);
};

var addClass = function addClass(el, className) {
  el.classList.add(className);
};

var getOffset = function getOffset(el) {
  var rect = el.getBoundingClientRect();
  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};

var isScrolledIntoView = function isScrolledIntoView(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while (el.offsetParent) {
    // eslint-disable-next-line no-param-reassign
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return {
    all: top >= window.pageYOffset && left >= window.pageXOffset && top + height <= window.pageYOffset + window.innerHeight && left + width <= window.pageXOffset + window.innerWidth,
    partial: top < window.pageYOffset + window.innerHeight && left < window.pageXOffset + window.innerWidth && top + height > window.pageYOffset && left + width > window.pageXOffset
  };
};

var breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1540
};

var getBreakpoint = function getBreakpoint(el) {
  var classes = el && el.classList.value;
  var breakpoint;

  if (classes) {
    breakpoint = breakpoints[classes.split(' ').filter(function (cls) {
      return cls.includes('navbar-expand-');
    }).pop().split('-').pop()];
  }

  return breakpoint;
};
/* --------------------------------- Cookie --------------------------------- */


var setCookie = function setCookie(name, value, expire) {
  var expires = new Date();
  expires.setTime(expires.getTime() + expire);
  document.cookie = "".concat(name, "=").concat(value, ";expires=").concat(expires.toUTCString());
};

var getCookie = function getCookie(name) {
  var keyValue = document.cookie.match("(^|;) ?".concat(name, "=([^;]*)(;|$)"));
  return keyValue ? keyValue[2] : keyValue;
};

var settings = {
  tinymce: {
    theme: 'oxide'
  },
  chart: {
    borderColor: 'rgba(255, 255, 255, 0.8)'
  }
};
/* -------------------------- Chart Initialization -------------------------- */

var newChart = function newChart(chart, config) {
  var ctx = chart.getContext('2d');
  return new window.Chart(ctx, config);
};
/* ---------------------------------- Store --------------------------------- */


var getItemFromStore = function getItemFromStore(key, defaultValue) {
  var store = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : localStorage;

  try {
    return JSON.parse(store.getItem(key)) || defaultValue;
  } catch (_unused) {
    return store.getItem(key) || defaultValue;
  }
};

var setItemToStore = function setItemToStore(key, payload) {
  var store = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : localStorage;
  return store.setItem(key, payload);
};

var getStoreSpace = function getStoreSpace() {
  var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : localStorage;
  return parseFloat((escape(encodeURIComponent(JSON.stringify(store))).length / (1024 * 1024)).toFixed(2));
};

var utils = {
  docReady: docReady,
  resize: resize,
  isIterableArray: isIterableArray,
  camelize: camelize,
  getData: getData,
  hasClass: hasClass,
  addClass: addClass,
  hexToRgb: hexToRgb,
  rgbaColor: rgbaColor,
  colors: colors,
  grays: grays,
  getOffset: getOffset,
  isScrolledIntoView: isScrolledIntoView,
  getBreakpoint: getBreakpoint,
  setCookie: setCookie,
  getCookie: getCookie,
  newChart: newChart,
  settings: settings,
  getItemFromStore: getItemFromStore,
  setItemToStore: setItemToStore,
  getStoreSpace: getStoreSpace
};
/* -------------------------------------------------------------------------- */

/*                                  Detector                                  */

/* -------------------------------------------------------------------------- */

var detectorInit = function detectorInit() {
  var _window = window,
      is = _window.is;
  var html = document.querySelector('html');
  is.opera() && addClass(html, 'opera');
  is.mobile() && addClass(html, 'mobile');
  is.firefox() && addClass(html, 'firefox');
  is.safari() && addClass(html, 'safari');
  is.ios() && addClass(html, 'ios');
  is.iphone() && addClass(html, 'iphone');
  is.ipad() && addClass(html, 'ipad');
  is.ie() && addClass(html, 'ie');
  is.edge() && addClass(html, 'edge');
  is.chrome() && addClass(html, 'chrome');
  is.mac() && addClass(html, 'osx');
  is.windows() && addClass(html, 'windows');
  navigator.userAgent.match('CriOS') && addClass(html, 'chrome');
};
/* eslint-disable */

/* exported adminDashboardInit */

/* -------------------------------------------------------------------------- */

/*                            Admin Dashboard Logic                           */

/* -------------------------------------------------------------------------- */


var adminDashboardInit = function adminDashboardInit() {
  var views = document.querySelectorAll('.admin-view');
  var navLinks = document.querySelectorAll('.admin-nav .nav-link');
  var productForm = document.getElementById('product-form');
  var imageInput = document.getElementById('image-input');
  var previewContainer = document.getElementById('image-preview-container');
  var tableBody = document.getElementById('products-table-body');
  var searchInput = document.getElementById('product-search');
  var API_BASE = 'http://localhost:8080/api/products';
  if (!productForm) return;
  var allProducts = []; // --- View Switching Logic ---

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = link.dataset.target;
      console.log('Switching to view:', targetId);
      navLinks.forEach(function (l) {
        return l.classList.remove('active');
      });
      link.classList.add('active');
      views.forEach(function (view) {
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
        var isProgrammatic = e.isTrusted === false;

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
        var addViewLink = document.querySelector('[data-target="add-product-view"]');

        if (addViewLink) {
          addViewLink.innerHTML = '<i class="me-2" data-feather="plus-square"></i>Add Product';
          if (window.feather) feather.replace();
        }
      }
    });
  }); // --- Image Preview Logic ---

  imageInput.addEventListener('change', function () {
    previewContainer.innerHTML = '';
    var files = Array.from(imageInput.files);
    files.forEach(function (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'preview-thumb';
        previewContainer.appendChild(img);
      };

      reader.readAsDataURL(file);
    });
  }); // --- CRUD: Load Products ---

  var loadProducts = function loadProducts() {
    console.log('Fetching products from:', API_BASE);
    fetch(API_BASE).then(function (res) {
      if (!res.ok) throw new Error("HTTP error! status: ".concat(res.status));
      return res.json();
    }).then(function (data) {
      console.log('API Response received:', data);

      if (data.success) {
        allProducts = data.products || [];
        console.log('Current Inventory Prices:');
        allProducts.forEach(function (p) {
          return console.log("- ".concat(p.brand, " ").concat(p.name, ": \u20B9").concat(p.price));
        });
        updateStats(data);
        renderTable(allProducts);
      } else {
        console.error('API Error:', data.message);
      }
    })["catch"](function (err) {
      console.error('Failed to load products:', err);

      if (tableBody) {
        tableBody.innerHTML = "<tr><td colspan=\"6\" class=\"text-center py-4 text-danger\">Error loading products: ".concat(err.message, "</td></tr>");
      }
    });
  };

  var updateStats = function updateStats(data) {
    var totalEl = document.getElementById('stat-total-products');
    if (totalEl) totalEl.innerText = data.total || (data.products ? data.products.length : 0);
  };

  var renderTable = function renderTable(products) {
    if (!tableBody) {
      console.warn('Table body element not found!');
      return;
    }

    if (!products || products.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No products found in inventory</td></tr>';
      return;
    }

    tableBody.innerHTML = products.map(function (product) {
      // Robust image path logic
      var imgPath = 'assets/img/gallery/glasses-aviator.png';

      if (product.image) {
        if (product.image.startsWith('/uploads')) {
          imgPath = "http://localhost:8080".concat(product.image);
        } else {
          imgPath = "assets/img/gallery/".concat(product.image);
        }
      }

      return "\n        <tr>\n          <td class=\"ps-4\">\n            <div class=\"d-flex align-items-center gap-3\">\n              <img src=\"".concat(imgPath, "\" alt=\"").concat(product.name, "\" style=\"width: 50px; height: 50px; object-fit: cover; border-radius: 8px;\" onerror=\"this.src='assets/img/gallery/glasses-aviator.png'\">\n              <div>\n                <span class=\"d-block fw-bold text-1000\">").concat(product.brand || 'No Brand', "</span>\n                <span class=\"d-block text-700 small\">").concat(product.name || 'Unnamed Product', "</span>\n              </div>\n            </div>\n          </td>\n          <td class=\"text-capitalize small\">").concat(product.category || 'N/A', "</td>\n          <td class=\"text-capitalize small\">").concat(product.gender || 'N/A', "</td>\n          <td class=\"fw-bold\">\u20B9").concat(product.price || 0, "</td>\n          <td><span class=\"badge ").concat(product.stock > 5 ? 'bg-light text-dark' : 'bg-danger-soft text-danger', "\">").concat(product.stock || 0, "</span></td>\n          <td class=\"text-end pe-4\">\n            <button class=\"btn btn-sm btn-light border me-1 edit-btn\" data-id=\"").concat(product._id, "\">Edit</button>\n            <button class=\"btn btn-sm btn-outline-danger delete-btn\" data-id=\"").concat(product._id, "\">Delete</button>\n          </td>\n        </tr>\n      ");
    }).join(''); // Re-attach listeners after rendering

    tableBody.querySelectorAll('.edit-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        return editProduct(btn.dataset.id);
      });
    });
    tableBody.querySelectorAll('.delete-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        return deleteProduct(btn.dataset.id);
      });
    });
  }; // --- Search Logic ---


  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      var term = e.target.value.toLowerCase();
      var filtered = allProducts.filter(function (p) {
        return p.name && p.name.toLowerCase().includes(term) || p.brand && p.brand.toLowerCase().includes(term) || p.category && p.category.toLowerCase().includes(term);
      });
      renderTable(filtered);
    });
  } // --- CRUD: Add / Update Product ---


  productForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = document.getElementById('submit-btn');
    var productId = document.getElementById('product-id').value;
    console.log('--- Form Submission Start ---');
    console.log('Action:', productId ? 'Updating existing product' : 'Adding new product');
    console.log('Product ID:', productId || 'NONE');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Saving...';
    var formData = new FormData(productForm); // Log the data being sent

    var formEntries = {};
    formData.forEach(function (value, key) {
      formEntries[key] = value;
    });
    console.log('Form Data payload:', formEntries);
    var url = productId ? "".concat(API_BASE, "/").concat(productId) : API_BASE;
    var method = productId ? 'PUT' : 'POST';
    console.log("Sending ".concat(method, " request to: ").concat(url));
    fetch(url, {
      method: method,
      body: formData
    }).then(function (res) {
      console.log('Server response status:', res.status);
      return res.json();
    }).then(function (data) {
      console.log('API Response data:', data);

      if (data.success) {
        showToast(productId ? 'Changes saved successfully!' : 'Product added to inventory!');
        productForm.reset();
        document.getElementById('product-id').value = ''; // Explicitly clear

        previewContainer.innerHTML = ''; // Return to management view

        var manageLink = document.querySelector('[data-target="manage-products-view"]');
        if (manageLink) manageLink.click();
      } else {
        console.error('Save failed:', data.message);
        alert('Could not save: ' + (data.message || 'Unknown error'));
      }
    })["catch"](function (err) {
      console.error('Fetch error:', err);
      alert('Network Error: ' + err.message);
    })["finally"](function () {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Save Product';
      console.log('--- Form Submission End ---');
    });
  }); // --- CRUD: Delete ---

  var deleteProduct = function deleteProduct(id) {
    if (confirm('Are you sure you want to remove this product from inventory?')) {
      fetch("".concat(API_BASE, "/").concat(id), {
        method: 'DELETE'
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        if (data.success) {
          showToast('Product removed successfully');
          loadProducts();
        }
      });
    }
  }; // --- CRUD: Edit (Prefill) ---


  var editProduct = function editProduct(id) {
    console.log('Attempting to edit product ID:', id);
    var product = allProducts.find(function (p) {
      return p._id === id;
    });

    if (product) {
      console.log('Product found:', product.name); // 1. Update Nav Link Text

      var addViewLink = document.querySelector('[data-target="add-product-view"]');

      if (addViewLink) {
        addViewLink.innerHTML = '<i class="me-2" data-feather="edit"></i>Edit Product';
        if (window.feather) feather.replace();
        addViewLink.click();
      } // 2. Fill Data


      setTimeout(function () {
        document.getElementById('form-title').innerText = "Editing: ".concat(product.name);
        document.getElementById('product-id').value = product._id;
        var inputs = productForm.querySelectorAll('input, select, textarea');
        inputs.forEach(function (input) {
          if (input.name && product[input.name] !== undefined) {
            input.value = product[input.name];
          }
        }); // Handle images preview if any

        if (product.image) {
          previewContainer.innerHTML = "<img src=\"".concat(product.image.startsWith('/uploads') ? 'http://localhost:8080' + product.image : 'assets/img/gallery/' + product.image, "\" class=\"preview-thumb\">");
        }

        console.log('Form pre-filled successfully');
      }, 50);
    } else {
      console.error('Product not found in local cache!');
    }
  };

  var showToast = function showToast(msg) {
    var toastEl = document.getElementById('admin-toast');
    if (!toastEl) return;
    document.getElementById('toast-message').innerText = msg;

    if (window.bootstrap) {
      var toast = new bootstrap.Toast(toastEl);
      toast.show();
    } else {
      alert(msg);
    }
  }; // Initial Load


  loadProducts();
};
/* eslint-disable */

/* exported authInit, userNavInit */

/* -------------------------------------------------------------------------- */

/*                            Authentication Logic                            */

/* -------------------------------------------------------------------------- */


var authInit = function authInit() {
  var authForm = document.getElementById('auth-form');
  var nameField = document.getElementById('name-field');
  var authTitle = document.getElementById('auth-title');
  var authSubtitle = document.getElementById('auth-subtitle');
  var authSubmitBtn = document.getElementById('auth-submit-btn');
  var authToggleContainer = document.getElementById('auth-toggle-text');

  if (!authForm) {
    console.log('Auth form not found, skipping authInit');
    return;
  }

  console.log('Auth system initialized');
  var isLogin = true; // --- Toggle between Login and Signup ---

  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'auth-toggle-btn') {
      e.preventDefault();
      isLogin = !isLogin;
      console.log('Toggling auth mode to:', isLogin ? 'Login' : 'Signup');

      if (isLogin) {
        authTitle.innerText = 'Welcome Back';
        authSubtitle.innerText = 'Please enter your details to sign in.';
        authSubmitBtn.innerText = 'Sign In';
        authToggleContainer.innerHTML = "Don't have an account? <a href=\"#\" class=\"text-primary fw-bold\" id=\"auth-toggle-btn\">Sign up for free</a>";
        nameField.classList.add('d-none');
      } else {
        authTitle.innerText = 'Create an Account';
        authSubtitle.innerText = 'Join the Optix family today.';
        authSubmitBtn.innerText = 'Create Account';
        authToggleContainer.innerHTML = "Already have an account? <a href=\"#\" class=\"text-primary fw-bold\" id=\"auth-toggle-btn\">Sign in here</a>";
        nameField.classList.remove('d-none');
      }
    }
  }); // --- Form Submission ---

  authForm.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Auth form submitted');
    var formData = new FormData(authForm);
    var payload = {};
    formData.forEach(function (value, key) {
      return payload[key] = value;
    });
    console.log('Payload:', payload);
    var endpoint = isLogin ? 'http://localhost:8080/api/auth/login' : 'http://localhost:8080/api/auth/signup';
    authSubmitBtn.disabled = true;
    authSubmitBtn.innerText = 'Processing...';
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      console.log('Response status:', res.status);
      return res.json();
    }).then(function (result) {
      console.log('API Result:', result);

      if (result.success) {
        localStorage.setItem('optix-token', result.token);
        localStorage.setItem('optix-user', JSON.stringify(result.user));
        showAuthToast(isLogin ? "Welcome back, ".concat(result.user.name, "!") : "Welcome to the Optix family, ".concat(result.user.name, "!"));
        setTimeout(function () {
          window.location.href = result.user.role === 'admin' ? 'admin.html' : 'index.html';
        }, 1500);
      } else {
        alert('Error: ' + result.message);
      }
    })["catch"](function (err) {
      console.error('Auth fetch error:', err);
      alert('Could not connect to the auth server. Please ensure the backend is running.');
    })["finally"](function () {
      authSubmitBtn.disabled = false;
      authSubmitBtn.innerText = isLogin ? 'Sign In' : 'Create Account';
    });
  });

  var showAuthToast = function showAuthToast(msg) {
    var toastEl = document.getElementById('auth-toast');
    if (!toastEl) return;
    document.getElementById('auth-toast-message').innerText = msg;

    if (window.bootstrap) {
      var toast = new bootstrap.Toast(toastEl);
      toast.show();
    } else {
      alert(msg);
    }
  };
};
/* -------------------------------------------------------------------------- */

/*                            Navbar User Dropdown                            */

/* -------------------------------------------------------------------------- */


var userNavInit = function userNavInit() {
  var dropdownMenu = document.getElementById('user-dropdown-menu');
  if (!dropdownMenu) return;
  var userData = localStorage.getItem('optix-user');

  if (userData) {
    var user = JSON.parse(userData);
    var avatarUrl = user.avatar ? "http://localhost:8080".concat(user.avatar) : 'assets/img/gallery/him.png';
    dropdownMenu.innerHTML = "\n      <li class=\"px-3 py-2 border-bottom mb-2\">\n        <div style=\"line-height: 1.2;\">\n          <p class=\"mb-0 text-muted fw-medium\" style=\"font-size: 10px; letter-spacing: 0.5px;\">SIGNED IN AS</p>\n          <h6 class=\"fw-bold mb-0 text-dark\" style=\"font-size: 13px;\">".concat(user.name, "</h6>\n        </div>\n      </li>\n      ").concat(user.role === 'admin' ? '<li><a class="dropdown-item small py-2 d-flex align-items-center" href="admin.html"><i class="me-2 text-primary" data-feather="settings" style="width:14px"></i>Admin Dashboard</a></li>' : '', "\n      <li><hr class=\"dropdown-divider mx-3\"></li>\n      <li><a class=\"dropdown-item small py-2 text-danger fw-bold d-flex align-items-center\" href=\"#\" id=\"logout-btn\"><i class=\"me-2\" data-feather=\"log-out\" style=\"width:14px\"></i>Logout Account</a></li>\n    "); // Initialize feather icons in dropdown

    if (window.feather) window.feather.replace(); // Logout listener

    document.getElementById('logout-btn').addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('optix-token');
      localStorage.removeItem('optix-user');
      window.location.reload();
    });
  }
};
/*-----------------------------------------------
|   Top navigation opacity on scroll
-----------------------------------------------*/


var navbarInit = function navbarInit() {
  var Selector = {
    NAVBAR: '[data-navbar-on-scroll]',
    NAVBAR_COLLAPSE: '.navbar-collapse',
    NAVBAR_TOGGLER: '.navbar-toggler'
  };
  var ClassNames = {
    COLLAPSED: 'collapsed'
  };
  var Events = {
    SCROLL: 'scroll',
    SHOW_BS_COLLAPSE: 'show.bs.collapse',
    HIDE_BS_COLLAPSE: 'hide.bs.collapse',
    HIDDEN_BS_COLLAPSE: 'hidden.bs.collapse'
  };
  var DataKey = {
    NAVBAR_ON_SCROLL: 'navbar-light-on-scroll'
  };
  var navbar = document.querySelector(Selector.NAVBAR); // responsive nav collapsed

  navbar.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link') && window.innerWidth < utils.getBreakpoint(navbar)) {
      navbar.querySelector(Selector.NAVBAR_TOGGLER).click();
    }
  });

  if (navbar) {
    var windowHeight = window.innerHeight;
    var html = document.documentElement;
    var navbarCollapse = navbar.querySelector(Selector.NAVBAR_COLLAPSE);

    var allColors = _objectSpread(_objectSpread({}, utils.colors), utils.grays);

    var name = utils.getData(navbar, DataKey.NAVBAR_ON_SCROLL);
    var colorName = Object.keys(allColors).includes(name) ? name : 'white';
    var color = allColors[colorName];
    var bgClassName = "bg-".concat(colorName);
    var shadowName = 'shadow-transition';
    var colorRgb = utils.hexToRgb(color);

    var _window$getComputedSt = window.getComputedStyle(navbar),
        backgroundImage = _window$getComputedSt.backgroundImage;

    var transition = 'background-color 0.35s ease';
    navbar.style.backgroundImage = 'none'; // Change navbar background color on scroll

    window.addEventListener(Events.SCROLL, function () {
      var scrollTop = html.scrollTop;
      var alpha = scrollTop / windowHeight * 0.75; // Add class on scroll

      navbar.classList.add('backdrop');

      if (alpha === 0) {
        navbar.classList.remove('backdrop');
      }

      alpha >= 1 && (alpha = 0.75);
      navbar.style.backgroundColor = "rgba(".concat(colorRgb[0], ", ").concat(colorRgb[1], ", ").concat(colorRgb[2], ", ").concat(alpha, ")");
      navbar.style.backgroundImage = alpha > 0 || utils.hasClass(navbarCollapse, 'show') ? backgroundImage : 'none';
      alpha > 0 || utils.hasClass(navbarCollapse, 'show') ? navbar.classList.add(shadowName) : navbar.classList.remove(shadowName);
    }); // Toggle bg class on window resize

    utils.resize(function () {
      var breakPoint = utils.getBreakpoint(navbar);

      if (window.innerWidth > breakPoint) {
        navbar.style.backgroundImage = html.scrollTop ? backgroundImage : 'none';
        navbar.style.transition = 'none';
      } else if (!utils.hasClass(navbar.querySelector(Selector.NAVBAR_TOGGLER), ClassNames.COLLAPSED)) {
        navbar.classList.add(bgClassName);
        navbar.classList.add(shadowName);
        navbar.style.backgroundImage = backgroundImage;
      }

      if (window.innerWidth <= breakPoint) {
        navbar.style.transition = utils.hasClass(navbarCollapse, 'show') ? transition : 'none';
      }
    });
    navbarCollapse.addEventListener(Events.SHOW_BS_COLLAPSE, function () {
      navbar.classList.add(bgClassName);
      navbar.classList.add(shadowName);
      navbar.style.backgroundImage = backgroundImage;
      navbar.style.transition = transition;
    });
    navbarCollapse.addEventListener(Events.HIDE_BS_COLLAPSE, function () {
      navbar.classList.remove(bgClassName);
      navbar.classList.remove(shadowName);
      !html.scrollTop && (navbar.style.backgroundImage = 'none');
    });
    navbarCollapse.addEventListener(Events.HIDDEN_BS_COLLAPSE, function () {
      navbar.style.transition = 'none';
    });
  }
};
/* eslint-disable */

/* exported cartLogicInit */

/* eslint-disable no-param-reassign */

/* -------------------------------------------------------------------------- */

/*                            Cart Logic Functionality                        */

/* -------------------------------------------------------------------------- */


var cartLogicInit = function cartLogicInit() {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.buy-now-btn');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var wrapper = btn.closest('.eyewear-card-wrapper');
    if (!wrapper) return;
    var product = {
      id: wrapper.dataset.productId,
      image: wrapper.dataset.productImage,
      brand: wrapper.dataset.productBrand,
      price: wrapper.dataset.productPrice,
      originalPrice: wrapper.dataset.productOriginalPrice,
      discount: wrapper.dataset.productDiscount,
      quantity: 1
    };
    var cart = JSON.parse(localStorage.getItem('optix-cart') || '[]');
    var existingIndex = cart.findIndex(function (item) {
      return item.id === product.id;
    });

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem('optix-cart', JSON.stringify(cart));
    var originalText = btn.innerText;
    btn.innerText = 'ADDED TO CART';
    var originalBg = btn.style.backgroundColor;
    btn.style.backgroundColor = '#28a745';
    btn.style.borderColor = '#28a745';
    setTimeout(function () {
      btn.innerText = originalText;
      btn.style.backgroundColor = originalBg;
      btn.style.borderColor = '';
    }, 1500);
  });
};
/* eslint-disable */

/* exported cartPageInit */

/* eslint-disable no-param-reassign */

/* -------------------------------------------------------------------------- */

/*                            Cart Page Rendering                             */

/* -------------------------------------------------------------------------- */


var cartPageInit = function cartPageInit() {
  var container = document.getElementById('cart-items-container');
  var emptyMsg = document.getElementById('empty-cart-msg');
  var summary = document.getElementById('cart-summary');
  var subtotalEl = document.getElementById('cart-subtotal');
  var totalEl = document.getElementById('cart-total');
  if (!container) return;

  var renderCart = function renderCart() {
    var cart = JSON.parse(localStorage.getItem('optix-cart') || '[]');

    if (cart.length === 0) {
      container.innerHTML = '';
      emptyMsg.classList.remove('d-none');
      summary.classList.add('d-none');
      return;
    }

    emptyMsg.classList.add('d-none');
    summary.classList.remove('d-none');
    var subtotal = 0;
    container.innerHTML = cart.map(function (item) {
      // Remove commas from price string for calculation
      var priceNum = parseInt(item.price.replace(/,/g, ''), 10);
      subtotal += priceNum * item.quantity;
      return "\n        <div class=\"card border-0 shadow-sm rounded-3 p-3 mb-3 cart-item\" data-product-id=\"".concat(item.id, "\">\n          <div class=\"row align-items-center\">\n            <div class=\"col-md-2\">\n              <img src=\"assets/img/gallery/").concat(item.image, "\" alt=\"").concat(item.brand, "\" class=\"img-fluid rounded\">\n            </div>\n            <div class=\"col-md-4\">\n              <h6 class=\"fw-bold mb-1\">").concat(item.brand, "</h6>\n              <p class=\"text-muted small mb-0\">Premium Eyewear</p>\n            </div>\n            <div class=\"col-md-3\">\n              <div class=\"d-flex align-items-center gap-2\">\n                <button class=\"btn btn-sm btn-outline-dark rounded-circle btn-quantity\" data-action=\"dec\" style=\"width: 28px; height: 28px; padding: 0;\">-</button>\n                <span class=\"fw-bold\">").concat(item.quantity, "</span>\n                <button class=\"btn btn-sm btn-outline-dark rounded-circle btn-quantity\" data-action=\"inc\" style=\"width: 28px; height: 28px; padding: 0;\">+</button>\n              </div>\n            </div>\n            <div class=\"col-md-2 text-end\">\n              <p class=\"fw-bold mb-0\">\u20B9").concat(item.price, "</p>\n            </div>\n            <div class=\"col-md-1 text-end\">\n              <button class=\"btn btn-link text-danger p-0 btn-remove-cart\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-trash-2\"><polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"></line><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"></line></svg>\n              </button>\n            </div>\n          </div>\n        </div>\n      ");
    }).join('');
    subtotalEl.innerText = "\u20B9".concat(subtotal.toLocaleString());
    totalEl.innerText = "\u20B9".concat(subtotal.toLocaleString()); // Add Listeners

    container.querySelectorAll('.btn-quantity').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.dataset.action;
        var id = btn.closest('.cart-item').dataset.productId;
        var currentCart = JSON.parse(localStorage.getItem('optix-cart') || '[]');
        var item = currentCart.find(function (i) {
          return i.id === id;
        });

        if (action === 'inc') {
          item.quantity += 1;
        } else if (action === 'dec' && item.quantity > 1) {
          item.quantity -= 1;
        }

        localStorage.setItem('optix-cart', JSON.stringify(currentCart));
        renderCart();
      });
    });
    container.querySelectorAll('.btn-remove-cart').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.closest('.cart-item').dataset.productId;
        var currentCart = JSON.parse(localStorage.getItem('optix-cart') || '[]');
        currentCart = currentCart.filter(function (i) {
          return i.id !== id;
        });
        localStorage.setItem('optix-cart', JSON.stringify(currentCart));
        renderCart();
      });
    });
  };

  renderCart();
};
/* eslint-disable */

/* exported dynamicProductsInit */

/* -------------------------------------------------------------------------- */

/*                            Dynamic Product Loader                          */

/* -------------------------------------------------------------------------- */


var dynamicProductsInit = function dynamicProductsInit() {
  var grid = document.querySelector('.eyewear-grid[data-category]');
  if (!grid) return;
  var category = grid.dataset.category;
  var API_URL = "http://localhost:8080/api/products?category=".concat(category); // Using .then instead of async/await to avoid regeneratorRuntime errors

  fetch(API_URL).then(function (response) {
    if (!response.ok) throw new Error('API connection failed');
    return response.json();
  }).then(function (products) {
    if (products && products.length > 0) {
      grid.innerHTML = ''; // Clear static fallback products

      products.forEach(function (product, index) {
        var cardHtml = "\n            <div class=\"eyewear-card-wrapper animate-on-scroll is-visible\" \n                 style=\"transition-delay: ".concat(index * 0.1, "s\"\n                 data-product-id=\"").concat(product.brand, "-").concat(product.image, "\"\n                 data-product-image=\"").concat(product.image, "\"\n                 data-product-brand=\"").concat(product.brand, "\"\n                 data-product-price=\"").concat(product.price, "\"\n                 data-product-original-price=\"").concat(product.originalPrice, "\"\n                 data-product-discount=\"").concat(product.discount, "\">\n              <div class=\"card eyewear-card h-100 border-0\">\n                <div class=\"eyewear-img-container\">\n                  <img class=\"card-img-top\" src=\"assets/img/gallery/").concat(product.image, "\" alt=\"").concat(product.brand, "\" />\n                </div>\n                <div class=\"card-body pb-0\">\n                  <p class=\"product-brand\">").concat(product.brand, "</p>\n                  <div class=\"price-section\">\n                    <span class=\"current-price\">\u20B9").concat(product.price, "</span>\n                    <span class=\"original-price\">\u20B9").concat(product.originalPrice, "</span>\n                  </div>\n                  <p class=\"discount-badge\">").concat(product.discount, "% OFF</p>\n                </div>\n                <div class=\"card-footer eyewear-card-footer bg-transparent border-0 pt-0 pb-4 px-3\">\n                  <div class=\"d-flex align-items-center gap-2\">\n                    <button class=\"btn btn-dark flex-grow-1 buy-now-btn\">BUY NOW</button>\n                    <button class=\"btn btn-fav\">\n                      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-heart\">\n                        <path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"></path>\n                      </svg>\n                    </button>\n                  </div>\n                </div>\n              </div>\n            </div>\n          ");
        grid.insertAdjacentHTML('beforeend', cardHtml);
      });
      window.dispatchEvent(new Event('productsLoaded'));
      console.log("Successfully loaded ".concat(products.length, " products from database."));
    }
  })["catch"](function (error) {
    console.warn('Backend not available. Displaying static fallback products.', error.message);
  });
};
/* eslint-disable */

/* exported favButtonInit */

/* eslint-disable no-param-reassign */

/* -------------------------------------------------------------------------- */

/*                            Favorite Button Functionality                   */

/* -------------------------------------------------------------------------- */


var favButtonInit = function favButtonInit() {
  var updateActiveStates = function updateActiveStates() {
    var wishlist = JSON.parse(localStorage.getItem('optix-wishlist') || '[]');
    document.querySelectorAll('.btn-fav').forEach(function (btn) {
      var wrapper = btn.closest('.eyewear-card-wrapper');

      if (wrapper && wishlist.some(function (item) {
        return item.id === wrapper.dataset.productId;
      })) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  updateActiveStates();
  window.addEventListener('productsLoaded', updateActiveStates);
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-fav');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var wrapper = btn.closest('.eyewear-card-wrapper');
    if (!wrapper) return;
    btn.classList.toggle('active');
    var productId = wrapper.dataset.productId;
    var currentWishlist = JSON.parse(localStorage.getItem('optix-wishlist') || '[]');

    if (btn.classList.contains('active')) {
      var product = {
        id: wrapper.dataset.productId,
        image: wrapper.dataset.productImage,
        brand: wrapper.dataset.productBrand,
        price: wrapper.dataset.productPrice,
        originalPrice: wrapper.dataset.productOriginalPrice,
        discount: wrapper.dataset.productDiscount
      };

      if (!currentWishlist.some(function (item) {
        return item.id === product.id;
      })) {
        currentWishlist.push(product);
      }
    } else {
      currentWishlist = currentWishlist.filter(function (item) {
        return item.id !== productId;
      });
    }

    localStorage.setItem('optix-wishlist', JSON.stringify(currentWishlist));
    btn.style.transform = 'scale(1.2)';
    setTimeout(function () {
      btn.style.transform = '';
    }, 150);
  });
};

var scrollAnimationsInit = function scrollAnimationsInit() {
  var observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  var animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(function (el) {
    return observer.observe(el);
  });
};
/* -------------------------------------------------------------------------- */

/*                                Scroll To Top                               */

/* -------------------------------------------------------------------------- */


var scrollToTop = function scrollToTop() {
  document.querySelectorAll('[data-anchor] > a, [data-scroll-to]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var _utils$getData;

      e.preventDefault();
      var el = e.target;
      var id = utils.getData(el, 'scroll-to') || el.getAttribute('href');
      window.scroll({
        top: (_utils$getData = utils.getData(el, 'offset-top')) !== null && _utils$getData !== void 0 ? _utils$getData : utils.getOffset(document.querySelector(id)).top - 100,
        left: 0,
        behavior: 'smooth'
      });
      window.location.hash = id;
    });
  });
};
/* eslint-disable */

/* exported wishlistPageInit */

/* eslint-disable no-param-reassign */

/* -------------------------------------------------------------------------- */

/*                            Wishlist Page Rendering                         */

/* -------------------------------------------------------------------------- */


var wishlistPageInit = function wishlistPageInit() {
  var container = document.getElementById('wishlist-container');
  var emptyMsg = document.getElementById('empty-wishlist-msg');
  if (!container) return;

  var renderWishlist = function renderWishlist() {
    var wishlist = JSON.parse(localStorage.getItem('optix-wishlist') || '[]');

    if (wishlist.length === 0) {
      container.innerHTML = '';
      emptyMsg.classList.remove('d-none');
      return;
    }

    emptyMsg.classList.add('d-none');
    container.innerHTML = wishlist.map(function (product) {
      return "\n      <div class=\"eyewear-card-wrapper is-visible\" \n           data-product-id=\"".concat(product.id, "\"\n           data-product-image=\"").concat(product.image, "\"\n           data-product-brand=\"").concat(product.brand, "\"\n           data-product-price=\"").concat(product.price, "\"\n           data-product-original-price=\"").concat(product.originalPrice, "\"\n           data-product-discount=\"").concat(product.discount, "\">\n        <div class=\"card eyewear-card h-100 border-0\">\n          <div class=\"eyewear-img-container\">\n            <img class=\"card-img-top\" src=\"assets/img/gallery/").concat(product.image, "\" alt=\"").concat(product.brand, "\" />\n          </div>\n          <div class=\"card-body pb-0\">\n            <p class=\"product-brand\">").concat(product.brand, "</p>\n            <div class=\"price-section\">\n              <span class=\"current-price\">\u20B9").concat(product.price, "</span>\n              <span class=\"original-price\">\u20B9").concat(product.originalPrice, "</span>\n            </div>\n            <p class=\"discount-badge\">").concat(product.discount, "% OFF</p>\n          </div>\n          <div class=\"card-footer eyewear-card-footer bg-transparent border-0 pt-0 pb-4 px-3\">\n            <div class=\"d-flex align-items-center gap-2\">\n              <button class=\"btn btn-dark flex-grow-1 buy-now-btn\">BUY NOW</button>\n              <button class=\"btn btn-fav active\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"#ff4d4d\" stroke=\"#ff4d4d\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-heart\">\n                  <path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"></path>\n                </svg>\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n    ");
    }).join(''); // Re-initialize listeners for the newly rendered buttons

    container.querySelectorAll('.btn-fav').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wrapper = btn.closest('.eyewear-card-wrapper');
        var productId = wrapper.dataset.productId;
        var currentWishlist = JSON.parse(localStorage.getItem('optix-wishlist') || '[]');
        currentWishlist = currentWishlist.filter(function (item) {
          return item.id !== productId;
        });
        localStorage.setItem('optix-wishlist', JSON.stringify(currentWishlist));
        renderWishlist(); // Re-render the page
      });
    });
  };

  renderWishlist();
};
/* eslint-disable */

/* global navbarInit, detectorInit, scrollToTop, scrollAnimationsInit, favButtonInit, wishlistPageInit, cartLogicInit, cartPageInit, dynamicProductsInit, adminDashboardInit, authInit, userNavInit */

/* -------------------------------------------------------------------------- */

/*                            Theme Initialization                            */

/* -------------------------------------------------------------------------- */


docReady(navbarInit);
docReady(detectorInit);
docReady(scrollToTop);
docReady(scrollAnimationsInit);
docReady(favButtonInit);
docReady(wishlistPageInit);
docReady(cartLogicInit);
docReady(cartPageInit);
docReady(dynamicProductsInit);
docReady(adminDashboardInit);
docReady(authInit);
docReady(userNavInit);
//# sourceMappingURL=theme.js.map
