# 유학생 준비/생활 도우미

해외 유학 준비를 위한 체크리스트와 비용 계산기 웹앱입니다.

## 주요 기능

1. **유학 프로필 입력**: 국가, 도시, 학교 타입, 출국일, 체류 기간 입력
2. **출국 타임라인 체크리스트**: D-day 기준으로 자동 생성되는 준비 항목 체크리스트
3. **비용 계산기**: 초기 비용 및 월별 생활비 계산 (CAD/KRW 환율 변환)
4. **벤치마크 비교**: 도시별 평균 생활비와 내 예산 비교

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: localStorage (브라우저 로컬 저장)

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

## Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. GitHub 저장소를 연결하거나 프로젝트를 직접 업로드
3. 자동으로 배포됩니다

또는 Vercel CLI 사용:

```bash
npm i -g vercel
vercel
```

## 프로젝트 구조

```
liuxuesheng/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   └── globals.css         # 전역 스타일
├── components/
│   ├── ProfileForm.tsx     # 프로필 입력 폼
│   ├── Checklist.tsx       # 체크리스트 컴포넌트
│   ├── CostCalculator.tsx  # 비용 계산기
│   └── BenchmarkComparison.tsx # 벤치마크 비교
├── lib/
│   ├── benchmarks.ts       # 벤치마크 데이터
│   ├── checklist.ts        # 체크리스트 생성 로직
│   └── utils.ts            # 유틸리티 함수
├── types/
│   └── index.ts            # TypeScript 타입 정의
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## 주요 파일 설명

### `lib/benchmarks.ts`
도시별, 체류 기간별 평균 생활비 벤치마크 데이터를 정의합니다. 현재는 하드코딩된 참고용 데이터를 사용합니다.

### `lib/checklist.ts`
출국일을 기준으로 체크리스트 항목을 자동 생성하는 로직이 포함되어 있습니다.

### `components/CostCalculator.tsx`
초기 비용과 월별 생활비를 입력받고, 환율을 적용하여 CAD/KRW로 계산 결과를 보여줍니다.

### `components/BenchmarkComparison.tsx`
사용자의 월별 예산과 벤치마크 평균값을 비교하여 표로 보여줍니다.

## 데이터 저장

모든 데이터는 브라우저의 `localStorage`에 저장됩니다:
- `studyProfile`: 유학 프로필 정보
- `checklist`: 체크리스트 항목들
- `initialCosts`: 초기 비용
- `monthlyBudget`: 월별 생활비
- `exchangeRate`: 환율

## 주의사항

- 벤치마크 데이터는 공개 자료를 기반으로 한 참고용 수치입니다.
- 실제 비용은 개인 상황에 따라 다를 수 있습니다.
- 데이터는 브라우저 로컬에만 저장되므로, 다른 브라우저나 기기에서는 접근할 수 없습니다.

## 라이선스

MIT

