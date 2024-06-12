const API_BASE_URL = 'https://h6uc5l8b1g.execute-api.ap-northeast-2.amazonaws.com/dev/products';

// 모든 상품 정보를 가져오는 함수
export const fetchProducts = async () => {
    const response = await fetch(API_BASE_URL); // API 호출을 통해 상품 정보를 가져옴
    return response.json(); // 응답 데이터를 JSON 형식으로 변환하여 반환
}

// 특정 상품 정보를 가져오는 함수
export const fetchProduct = async (productId) => {
    const response = await fetch(`${API_BASE_URL}/${productId}`); // API 호출을 통해 특정 상품 정보를 가져옴
    return response.json(); // 응답 데이터를 JSON 형식으로 변환하여 반환
}
