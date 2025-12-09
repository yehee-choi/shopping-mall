# 저버코리아 쇼핑몰

네이버 스마트스토어 스타일의 Next.js 쇼핑몰 프로젝트입니다.

## 🚀 시작하기

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요!

## 📁 프로젝트 구조

```
shopping-mall/
├── app/
│   ├── page.tsx              # 메인 페이지 (상품 리스트)
│   ├── product/[id]/page.tsx # 상품 상세 페이지
│   ├── cart/page.tsx         # 장바구니 페이지
│   ├── login/page.tsx        # 로그인 페이지
│   ├── layout.tsx            # 전체 레이아웃
│   └── globals.css           # 전역 스타일
├── components/
│   ├── Header.tsx            # 상단 네비게이션
│   ├── CategoryMenu.tsx      # 카테고리 메뉴
│   └── ProductCard.tsx       # 상품 카드
└── public/                   # 정적 파일
```

## ✨ 주요 기능

- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ 상품 리스트 및 상세 페이지
- ✅ 장바구니 기능
- ✅ 로그인 페이지
- ✅ 카테고리 메뉴
- ✅ 상품 정렬 필터

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom Components

## 📝 사용법

### 메인 페이지
- 전체 상품 목록을 확인할 수 있습니다
- 정렬 옵션으로 상품을 필터링할 수 있습니다

### 상품 상세
- 상품 카드를 클릭하면 상세 페이지로 이동합니다
- 수량을 선택하고 장바구니에 담을 수 있습니다

### 장바구니
- 담은 상품을 확인하고 수량을 조절할 수 있습니다
- 총 결제 금액을 확인할 수 있습니다

### 로그인
- 이메일과 비밀번호로 로그인할 수 있습니다
- 소셜 로그인도 지원합니다

## 🎨 커스터마이징

### 색상 변경
`tailwind.config.ts` 파일에서 메인 컬러를 변경할 수 있습니다:

```typescript
theme: {
  extend: {
    colors: {
      primary: "#03C75A",  // 네이버 그린
      secondary: "#1EC800",
    },
  },
}
```

### 상품 데이터
`app/page.tsx` 파일의 `products` 배열을 수정하여 상품 데이터를 변경할 수 있습니다.

## 📦 빌드

```bash
npm run build
npm start
```

## 📄 라이센스

이 프로젝트는 MIT 라이센스로 제공됩니다.
