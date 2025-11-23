/**
 * 유학 프로필 정보 타입
 */
export interface StudyProfile {
  country: string;
  city: string;
  schoolType: 'language' | 'college' | 'university';
  departureDate: string; // ISO date string
  durationMonths: number;
}

/**
 * 체크리스트 항목 타입
 */
export interface ChecklistItem {
  id: string;
  title: string;
  recommendedDate: string; // D-XX 형식 또는 ISO date
  completed: boolean;
  category: string;
}

/**
 * 초기 비용 항목 타입
 */
export interface InitialCosts {
  flight: number; // CAD
  firstMonthRent: number;
  deposit: number;
  visaFee: number;
  insurance: number;
  other: number;
}

/**
 * 월별 생활비 타입
 */
export interface MonthlyBudget {
  rent: number; // CAD
  food: number;
  transport: number;
  communication: number;
  other: number;
}

/**
 * 벤치마크 데이터 타입
 */
export interface BenchmarkData {
  rent: number;
  food: number;
  transport: number;
  other: number;
}

/**
 * 벤치마크 비교 결과 타입
 */
export interface ComparisonResult {
  category: keyof MonthlyBudget;
  myVal: number;
  benchVal: number;
  diff: number;
  diffPct: number;
}

