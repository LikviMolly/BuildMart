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
<tr data-id="${escapeHtml(line.id)}">
  <td>
    <div class="cart-line__product">
      <img class="cart-line__thumb" src="${escapeHtml(line.product.image)}" alt="">
      <div>
        <p class="cart-line__name">${escapeHtml(line.product.name)}</p>
        <p class="cart-line__cat">${escapeHtml(line.product.category)}</p>
      </div>
    </div>
  </td>
  <td class="col-price">${formatPrice(line.product.price)}</td>
  <td>
    <div class="cart-qty" role="group" aria-label="Quantity for ${escapeHtml(line.product.name)}">
      <button type="button" data-cart-dec="${escapeHtml(line.id)}" aria-label="Decrease quantity">−</button>
      <span>${line.qty}</span>
      <button type="button" data-cart-inc="${escapeHtml(line.id)}" aria-label="Increase quantity">+</button>
    </div>
  </td>
  <td class="col-total">${formatPrice(lineTotal)}</td>
  <td>
    <button type="button" class="cart-remove" data-cart-remove="${escapeHtml(line.id)}" aria-label="Remove item">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
    </button>
  </td>
</tr>`;
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
