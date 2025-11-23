import { BenchmarkData } from '@/types';

/**
 * 도시별, 체류 기간별 평균 생활비 벤치마크 데이터
 * ※ 현재 평균값은 공개 자료를 기반으로 한 참고용 수치입니다.
 */
export const BENCHMARKS: Record<string, Record<string, BenchmarkData>> = {
  toronto: {
    '6': {
      rent: 1300, // CAD / month
      food: 450,
      transport: 150,
      other: 250,
    },
    '12': {
      rent: 1200,
      food: 400,
      transport: 150,
      other: 250,
    },
    '18': {
      rent: 1200,
      food: 400,
      transport: 150,
      other: 250,
    },
    '24': {
      rent: 1200,
      food: 400,
      transport: 150,
      other: 250,
    },
  },
  vancouver: {
    '6': {
      rent: 1400,
      food: 450,
      transport: 160,
      other: 260,
    },
    '12': {
      rent: 1350,
      food: 420,
      transport: 160,
      other: 260,
    },
    '18': {
      rent: 1350,
      food: 420,
      transport: 160,
      other: 260,
    },
    '24': {
      rent: 1350,
      food: 420,
      transport: 160,
      other: 260,
    },
  },
  montreal: {
    '6': {
      rent: 1000,
      food: 400,
      transport: 90,
      other: 200,
    },
    '12': {
      rent: 950,
      food: 380,
      transport: 90,
      other: 200,
    },
  },
  ottawa: {
    '6': {
      rent: 1100,
      food: 400,
      transport: 120,
      other: 220,
    },
    '12': {
      rent: 1050,
      food: 380,
      transport: 120,
      other: 220,
    },
  },
} as const;

/**
 * 도시명과 체류 기간을 기반으로 벤치마크 데이터를 가져옵니다.
 * @param city - 도시명 (소문자)
 * @param durationMonths - 체류 기간 (개월)
 * @returns 벤치마크 데이터 또는 null
 */
export function getBenchmark(
  city: string,
  durationMonths: number
): BenchmarkData | null {
  const cityKey = city.toLowerCase();
  const durationKey = String(durationMonths);

  if (!BENCHMARKS[cityKey]) {
    return null;
  }

  // 정확한 기간이 없으면 가장 가까운 기간을 찾음
  const availableDurations = Object.keys(BENCHMARKS[cityKey]);
  const sortedDurations = availableDurations
    .map(Number)
    .sort((a, b) => a - b);

  // 정확한 기간이 있으면 사용
  if (BENCHMARKS[cityKey][durationKey]) {
    return BENCHMARKS[cityKey][durationKey];
  }

  // 가장 가까운 더 긴 기간 사용
  const closestDuration = sortedDurations.find((d) => d >= durationMonths);
  if (closestDuration) {
    return BENCHMARKS[cityKey][String(closestDuration)];
  }

  // 없으면 가장 긴 기간 사용
  const longestDuration = sortedDurations[sortedDurations.length - 1];
  if (longestDuration) {
    return BENCHMARKS[cityKey][String(longestDuration)];
  }

  return null;
}

