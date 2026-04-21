(function () {
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  function formatPrice(price) {
    return '$' + price.toFixed(2);
  }

  function ratingStarsHtml(rating) {
    var full = Math.floor(rating);
    var stars = '';
    for (var i = 0; i < full; i++) stars += '★';
    for (var i = full; i < 5; i++) stars += '☆';
    return '<span class="stars">' + stars + '</span>';
  }

  var cartIconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';

  function productCardHtml(p) {
    var href = 'product.html?id=' + encodeURIComponent(p.id);
    return '<article class="product-card" data-product-id="' + p.id + '">' +
      '<a class="product-card__media" href="' + href + '">' +
        '<img class="product-card__img" src="' + escapeHtml(p.image) + '" alt="" width="360" height="240" loading="lazy">' +
      '</a>' +
      '<div class="product-card__body">' +
        '<h3 class="product-card__title"><a href="' + href + '">' + escapeHtml(p.name) + '</a></h3>' +
        '<div class="product-card__rating-row">' +
          ratingStarsHtml(p.rating) +
          '<span class="product-card__rating-num">(' + p.rating.toFixed(1) + ')</span>' +
        '</div>' +
        '<p class="product-card__price">' + formatPrice(p.price) + '</p>' +
        '<p class="product-card__category">' + escapeHtml(p.category) + '</p>' +
        '<button type="button" class="product-card__add" data-add-cart="' + p.id + '">' +
          cartIconSvg +
          '<span>Add to Cart</span>' +
        '</button>' +
      '</div>' +
    '</article>';
  }

  var root = document.querySelector('.main__products');
  if (root && window.BUILDMART_PRODUCTS) {
    var html = '';
    for (var i = 0; i < window.BUILDMART_PRODUCTS.length; i++) {
      html += productCardHtml(window.BUILDMART_PRODUCTS[i]);
    }
    root.innerHTML = html;
  }
})();