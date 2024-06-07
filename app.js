const app = document.getElementById('app');
const API_BASE_URL = 'https://h6uc5l8b1g.execute-api.ap-northeast-2.amazonaws.com/dev/products';
const CART_STORAGE_KEY = 'products_cart';

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

async function fetchProducts() {
    const response = await fetch(API_BASE_URL);
    return response.json();
}

async function fetchProduct(productId) {
    const response = await fetch(`${API_BASE_URL}/${productId}`);
    return response.json();
}

function renderProductList() {
    fetchProducts().then(products => {
        app.innerHTML = `
    <div class="ProductListPage">
      <h1>상품 목록</h1>
        <ul>${products.map(product => `
        <li class="Product" onclick="navigateTo('/web/products/${product.id}')">
          <img src="${product.imageUrl}" alt="${product.name}">
          <div class="Product__info">
            <div>${product.name}</div>
            <div>${formatPrice(product.price)}원~</div>
          </div>
        </li>`).join('')}
      </ul>
    </div>  
    `;
    });
}

function renderProductDetail(productId) {
    fetchProduct(productId).then(product => {
        app.innerHTML = `
      <div class="ProductDetailPage">
        <h1>${product.name} 상품 정보</h1>
        <div class="ProductDetail">
          <img src="${product.imageUrl}" alt="${product.name}">
          <div class="ProductDetail__info">
            <h2>${product.name}</h2>
            <div class="ProductDetail__price">${formatPrice(product.price)}원~</div>
            <select id="product-options" onchange="updateSelectedOptions(${productId})">
              <option>선택하세요.</option>
              ${product.productOptions.map(option => `
                <option value="${option.id}" ${option.stock === 0 ? 'disabled' : ''}>
                  ${option.stock === 0 ? '(품절) ' : ''}${product.name} ${option.name} ${option.price > 0 ? `(+${formatPrice(option.price)}원)` : ''}
                </option>`).join('')}
            </select>
            <div id="selected-options" class="ProductDetail__selectedOptions">
              <h3>선택된 상품</h3>
              <ul id="selected-options-list"></ul>
              <div class="ProductDetail__totalPrice">0원</div>
              <button class="OrderButton" onclick="addToCart(${product.id})">주문하기</button>
            </div>
          </div>
        </div>
      </div>
    `;
    });
}

function updateSelectedOptions(productId) {
    const selectedOptionsList = document.getElementById('selected-options-list');
    const productOptions = document.getElementById('product-options');
    const selectedOptionId = productOptions.value;

    fetchProduct(productId).then(product => {
        const selectedOption = product.productOptions.find(option => option.id == selectedOptionId);

        if (selectedOption) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
        ${product.name} ${selectedOption.name} ${formatPrice(product.price + selectedOption.price)}원
        <div><input type="number" value="1" min="1" onchange="updateTotalPrice()"></div>
      `;
            selectedOptionsList.appendChild(listItem);
            updateTotalPrice();
        }
    });
}

function updateTotalPrice() {
    const selectedOptionsList = document.getElementById('selected-options-list');
    const totalPriceElement = document.querySelector('.ProductDetail__totalPrice');
    let totalPrice = 0;

    selectedOptionsList.querySelectorAll('li').forEach(li => {
        const priceText = li.innerHTML.match(/(\d+,)*\d+원/);
        const price = parseInt(priceText[0].replace('원', '').replace(/,/g, ''));
        const quantity = li.querySelector('input').value;
        totalPrice += price * quantity;
    });

    totalPriceElement.textContent = `${formatPrice(totalPrice)}원`;
}

function addToCart(productId) {
    const selectedOptionId = document.getElementById('product-options').value;
    const cart = loadCart();
    const existingItem = cart.find(item => item.productId == productId && item.optionId == selectedOptionId);

    if (!existingItem) {
        cart.push({ productId, optionId: selectedOptionId, quantity: 1 });
        saveCart(cart);
    }

    navigateTo('/web/cart');
}

function renderCart() {
    const cart = loadCart();
    if (cart.length === 0) {
        alert('장바구니가 비어 있습니다');
        navigateTo('/web');
        return;
    }

    Promise.all(cart.map(item => fetchProduct(item.productId))).then(products => {
        let totalPrice = cart.reduce((total, cartItem) => {
            const product = products.find(p => p.id == cartItem.productId);
            const option = product.productOptions.find(o => o.id == cartItem.optionId);
            return total + (product.price + option.price) * cartItem.quantity;
        }, 0);

        app.innerHTML = `
    <div class="CartPage">
      <h1>장바구니</h1>
      <div class="Cart">${cart.map(cartItem => {
            const product = products.find(p => p.id == cartItem.productId);
            const option = product.productOptions.find(o => o.id == cartItem.optionId);
            const price = product.price + option.price;
            return `
        <ul>
          <li class="Cart__item">
            <img src="${product.imageUrl}" alt="${product.name}">
              <div class="Cart__itemDesription">
                <div>${product.name} ${option.name} ${cartItem.quantity}개</div>
                <div>${formatPrice(price * cartItem.quantity)}원</div>
              </div>
              <input type="number" value="${cartItem.quantity}" min="1" max="${option.stock}" onchange="updateCart(${cartItem.productId}, ${cartItem.optionId}, this.value)">
          </li>
        </ul>
        <div class="Cart__totalPrice">총 상품가격 ${formatPrice(totalPrice)}원</div>   
        <button class="OrderButton" onclick="placeOrder()">주문하기</button>
    </div>
      `;
        }).join('')}
      </div>
    `;
    });
}


function updateCart(productId, optionId, quantity) {
    const cart = loadCart();
    const cartItem = cart.find(item => item.productId == productId && item.optionId == optionId);
    if (cartItem) {
        cartItem.quantity = parseInt(quantity);
        saveCart(cart);
        renderCart();
    }
}

function placeOrder() {
    alert('주문되었습니다');
    localStorage.removeItem(CART_STORAGE_KEY);
    navigateTo('/web');
}

function router() {
    const path = window.location.pathname;

    if (path === '/web/') {
        renderProductList();
    } else if (path.startsWith('/web/products/')) {
        const productId = path.split('/').pop();
        renderProductDetail(productId);
    } else if (path === '/web/cart') {
        renderCart();
    }
}

window.addEventListener('popstate', router);

router();