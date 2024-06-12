import { formatPrice, saveCart, loadCart, navigateTo } from '../../utils/utils.js';
import { fetchProduct } from '../../api/api.js';

// 'app'라는 id를 가진 DOM 요소를 가져옴
const app = document.getElementById('app');

// 장바구니를 렌더링하는 함수
export const renderCart = () => {
    const cart = loadCart();

    // 장바구니가 비어 있으면 알림을 띄우고 메인 페이지로 이동
    if (cart.length === 0) {
        alert('장바구니가 비어 있습니다');
        navigateTo('/web');
        return;
    }

    // 장바구니에 있는 모든 상품 정보를 가져옴
    Promise.all(cart.map(item => fetchProduct(item.productId))).then(products => {
        // 총 가격을 계산
        let totalPrice = cart.reduce((total, cartItem) => {
            const product = products.find(p => p.id == cartItem.productId);
            const option = product.productOptions.find(o => o.id == cartItem.optionId);
            return total + (product.price + option.price) * cartItem.quantity;
        }, 0);

        // 장바구니 페이지를 HTML로 렌더링
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
                                <div class="Cart__itemDescription">
                                    <div>${product.name} ${option.name} ${cartItem.quantity}개</div>
                                    <div>${formatPrice(price * cartItem.quantity)}원</div>
                                </div>
                                <input type="number" value="${cartItem.quantity}" min="1" max="${option.stock}" data-product-id="${cartItem.productId}" data-option-id="${cartItem.optionId}">
                            </li>
                        </ul>
                    `;
        }).join('')}
                </div>
                <div class="Cart__totalPrice">총 상품가격 ${formatPrice(totalPrice)}원</div>   
                <button class="OrderButton">주문하기</button>
            </div>
        `;

        // 수량 입력란에 이벤트 핸들러를 설정
        document.querySelectorAll('.Cart__item input[type="number"]').forEach(input => {
            input.addEventListener('change', (event) => {
                const productId = event.target.getAttribute('data-product-id');
                const optionId = event.target.getAttribute('data-option-id');
                const quantity = event.target.value;
                updateCart(productId, optionId, quantity);
            });
        });

        // 주문 버튼 클릭 시 이벤트 핸들러를 설정
        document.querySelector('.OrderButton').addEventListener('click', placeOrder);
    });
}

// 장바구니를 업데이트하는 함수
const updateCart = (productId, optionId, quantity) => {
    const cart = loadCart();
    const cartItem = cart.find(item => item.productId == productId && item.optionId == optionId);
    if (cartItem) {
        cartItem.quantity = parseInt(quantity);
        saveCart(cart);
        renderCart(); // 장바구니를 다시 렌더링하여 변경 사항을 반영
    }
}

// 주문을 처리하는 함수
const placeOrder = () => {
    alert('주문되었습니다');
    localStorage.removeItem('products_cart'); // 장바구니 데이터를 로컬 스토리지에서 삭제
    navigateTo('/web'); // 메인 페이지로 이동
}
