import { formatPrice, navigateTo, loadCart, saveCart } from '../../utils/utils.js';
import { fetchProduct } from '../../api/api.js';

// 'app'라는 id를 가진 DOM 요소를 가져옴
const app = document.getElementById('app');

// productId에 해당하는 상품 상세 정보를 렌더링하는 함수
export const renderProductDetail = (productId) => {
    fetchProduct(productId).then(product => {
        // 상품 정보를 HTML로 렌더링
        app.innerHTML = `
            <div class="ProductDetailPage">
                <h1>${product.name} 상품 정보</h1>
                <div class="ProductDetail">
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <div class="ProductDetail__info">
                        <h2>${product.name}</h2>
                        <div class="ProductDetail__price">${formatPrice(product.price)}원~</div>
                        <select id="product-options">
                            <option value="">선택하세요.</option>
                            ${product.productOptions.map(option => `
                                <option value="${option.id}" ${option.stock === 0 ? 'disabled' : ''}>
                                    ${option.stock === 0 ? '(품절) ' : ''}${product.name} ${option.name} ${option.price > 0 ? `(+${formatPrice(option.price)}원)` : ''}
                                </option>`).join('')}
                        </select>
                        <div id="selected-options" class="ProductDetail__selectedOptions">
                            <h3>선택된 상품</h3>
                            <ul id="selected-options-list"></ul>
                            <div class="ProductDetail__totalPrice">0원</div>
                            <button class="OrderButton" data-product-id="${product.id}">주문하기</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // 옵션 선택 시 이벤트 핸들러를 설정
        document.getElementById('product-options').addEventListener('change', () => updateSelectedOptions(product));
        // 주문 버튼 클릭 시 이벤트 핸들러를 설정
        document.querySelector('.OrderButton').addEventListener('click', () => addToCart(product));
    });
}

// 선택된 옵션을 업데이트하는 함수
const updateSelectedOptions = (product) => {
    const selectedOptionsList = document.getElementById('selected-options-list');
    const productOptions = document.getElementById('product-options');
    const selectedOptionId = productOptions.value;

    if (!selectedOptionId) return;

    const selectedOption = product.productOptions.find(option => option.id == selectedOptionId);

    if (selectedOption) {
        const existingItem = selectedOptionsList.querySelector(`li[data-option-id="${selectedOptionId}"]`);
        if (!existingItem) {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-option-id', selectedOptionId);
            listItem.innerHTML = `
                ${product.name} ${selectedOption.name} ${formatPrice(product.price + selectedOption.price)}원
                <div><input type="number" value="1" min="1" max="${selectedOption.stock}" onchange="updateTotalPrice()"></div>
            `;
            selectedOptionsList.appendChild(listItem);
            updateTotalPrice();
        }
    }
}

// 총 가격을 업데이트하는 함수
const updateTotalPrice = () => {
    const selectedOptionsList = document.getElementById('selected-options-list');
    const totalPriceElement = document.querySelector('.ProductDetail__totalPrice');
    let totalPrice = 0;

    selectedOptionsList.querySelectorAll('li').forEach(li => {
        const priceText = li.innerHTML.match(/(\d+,)*\d+원/);
        const price = parseInt(priceText[0].replace('원', '').replace(/,/g, ''));
        const quantity = li.querySelector('input').value;
        if (!isNaN(quantity) && quantity > 0) {
            totalPrice += price * parseInt(quantity);
        }
    });

    totalPriceElement.textContent = `${formatPrice(totalPrice)}원`;
}

// 장바구니에 선택된 옵션을 추가하는 함수
const addToCart = (product) => {
    const selectedOptionsList = document.getElementById('selected-options-list');
    const cart = loadCart();

    selectedOptionsList.querySelectorAll('li').forEach(li => {
        const optionId = li.getAttribute('data-option-id');
        const quantity = parseInt(li.querySelector('input').value);

        if (!isNaN(quantity) && quantity > 0) {
            const existingItem = cart.find(item => item.productId == product.id && item.optionId == optionId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ productId: product.id, optionId, quantity });
            }
        }
    });

    saveCart(cart);
    navigateTo('/web/cart');
}
