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

  function render() {
    const tbody = document.getElementById("cart-lines");
    const empty = document.getElementById("cart-empty");
    const tableCard = document.querySelector(".cart-table-card");
    if (!tbody) return;

    const cart = window.buildMartGetCart ? window.buildMartGetCart() : [];
    const lines = cart
      .map((line) => {
        const p = window.buildMartGetProductById
          ? window.buildMartGetProductById(line.id)
          : null;
        return p ? { ...line, product: p } : null;
      })
      .filter(Boolean);

    const layout = document.getElementById("cart-page-layout");

    if (lines.length === 0) {
      tbody.innerHTML = "";
      if (empty) empty.hidden = false;
      if (tableCard) tableCard.hidden = true;
      if (layout) layout.hidden = true;
      document.getElementById("cart-subtotal")?.replaceChildren(document.createTextNode(formatPrice(0)));
      document.getElementById("cart-tax")?.replaceChildren(document.createTextNode(formatPrice(0)));
      document.getElementById("cart-total")?.replaceChildren(document.createTextNode(formatPrice(0)));
      return;
    }

    if (empty) empty.hidden = true;
    if (tableCard) tableCard.hidden = false;
    if (layout) layout.hidden = false;

    let subtotal = 0;
    tbody.innerHTML = lines
      .map((line) => {
        const lineTotal = line.product.price * line.qty;
        subtotal += lineTotal;
        return `
<div class="cart-item" data-id="${escapeHtml(line.id)}">
      <div class="cart-item__grid">
        <!-- Product info -->
        <div class="cart-item__product">
          <a href="/product/${line.product.id}" class="cart-item__thumb-link">
            <img class="cart-item__thumb" src="${escapeHtml(line.product.image)}" alt="${escapeHtml(line.product.name)}">
          </a>
          <div class="cart-item__info">
            <a href="/product.html?id=${line.product.id}" class="cart-item__name">${escapeHtml(line.product.name)}</a>
            <p class="cart-item__cat">${escapeHtml(line.product.category)}</p>
            <!-- Кнопка удаления (только на мобильных) -->
            <button type="button" class="cart-item__remove-mobile" data-cart-remove="${escapeHtml(line.id)}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
              Remove
            </button>
          </div>
        </div>
        
        <!-- Price -->
        <div class="cart-item__price">
          <span class="cart-item__label">Price:</span>
          <span class="cart-item__price-value">${formatPrice(line.product.price)}</span>
        </div>
        
        <!-- Quantity -->
        <div class="cart-item__qty">
          <div class="cart-qty" role="group" aria-label="Quantity for ${escapeHtml(line.product.name)}">
            <button type="button" data-cart-dec="${escapeHtml(line.id)}" aria-label="Decrease quantity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"/>
              </svg>
            </button>
            <span>${line.qty}</span>
            <button type="button" data-cart-inc="${escapeHtml(line.id)}" aria-label="Increase quantity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"/><path d="M12 5v14"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Total -->
        <div class="cart-item__total">
          <span class="cart-item__label">Total:</span>
          <span class="cart-item__total-value">${formatPrice(lineTotal)}</span>
          <!-- Кнопка удаления (на десктопе) -->
          <button type="button" class="cart-item__remove-desktop" data-cart-remove="${escapeHtml(line.id)}" aria-label="Remove item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
      })
      .join("");

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    document.getElementById("cart-subtotal")?.replaceChildren(document.createTextNode(formatPrice(subtotal)));
    document.getElementById("cart-tax")?.replaceChildren(document.createTextNode(formatPrice(tax)));
    document.getElementById("cart-total")?.replaceChildren(document.createTextNode(formatPrice(total)));
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    window.addEventListener("buildmart-cart-changed", render);

    const tbody = document.getElementById("cart-lines");
    tbody?.addEventListener("click", (e) => {
      const inc = e.target.closest("[data-cart-inc]");
      const dec = e.target.closest("[data-cart-dec]");
      const rem = e.target.closest("[data-cart-remove]");
      const id = inc?.getAttribute("data-cart-inc") ||
        dec?.getAttribute("data-cart-dec") ||
        rem?.getAttribute("data-cart-remove");
      if (!id || !window.buildMartGetCart || !window.buildMartSetCart) return;

      let cart = window.buildMartGetCart();
      const idx = cart.findIndex((x) => x.id === id);
      if (idx < 0) return;

      if (rem) {
        cart.splice(idx, 1);
      } else if (inc) {
        cart[idx].qty += 1;
      } else if (dec) {
        cart[idx].qty -= 1;
        if (cart[idx].qty < 1) cart.splice(idx, 1);
      }
      window.buildMartSetCart(cart);
    });
  });
})();
