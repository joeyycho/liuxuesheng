import { MonthlyBudget, BenchmarkData, ComparisonResult } from '@/types';

/**
 * 두 날짜 사이의 일수 차이를 계산합니다.
 */
export function getDaysUntil(targetDate: string): number {
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * D-XX 형식의 문자열을 생성합니다.
 */
export function formatDaysUntil(days: number): string {
  if (days < 0) return 'D+0';
  return `D-${days}`;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷합니다.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 통화를 포맷합니다.
 */
export function formatCurrency(amount: number, currency: 'CAD' | 'KRW'): string {
  if (currency === 'CAD') {
    return `$${amount.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`;
  }
  return `₩${amount.toLocaleString('ko-KR')} KRW`;
}

/**
 * 사용자 예산과 벤치마크를 비교합니다.
 */
export function compareBudget(
  my: MonthlyBudget,
  bench: BenchmarkData
): ComparisonResult[] {
  const categories: (keyof BenchmarkData)[] = [
    'rent',
    'food',
    'transport',
    'other',
  ];

  return categories.map((category) => {
    const myVal = my[category];
    const benchVal = bench[category];
    const diff = myVal - benchVal;
    const diffPct = benchVal > 0 ? (diff / benchVal) * 100 : 0;

    return {
      category: category as keyof MonthlyBudget,
      myVal,
      benchVal,
      diff,
      diffPct,
    };
  });
}

/**
 * 통신비를 포함한 월별 예산을 MonthlyBudget으로 변환합니다.
 */
export function createMonthlyBudget(
  rent: number,
  food: number,
  transport: number,
  communication: number,
  other: number
): MonthlyBudget {
  return {
    rent,
    food,
    transport,
    communication,
    other,
  };
}

