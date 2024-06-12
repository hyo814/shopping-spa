import { formatPrice, navigateTo } from '../../utils/utils.js';
import { fetchProducts } from '../../api/api.js';

// 'app'라는 id를 가진 DOM 요소를 가져옴
const app = document.getElementById('app');

// 상품 목록을 렌더링하는 함수
export const renderProductList = () => {
    // fetchProducts 함수로 모든 상품 정보를 가져옴
    fetchProducts().then(products => {
        // 상품 목록을 HTML로 렌더링
        app.innerHTML = `
            <div class="ProductListPage">
                <h1>상품 목록</h1>
                <ul>${products.map(product => `
                    <li class="Product" data-id="${product.id}">
                        <img src="${product.imageUrl}" alt="${product.name}">
                        <div class="Product__info">
                            <div>${product.name}</div>
                            <div>${formatPrice(product.price)}원~</div>
                        </div>
                    </li>`).join('')}
                </ul>
            </div>
        `;
        // 각 상품 요소에 클릭 이벤트 핸들러를 설정
        document.querySelectorAll('.Product').forEach(element => {
            element.addEventListener('click', (event) => {
                const productId = event.currentTarget.getAttribute('data-id');
                // 상품 클릭 시 해당 상품 상세 페이지로 이동
                navigateTo(`/web/products/${productId}`);
            });
        });
    });
}
