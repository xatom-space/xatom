# xatom.space (Next.js App Router + Tailwind)

하이앤드/미니멀 스타일의 2페이지 웹사이트입니다.

## 구성
- `/` 인트로 페이지
  - 전체 화면 비디오 배경 (`public/intro.mp4`)
  - 중앙 로고 (`public/logo.svg`)
  - 로고 클릭 시 `/home` 이동
- `/home` 메인 페이지
  - 상단 네비게이션 (Home/About/Shop/Contact + Instagram 아이콘)
  - 히어로 섹션
  - About 섹션
  - Shop 섹션 (`Buy` 버튼 -> Stripe Checkout)
  - Contact 섹션 (폼 -> `/api/contact`)
- 결제 결과 페이지
  - `/success`
  - `/cancel`

## 실행 방법
1. 의존성 설치
```bash
npm install
```

2. 환경변수 설정
```bash
cp .env.example .env.local
```
`.env.local`에 Stripe/SMTP 값을 채워주세요.

3. 개발 서버 실행
```bash
npm run dev
```

4. 브라우저
- http://localhost:3000

## 환경변수 설명
- `NEXT_PUBLIC_SITE_URL`: 앱 기본 URL
- `STRIPE_SECRET_KEY`: Stripe Secret Key
- `STRIPE_PRICE_ID`: Stripe Price ID
- `SMTP_*`, `CONTACT_TO`: Contact 메일 전송 설정

SMTP가 없으면 `/api/contact`는 서버 콘솔 로그로 폴백 동작합니다.

## 정적 파일
- 비디오: `public/intro.mp4`
- 로고: `public/logo.svg`
- 이미지: `public/images/*`

현재 `public/intro.mp4`는 플레이스홀더(빈 파일)입니다. 실제 영상으로 교체해 주세요.
