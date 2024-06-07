# shopping-spa

## 쇼핑몰 SPA 프로젝트 요약

### 프로젝트 개요
이 프로젝트는 vanilla JavaScript를 사용하여 외부 라이브러리 없이 SPA(단일 페이지 애플리케이션) 형태의 쇼핑몰 사이트를 구축하는 것입니다. 총 3개의 페이지로 구성되며, 상품 목록 페이지, 상품 상세 페이지, 장바구니 페이지를 구현해야 합니다. 각 페이지는 아래 요구사항을 충족해야 합니다.

### 공통 요구사항
- index.html의 마크업 가이드를 준수하여 구조 및 클래스 이름을 유지합니다.
- 페이지별 URL 및 localStorage 키 이름을 준수합니다.
- 상품 가격 표시 시 3자리마다 콤마를 찍습니다.

### 페이지별 요구사항
1. 상품 목록 페이지
   - URL: /web/
   - 디자인에 맞춰 상품 목록을 렌더링합니다.
   - 상품 카드를 클릭하면 상품 상세 페이지로 이동합니다.
   - 상품 목록 조회 API 사용: GET - https://h6uc5l8b1g.execute-api.ap-northeast-2.amazonaws.com/dev/products
2. 상품 상세 페이지
   - URL: /web/products/:productId
   - productId에 해당하는 상품을 불러와 상품 정보를 렌더링합니다.
   - 상품 옵션가가 0인 경우와 0보다 큰 경우에 맞게 옵션 텍스트를 렌더링합니다.
   -재고가 0인 상품의 경우 (품절) 표시와 함께 옵션을 렌더링하고 disabled 속성을 추가합니다.
   - 옵션 선택 시, 선택된 상품을 보여주는 영역에 추가합니다.
   - 이미 선택된 상품은 중복 추가되지 않습니다.
   - 선택된 옵션들의 총 가격을 계산하여 렌더링합니다.
   - 수량 변경 시 옵션의 재고를 넘지 않도록 하고, 숫자가 아닌 값은 무시합니다.
   - 주문하기 버튼 클릭 시, 선택된 상품 정보를 localStorage에 저장하고 /cart 페이지로 이동합니다.
   - 상품 상세 조회 API 사용: GET - https://h6uc5l8b1g.execute-api.ap-northeast-2.amazonaws.com/dev/products/{productId}
3. 장바구니 페이지
   - URL: /web/cart
   - localStorage에 담긴 장바구니 데이터를 이용해 상품 및 옵션 데이터를 불러와 렌더링합니다.
   - 상품은 여러 종류를 담을 수 있습니다.
   - 총 상품 가격을 계산하여 맨 아래에 출력합니다.
   - 주문하기 클릭 시, alert를 이용해 주문 완료 메시지를 띄우고 상품 목록 페이지로 이동하며, localStorage를 비웁니다.
   - 장바구니에 담은 상품이 없는 경우, alert로 장바구니 비어있음 메시지를 띄우고 상품 목록 페이지로 이동합니다.

### API 명세
1. 상품 목록 조회
- Method: GET
- URL: https://h6uc5l8b1g.execute-api.ap-northeast-2.amazonaws.com/dev/products
```json
[
  {
    "id": 1,
    "name": "커피 컵",
    "imageUrl": "https://grepp-cloudfront.s3.ap-northeast-2.amazonaws.com/programmers_imgs/assignment_image/cafe_coffee_cup.png",
    "price": 10000
  }
]
```

2. 상품 옵션 및 수량 조회
- Method: GET
- URL: https://h6uc5l8b1g.execute-api.ap-northeast-2.amazonaws.com/dev/products/{productId}
```json
{
  "id": 1,
  "name": "커피 컵",
  "price": 10000,
  "imageUrl": "https://grepp-cloudfront.s3.ap-northeast-2.amazonaws.com/programmers_imgs/assignment_image/cafe_coffee_cup.png",
  "productOptions": [
    {
      "id": 1,
      "name": "100개 묶음",
      "price": 0,
      "stock": 5
    }
  ]
}
```
