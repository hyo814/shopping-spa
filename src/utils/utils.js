// 가격을 포맷팅하는 함수 ( 예: 1000 -> "1,000" )
export const formatPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// 장바구니 데이터를 로컬 스토리지에 저장하는 함수
export const saveCart = (cart) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); // 장바구니 데이터를 JSON 문자열로 변환하여 저장
}

// 로컬 스토리지에서 장바구니 데이터를 불러오는 함수
export const loadCart = () => JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || []; // 저장된 장바구니 데이터를 파싱하여 반환  >> 데이터가 없으면 빈 배열을 반환

// URL을 변경하고 해당 페이지를 렌더링하는 함수
export const navigateTo = (url) => {
    history.pushState(null, null, url); // 브라우저 히스토리에 새로운 상태를 추가
    router(); // 라우터를 호출하여 페이지를 렌더링
}
