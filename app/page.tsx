'use client';

import { useState, useEffect } from 'react';
import { StudyProfile, MonthlyBudget } from '@/types';
import ProfileForm from '@/components/ProfileForm';
import Checklist from '@/components/Checklist';
import CostCalculator from '@/components/CostCalculator';
import BenchmarkComparison from '@/components/BenchmarkComparison';

/**
 * 메인 페이지 컴포넌트
 */
export default function Home() {
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [exchangeRate, setExchangeRate] = useState(1000);
  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget>({
    rent: 0,
    food: 0,
    transport: 0,
    communication: 0,
    other: 0,
  });

  // localStorage에서 월별 예산 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('monthlyBudget');
      if (stored) {
        try {
          setMonthlyBudget(JSON.parse(stored));
        } catch {
          // 무시
        }
      }
    }
  }, []);

  // 월별 예산 변경 감지 (CostCalculator에서 변경될 수 있음)
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('monthlyBudget');
      if (stored) {
        try {
          setMonthlyBudget(JSON.parse(stored));
        } catch {
          // 무시
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // 같은 탭에서의 변경도 감지하기 위해 주기적으로 확인
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            유학생 준비/생활 도우미
          </h1>
          <p className="text-gray-600">
            출국일을 입력하고 체크리스트와 비용을 관리하세요
          </p>
        </header>

        {/* 프로필 입력 섹션 */}
        <ProfileForm onProfileChange={setProfile} />

        {/* 체크리스트 섹션 */}
        <Checklist profile={profile} />

        {/* 비용 계산 섹션 */}
        <CostCalculator
          exchangeRate={exchangeRate}
          onExchangeRateChange={setExchangeRate}
        />

        {/* 벤치마크 비교 섹션 */}
        <BenchmarkComparison profile={profile} monthlyBudget={monthlyBudget} />

        {/* 푸터 */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 유학생 준비/생활 도우미. 모든 데이터는 참고용입니다.</p>
        </footer>
      </div>
    </main>
  );
}

