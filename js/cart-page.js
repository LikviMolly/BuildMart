(function () {
  function formatPrice(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const TAX_RATE = 0.08;
  let currentDiscount = 0;

  function render() {
    const tbody = document.getElementById("cart-lines");
    const empty = document.getElementById("cart-empty");
    const tableCard = document.getElementById("cart-table-card");
    const promo = document.getElementById("cart-promo");
    const sidebar = document.getElementById("cart-sidebar");
    const pageTitle = document.getElementById("cart-page__title");

    if (!tbody) return;

    const cart = window.buildMartGetCart ? window.buildMartGetCart() : [];

    const lines = [];
    for (let i = 0; i < cart.length; i++) {
      const line = cart[i];
      const product = window.buildMartGetProductById ? window.buildMartGetProductById(line.id) : null;
      if (product) {
        lines.push({
          id: line.id,
          qty: line.qty,
          product: product
        });
      }
    }
    
    if (lines.length === 0) {
      tbody.innerHTML = "";
      if (empty) empty.hidden = false;
      if (tableCard) tableCard.hidden = true;
      if (promo) promo.hidden = true;
      if (sidebar) sidebar.hidden = true;
      if (pageTitle) pageTitle.hidden = true;
      currentDiscount = 0;
      
      document.getElementById("cart-subtotal").innerText = formatPrice(0);
      document.getElementById("cart-tax").innerText = formatPrice(0);
      document.getElementById("cart-total").innerText = formatPrice(0);
      return;
    }

    if (empty) empty.hidden = true;
    if (tableCard) tableCard.hidden = false;
    if (promo) promo.hidden = false;
    if (sidebar) sidebar.hidden = false;
    if (pageTitle) pageTitle.hidden = false;

    let subtotal = 0;
    let html = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineTotal = line.product.price * line.qty;
      subtotal += lineTotal;
      
      html += `
        <div class="cart-item" data-id="${escapeHtml(line.id)}">
          <div class="cart-item__grid">
            <div class="cart-item__product">
              <a href="/product/${line.product.id}" class="cart-item__thumb-link">
                <img class="cart-item__thumb" src="${escapeHtml(line.product.image)}" alt="${escapeHtml(line.product.name)}">
              </a>
              <div class="cart-item__info">
                <a href="/product.html?id=${line.product.id}" class="cart-item__name">${escapeHtml(line.product.name)}</a>
                <p class="cart-item__cat">${escapeHtml(line.product.category)}</p>
                <button type="button" class="cart-item__remove-mobile" data-cart-remove="${escapeHtml(line.id)}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                  Remove
                </button>
              </div>
            </div>
            
            <div class="cart-item__price">
              <span class="cart-item__label">Price:</span>
              <span class="cart-item__price-value">${formatPrice(line.product.price)}</span>
            </div>
            
            <div class="cart-item__qty">
              <div class="cart-qty">
                <button type="button" data-cart-dec="${escapeHtml(line.id)}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"/>
                  </svg>
                </button>
                <span>${line.qty}</span>
                <button type="button" data-cart-inc="${escapeHtml(line.id)}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"/><path d="M12 5v14"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="cart-item__total">
              <span class="cart-item__label">Total:</span>
              <span class="cart-item__total-value">${formatPrice(lineTotal)}</span>
              <button type="button" class="cart-item__remove-desktop" data-cart-remove="${escapeHtml(line.id)}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    tbody.innerHTML = html;

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax - currentDiscount;

    document.getElementById("cart-subtotal").innerText = formatPrice(subtotal);
    document.getElementById("cart-tax").innerText = formatPrice(tax);
    if (document.getElementById("cart-discount")) {
      document.getElementById("cart-discount").innerText = formatPrice(currentDiscount);
    }
    document.getElementById("cart-total").innerText = formatPrice(total);
  }

  function handleCartClick(e) {
    const incBtn = e.target.closest("[data-cart-inc]");
    const decBtn = e.target.closest("[data-cart-dec]");
    const removeBtn = e.target.closest("[data-cart-remove]");
    
    let id = null;
    let action = null;
    
    if (incBtn) {
      id = incBtn.getAttribute("data-cart-inc");
      action = "inc";
    } else if (decBtn) {
      id = decBtn.getAttribute("data-cart-dec");
      action = "dec";
    } else if (removeBtn) {
      id = removeBtn.getAttribute("data-cart-remove");
      action = "remove";
    }
    
    if (!id || !action) return;
    if (!window.buildMartGetCart || !window.buildMartSetCart) return;
    
    let cart = window.buildMartGetCart();
    
    let index = -1;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        index = i;
        break;
      }
    }
    
    if (index === -1) return;
    
    if (action === "inc") {
      cart[index].qty = cart[index].qty + 1;
    } else if (action === "dec") {
      cart[index].qty = cart[index].qty - 1;
      if (cart[index].qty < 1) {
        cart.splice(index, 1);
      }
    } else if (action === "remove") {
      cart.splice(index, 1);
    }
    
    window.buildMartSetCart(cart);
  }

  function setupPromoCodeHandler() {
    const promoInput = document.querySelector('.cart-promo__input');
    const promoHint = document.getElementById('promo-hint');
    const applyBtn = document.getElementById('apply-promo');
    
    if (!promoInput || !promoHint) return;
    
    promoInput.addEventListener('input', function() {
      const hasText = this.value.trim().length > 0;
      promoHint.hidden = !hasText;
      
      if (hasText && promoHint.innerText !== "Try code: BUILD10 for 10% off") {
        promoHint.innerText = "Try code: BUILD10 for 10% off";
        promoHint.style.color = '';
      }
    });
    
    if (applyBtn) {
      applyBtn.addEventListener('click', function() {
        const code = promoInput.value.trim();
        
        if (code === 'BUILD10') {
          const cart = window.buildMartGetCart ? window.buildMartGetCart() : [];
          let subtotal = 0;
          
          for (let i = 0; i < cart.length; i++) {
            const product = window.buildMartGetProductById ? window.buildMartGetProductById(cart[i].id) : null;
            if (product) {
              subtotal += product.price * cart[i].qty;
            }
          }
          
          currentDiscount = subtotal / 10;
          promoHint.innerText = "✓ Promo code applied! You saved 10%";
          promoHint.style.color = 'var(--color-green-600)';
          promoHint.hidden = false;
          promoInput.disabled = true;
          applyBtn.disabled = true;

          document.getElementById("cart-summary__row--discount").hidden = false;
          
          render(); 
        } else if (code.length > 0) {
            promoHint.hidden = false;
            currentDiscount = 0;
            render();
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    render();
    setupPromoCodeHandler();
    window.addEventListener("buildmart-cart-changed", function() {
      const promoInput = document.querySelector('.cart-promo__input');
      const applyBtn = document.getElementById('apply-promo');
      
      if (promoInput) promoInput.disabled = false;
      if (applyBtn) applyBtn.disabled = false;
      currentDiscount = 0;
      render();
    });
    
    const tbody = document.getElementById("cart-lines");
    if (tbody) {
      tbody.addEventListener("click", handleCartClick);
    }
  });
})();