(function () {
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatRating(r) {
    return (Math.round(Number(r) * 10) / 10).toFixed(1);
  }

  function formatPrice(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  function ratingStarsHtml(rating, prefix) {
    const r = Number(rating) || 0;
    let html = `<span class="${prefix}__stars" aria-hidden="true">`;
    for (let i = 1; i <= 5; i++) {
      const on = i <= Math.floor(r);
      const half = !on && i - 1 < r && r < i;
      html += `<span class="${prefix}__star${on ? ` ${prefix}__star--on` : ""}${half ? ` ${prefix}__star--half` : ""}">★</span>`;
    }
    html += "</span>";
    return html;
  }

  const cartIconSvg = `<svg class="btn__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`;

  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const product = id && window.buildMartGetProductById
      ? window.buildMartGetProductById(id)
      : null;

    if (!product) {
      window.location.replace("index.html");
      return;
    }

    document.title = `${product.name} — BuildMart`;

    const bc = document.getElementById("breadcrumb-current");
    if (bc) bc.textContent = product.name;

    const imgs = product.gallery && product.gallery.length
      ? product.gallery
      : [product.image];

    let idx = 0;
    const mainImg = document.getElementById("product-main-img");
    const thumbsRoot = document.getElementById("gallery-thumbs");

    function showImage(i) {
      idx = (i + imgs.length) % imgs.length;
      if (mainImg) {
        mainImg.src = imgs[idx];
        mainImg.alt = product.name;
      }
      if (thumbsRoot) {
        thumbsRoot.querySelectorAll(".product-gallery__thumb").forEach((btn, j) => {
          btn.classList.toggle("product-gallery__thumb--active", j === idx);
        });
      }
    }

    if (thumbsRoot) {
      thumbsRoot.innerHTML = imgs
        .map(
          (src, j) =>
            `<button type="button" class="product-gallery__thumb${j === 0 ? " product-gallery__thumb--active" : ""}" data-idx="${j}" aria-label="Show image ${j + 1}"><img src="${escapeHtml(src)}" alt=""></button>`,
        )
        .join("");
      thumbsRoot.addEventListener("click", (e) => {
        const btn = e.target.closest(".product-gallery__thumb");
        if (!btn) return;
        showImage(Number(btn.getAttribute("data-idx")));
      });
    }

    document.getElementById("gallery-prev")?.addEventListener("click", () => {
      showImage(idx - 1);
    });
    document.getElementById("gallery-next")?.addEventListener("click", () => {
      showImage(idx + 1);
    });

    showImage(0);

    const titleEl = document.getElementById("product-title");
    if (titleEl) titleEl.textContent = product.name;

    const ratingRow = document.getElementById("product-rating-row");
    if (ratingRow) {
      ratingRow.innerHTML = `${ratingStarsHtml(product.rating, "product-buy")}<span class="product-buy__rating-num">(${formatRating(product.rating)})</span>`;
    }

    const priceEl = document.getElementById("product-price");
    if (priceEl) {
      priceEl.innerHTML = `${formatPrice(product.price)} <span>/unit</span>`;
    }

    const descEl = document.getElementById("product-description-text");
    if (descEl) descEl.textContent = product.description || "";

    let qty = 1;
    const qtyVal = document.getElementById("product-qty-value");
    function renderQty() {
      if (qtyVal) qtyVal.textContent = String(qty);
    }
    renderQty();

    document.getElementById("product-qty-minus")?.addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      renderQty();
    });
    document.getElementById("product-qty-plus")?.addEventListener("click", () => {
      qty += 1;
      renderQty();
    });

    document.getElementById("product-add-cart")?.addEventListener("click", () => {
      if (window.buildMartAddToCart) window.buildMartAddToCart(product.id, qty);
    });

    document.getElementById("product-buy-now")?.addEventListener("click", () => {
      if (window.buildMartAddToCart) window.buildMartAddToCart(product.id, qty);
      window.location.href = "cart.html";
    });
  });
})();
