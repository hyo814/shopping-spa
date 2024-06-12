import {renderProductList} from "./src/components/product/list.js";
import {renderCart} from "./src/components/cart/cart.js";
import {renderProductDetail} from "./src/components/product/detail.js";

// 라우터 함수 정의
const router = () => {
    // 현재 경로(path)를 가져옴
    const path = window.location.pathname;

    // 경로가 '/web/'일 경우, 상품 목록을 렌더링
    if (path === '/web/') {
        renderProductList();
        // 경로가 '/web/products/'로 시작할 경우, 해당 상품의 상세 정보를 렌더링
    } else if (path.startsWith('/web/products/')) {
        // 경로에서 마지막 부분(상품 ID)을 추출
        const productId = path.split('/').pop();
        renderProductDetail(productId);
        // 경로가 '/web/cart'일 경우, 장바구니를 렌더링
    } else if (path === '/web/cart') {
        renderCart();
    }
}

// 브라우저의 뒤로가기(popstate) 이벤트가 발생할 때 라우터 함수 호출
window.addEventListener('popstate', router);

// 페이지가 로드될 때 초기 라우터 함수 호출
router();
