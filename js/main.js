(function () {
  const CART_KEY = "buildmart-cart";
  const TOAST_MAX = 5;
  const TOAST_MS = 4200;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureToastStack() {
    let el = document.getElementById("toast-stack");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast-stack";
      el.className = "toast-stack";
      el.setAttribute("aria-live", "polite");
      el.setAttribute("aria-relevant", "additions text");
      document.body.appendChild(el);
    }
    return el;
  }

  function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    window.clearTimeout(Number(toast.dataset.timerId) || 0);
    toast.dataset.timerId = "";
    if (toast.classList.contains("toast--out")) return;
    toast.classList.remove("toast--visible");
    toast.classList.add("toast--out");
    let removed = false;
    const remove = () => {
      if (removed) return;
      removed = true;
      toast.remove();
    };
    toast.addEventListener("transitionend", remove, { once: true });
    window.setTimeout(remove, 400);
  }

  function showCartToast(productName, qty) {
    const stack = ensureToastStack();
    const name = escapeHtml(productName);
    const q = Math.max(1, Math.floor(Number(qty)) || 1);
    const line =
      q > 1
        ? `Added ${q}× ${name} to cart`
        : `Added ${name} to cart`;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = `
      <span class="toast__icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#111827"/>
          <path d="M7 12l3 3 7-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="toast__msg">${line}</span>
    `;

    while (stack.children.length >= TOAST_MAX) {
      const oldest = stack.lastElementChild;
      if (!oldest) break;
      window.clearTimeout(Number(oldest.dataset.timerId) || 0);
      oldest.remove();
    }

    stack.prepend(toast);
    [...stack.children].forEach((node, i) => {
      node.style.zIndex = String(900 + stack.children.length - i);
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add("toast--visible"));
    });

    toast.dataset.timerId = String(
      window.setTimeout(() => dismissToast(toast), TOAST_MS),
    );
  }

  window.buildMartShowCartToast = showCartToast;

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateBadge();
    window.dispatchEvent(new CustomEvent("buildmart-cart-changed"));
  }

  window.buildMartGetCart = getCart;
  window.buildMartSetCart = setCart;

  window.buildMartAddToCart = function (productId, qty) {
    const q = Math.max(1, Math.floor(Number(qty)) || 1);
    const cart = getCart();
    const idx = cart.findIndex((x) => x.id === productId);
    if (idx >= 0) cart[idx].qty += q;
    else cart.push({ id: productId, qty: q });
    setCart(cart);
    const p =
      window.buildMartGetProductById &&
      window.buildMartGetProductById(productId);
    showCartToast(p ? p.name : "Item", q);
  };

  function updateBadge() {
    const badge = document.querySelector(".cart__badge");
    if (!badge) return;
    const n = getCart().reduce((s, x) => s + x.qty, 0);
    badge.textContent = n > 99 ? "99+" : String(n);
    badge.hidden = n === 0;
    badge.setAttribute(
      "aria-label",
      n === 0 ? "Cart is empty" : `${n} items in cart`,
    );
  }

  window.buildMartUpdateBadge = updateBadge;

  function ratingStarsHtml(rating) {
    const r = Number(rating) || 0;
    let html = '<span class="product-card__stars" aria-hidden="true">';
    for (let i = 1; i <= 5; i++) {
      const on = i <= Math.floor(r);
      const half = !on && i - 1 < r && r < i;
      html += `<span class="product-card__star${on ? " product-card__star--on" : ""}${half ? " product-card__star--half" : ""}">★</span>`;
    }
    html += "</span>";
    return html;
  }

  function formatRating(r) {
    return (Math.round(Number(r) * 10) / 10).toFixed(1);
  }

  function formatPrice(n) {
    const v = Number(n);
    return v < 10 && v % 1 !== 0
      ? `$${v.toFixed(2)}`
      : `$${v.toFixed(2)}`;
  }

  const cartIconSvg = `<svg class="product-card__cart-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;

  function productCardHtml(p) {
    const href = `product.html?id=${encodeURIComponent(p.id)}`;
    return `
<article class="product-card" data-product-id="${p.id}">
  <a class="product-card__media" href="${href}">
    <img class="product-card__img" src="${p.image}" alt="" width="360" height="240" loading="lazy">
  </a>
  <div class="product-card__body">
    <h3 class="product-card__title"><a href="${href}">${escapeHtml(p.name)}</a></h3>
    <div class="product-card__rating-row">
      ${ratingStarsHtml(p.rating)}
      <span class="product-card__rating-num">(${formatRating(p.rating)})</span>
    </div>
    <p class="product-card__price">${formatPrice(p.price)}</p>
    <p class="product-card__category">${escapeHtml(p.category)}</p>
    <button type="button" class="product-card__add" data-add-cart="${p.id}">
      ${cartIconSvg}
      <span>Add to Cart</span>
    </button>
  </div>
</article>`;
  }

  function sortProducts(list, mode) {
    const out = list.slice();
    if (mode === "name-asc") {
      out.sort((a, b) => a.name.localeCompare(b.name));
    } else if (mode === "price-asc") {
      out.sort((a, b) => a.price - b.price);
    } else if (mode === "price-desc") {
      out.sort((a, b) => b.price - a.price);
    }
    return out;
  }

  const PRICE_FILTER_MAX = 400;

  function initCatalogFilters(panel, btn, onChange) {
    const label = btn.querySelector(".filters-btn__label");
    const minEl = document.getElementById("filter-price-min");
    const maxEl = document.getElementById("filter-price-max");
    const interval = document.getElementById("price-range-interval");
    const lMin = document.getElementById("price-label-min");
    const lMax = document.getElementById("price-label-max");

    function syncPriceRange() {
      if (!minEl || !maxEl) return;
      let min = Number(minEl.value);
      let max = Number(maxEl.value);
      if (min > max) {
        if (document.activeElement === minEl) maxEl.value = String(min);
        else minEl.value = String(max);
        min = Number(minEl.value);
        max = Number(maxEl.value);
      }
      if (interval) {
        const p1 = (min / PRICE_FILTER_MAX) * 100;
        const p2 = (max / PRICE_FILTER_MAX) * 100;
        interval.style.left = `${p1}%`;
        interval.style.width = `${Math.max(0, p2 - p1)}%`;
      }
      if (lMin) lMin.textContent = `$${min}`;
      if (lMax) lMax.textContent = `$${max}`;
      const zMin = min > PRICE_FILTER_MAX - 50 ? 3 : 2;
      const zMax = max < 50 ? 3 : 2;
      if (minEl) minEl.style.zIndex = String(zMin);
      if (maxEl) maxEl.style.zIndex = String(zMax);
    }

    btn.addEventListener("click", () => {
      const opening = panel.hidden;
      panel.hidden = !opening;
      btn.setAttribute("aria-expanded", opening ? "true" : "false");
      if (label) label.textContent = panel.hidden ? "Show Filters" : "Hide Filters";
    });

    minEl?.addEventListener("input", () => {
      syncPriceRange();
      onChange();
    });
    maxEl?.addEventListener("input", () => {
      syncPriceRange();
      onChange();
    });

    const ratingBoxes = panel.querySelectorAll('input[name="filter-rating"]');
    ratingBoxes.forEach((el) => {
      el.addEventListener("change", () => {
        if (el.checked) {
          ratingBoxes.forEach((other) => {
            if (other !== el) other.checked = false;
          });
        }
        onChange();
      });
    });

    document.getElementById("filters-clear")?.addEventListener("click", () => {
      ratingBoxes.forEach((el) => {
        el.checked = false;
      });
      if (minEl) minEl.value = "0";
      if (maxEl) maxEl.value = String(PRICE_FILTER_MAX);
      syncPriceRange();
      onChange();
    });

    syncPriceRange();
  }

  function initCatalog() {
    const root = document.querySelector(".main__products");
    if (!root || !window.BUILDMART_PRODUCTS) return;

    const products = window.BUILDMART_PRODUCTS;
    const sortSelect = document.getElementById("sort-select");
    const panel = document.getElementById("filters-panel");
    const filtersBtn = document.querySelector(".filters-btn");

    function getMinRatingFilter() {
      const selected = document.querySelector(
        'input[name="filter-rating"]:checked',
      );
      return selected ? Number(selected.value) : null;
    }

    function getPriceFilter() {
      const minEl = document.getElementById("filter-price-min");
      const maxEl = document.getElementById("filter-price-max");
      if (!minEl || !maxEl) {
        return { min: 0, max: PRICE_FILTER_MAX };
      }
      return {
        min: Number(minEl.value),
        max: Number(maxEl.value),
      };
    }

    function filtered() {
      let list = products.slice();
      const minR = getMinRatingFilter();
      if (minR !== null) {
        list = list.filter((p) => Number(p.rating) >= minR);
      }
      const { min, max } = getPriceFilter();
      list = list.filter((p) => p.price >= min && p.price <= max);
      return list;
    }

    function render() {
      const mode = sortSelect ? sortSelect.value : "name-asc";
      let list = filtered();
      list = sortProducts(list, mode);
      root.innerHTML = list.map(productCardHtml).join("");
      const countEl = document.querySelector(".products-count");
      if (countEl) {
        countEl.textContent = `Showing ${list.length} product${list.length === 1 ? "" : "s"}`;
      }
    }

    root.addEventListener("click", (e) => {
      const t = e.target.closest("[data-add-cart]");
      if (!t) return;
      const id = t.getAttribute("data-add-cart");
      if (id) window.buildMartAddToCart(id, 1);
    });

    if (sortSelect) sortSelect.addEventListener("change", render);

    if (panel && filtersBtn) {
      initCatalogFilters(panel, filtersBtn, render);
    }

    render();
  }

  function initMobileHeader() {
    const drawer = document.getElementById("header-mobile-drawer");
    const header = document.querySelector(".header");
    const burger = document.querySelector(".header__burger");
    const searchBtn = document.querySelector(".header__mobile-search-open");
    if (!drawer || !header || !burger || !searchBtn) return;

    const drawerInput = drawer.querySelector(".header__drawer-search-input");
    const mq = window.matchMedia("(max-width: 900px)");
    let open = false;

    function setOpen(next) {
      open = next;
      drawer.hidden = !open;
      header.classList.toggle("header--drawer-open", open);
      document.body.classList.toggle("header-drawer-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      searchBtn.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      searchBtn.setAttribute(
        "aria-label",
        open ? "Close menu and search" : "Open menu and search",
      );
    }

    burger.addEventListener("click", () => {
      setOpen(!open);
    });

    searchBtn.addEventListener("click", () => {
      const next = !open;
      setOpen(next);
      if (next && drawerInput) drawerInput.focus();
    });

    drawer.addEventListener("click", (e) => {
      const link = e.target.closest(".header__drawer-link");
      if (link) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    });

    function onMqChange() {
      if (!mq.matches && open) setOpen(false);
    }
    mq.addEventListener("change", onMqChange);
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateBadge();
    initCatalog();
    initMobileHeader();
  });
})();
