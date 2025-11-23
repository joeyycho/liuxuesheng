'use client';

import { useEffect, useState } from 'react';
import { StudyProfile, MonthlyBudget, ComparisonResult } from '@/types';
import { getBenchmark } from '@/lib/benchmarks';
import { compareBudget, formatCurrency } from '@/lib/utils';

interface BenchmarkComparisonProps {
  profile: StudyProfile | null;
  monthlyBudget: MonthlyBudget;
}

/**
 * 벤치마크 비교 컴포넌트
 */
export default function BenchmarkComparison({
  profile,
  monthlyBudget,
}: BenchmarkComparisonProps) {
  const [comparison, setComparison] = useState<ComparisonResult[] | null>(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (!profile || !profile.city) {
      setComparison(null);
      setHasData(false);
      return;
    }

    // 월별 예산이 모두 0이면 비교하지 않음
    const total = Object.values(monthlyBudget).reduce((sum, val) => sum + val, 0);
    if (total === 0) {
      setComparison(null);
      setHasData(false);
      return;
    }

    const benchmark = getBenchmark(profile.city, profile.durationMonths);
    
    if (!benchmark) {
      setComparison(null);
      setHasData(false);
      return;
    }

    // 통신비를 other에 포함시켜 비교 (벤치마크에는 통신비가 없으므로)
    const adjustedBudget: MonthlyBudget = {
      ...monthlyBudget,
      other: monthlyBudget.other + monthlyBudget.communication,
    };

    const adjustedBenchmark = {
      ...benchmark,
      other: benchmark.other, // 벤치마크의 other에는 이미 통신비가 포함되어 있다고 가정
    };

    const results = compareBudget(adjustedBudget, adjustedBenchmark);
    setComparison(results);
    setHasData(true);
  }, [profile, monthlyBudget]);

  if (!profile || !profile.city) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          평균 지출 vs 나
        </h2>
        <p className="text-gray-500">
          유학 프로필을 먼저 입력해주세요.
        </p>
      </div>
    );
  }

  if (!hasData) {
    const benchmark = getBenchmark(profile.city, profile.durationMonths);
    
    if (!benchmark) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            평균 지출 vs 나
          </h2>
          <p className="text-gray-500 mb-4">
            아직 {profile.city} ({profile.durationMonths}개월)에 대한 평균 데이터가 없습니다.
          </p>
          <p className="text-xs text-gray-400">
            ※ 현재 평균값은 공개 자료를 기반으로 한 참고용 수치입니다.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          평균 지출 vs 나
        </h2>
        <p className="text-gray-500">
          월별 생활비를 입력해주세요.
        </p>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    rent: '월세 (Rent)',
    food: '식비 (Food)',
    transport: '교통비 (Transport)',
    other: '기타 (Other)',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        평균 지출 vs 나
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {profile.city} ({profile.durationMonths}개월) 기준
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                항목
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                내 계획 (CAD/월)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                벤치마크 평균 (CAD/월)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                차이
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison?.map((result) => {
              const isPositive = result.diff >= 0;
              const diffColor = isPositive ? 'text-red-600' : 'text-green-600';
              
              return (
                <tr key={result.category} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {categoryLabels[result.category] || result.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-sm text-gray-800">
                    {formatCurrency(result.myVal, 'CAD')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-sm text-gray-600">
                    {formatCurrency(result.benchVal, 'CAD')}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 text-right text-sm font-semibold ${diffColor}`}>
                    {isPositive ? '+' : ''}
                    {formatCurrency(result.diff, 'CAD')} ({isPositive ? '+' : ''}
                    {result.diffPct.toFixed(1)}%)
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        ※ 현재 평균값은 공개 자료를 기반으로 한 참고용 수치입니다.
      </p>
    </div>
  );
}

