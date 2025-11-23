'use client';

import { useState, useEffect } from 'react';
import { InitialCosts, MonthlyBudget } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CostCalculatorProps {
  exchangeRate: number;
  onExchangeRateChange: (rate: number) => void;
}

/**
 * 비용 계산기 컴포넌트
 */
export default function CostCalculator({
  exchangeRate,
  onExchangeRateChange,
}: CostCalculatorProps) {
  const [initialCosts, setInitialCosts] = useState<InitialCosts>({
    flight: 0,
    firstMonthRent: 0,
    deposit: 0,
    visaFee: 0,
    insurance: 0,
    other: 0,
  });

  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget>({
    rent: 0,
    food: 0,
    transport: 0,
    communication: 0,
    other: 0,
  });

  // localStorage에서 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedInitial = localStorage.getItem('initialCosts');
      const storedMonthly = localStorage.getItem('monthlyBudget');
      const storedRate = localStorage.getItem('exchangeRate');

      if (storedInitial) {
        try {
          setInitialCosts(JSON.parse(storedInitial));
        } catch {
          // 무시
        }
      }
      if (storedMonthly) {
        try {
          setMonthlyBudget(JSON.parse(storedMonthly));
        } catch {
          // 무시
        }
      }
      if (storedRate) {
        try {
          const rate = parseFloat(storedRate);
          if (!isNaN(rate) && rate > 0) {
            onExchangeRateChange(rate);
          }
        } catch {
          // 무시
        }
      }
    }
  }, [onExchangeRateChange]);

  // 초기 비용 변경
  const updateInitialCost = (key: keyof InitialCosts, value: number) => {
    const updated = { ...initialCosts, [key]: value };
    setInitialCosts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('initialCosts', JSON.stringify(updated));
    }
  };

  // 월별 예산 변경
  const updateMonthlyBudget = (key: keyof MonthlyBudget, value: number) => {
    const updated = { ...monthlyBudget, [key]: value };
    setMonthlyBudget(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('monthlyBudget', JSON.stringify(updated));
    }
  };

  // 총 초기 비용 계산
  const totalInitialCAD = Object.values(initialCosts).reduce(
    (sum, val) => sum + val,
    0
  );
  const totalInitialKRW = totalInitialCAD * exchangeRate;

  // 월 총 생활비 계산
  const totalMonthlyCAD =
    monthlyBudget.rent +
    monthlyBudget.food +
    monthlyBudget.transport +
    monthlyBudget.communication +
    monthlyBudget.other;
  const totalMonthlyKRW = totalMonthlyCAD * exchangeRate;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        비용 계산기
      </h2>

      {/* 환율 설정 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          환율 설정 (1 CAD = ? KRW)
        </label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={exchangeRate}
          onChange={(e) => {
            const rate = parseFloat(e.target.value) || 1000;
            onExchangeRateChange(rate);
            if (typeof window !== 'undefined') {
              localStorage.setItem('exchangeRate', String(rate));
            }
          }}
          className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* 초기 비용 입력 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          초기 비용 (한 번만 지출)
        </h3>
        <div className="space-y-3">
          {[
            { key: 'flight', label: '항공권 (Flight)' },
            { key: 'firstMonthRent', label: '첫 달 월세 (First Month Rent)' },
            { key: 'deposit', label: '보증금 (Deposit)' },
            { key: 'visaFee', label: '비자 신청 비용 (Visa Fee)' },
            { key: 'insurance', label: '보험 (Insurance)' },
            { key: 'other', label: '기타 준비 비용 (Other)' },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="sm:w-48 text-sm text-gray-700">{label}</label>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={initialCosts[key as keyof InitialCosts]}
                  onChange={(e) =>
                    updateInitialCost(
                      key as keyof InitialCosts,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="CAD"
                />
                <span className="text-sm text-gray-500 w-16">CAD</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 월별 생활비 입력 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          월별 생활비 (Monthly Expenses)
        </h3>
        <div className="space-y-3">
          {[
            { key: 'rent', label: '월세 (Rent)' },
            { key: 'food', label: '식비 (Food)' },
            { key: 'transport', label: '교통비 (Transport)' },
            { key: 'communication', label: '통신비 (Communication)' },
            { key: 'other', label: '기타 (Other)' },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="sm:w-48 text-sm text-gray-700">{label}</label>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyBudget[key as keyof MonthlyBudget]}
                  onChange={(e) =>
                    updateMonthlyBudget(
                      key as keyof MonthlyBudget,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="CAD/월"
                />
                <span className="text-sm text-gray-500 w-16">CAD/월</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결과 요약 */}
      <div className="mt-6 p-4 bg-primary-50 rounded-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          비용 요약
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">초기 비용 총액:</span>
            <div className="text-right">
              <div className="font-semibold text-gray-800">
                {formatCurrency(totalInitialCAD, 'CAD')}
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(totalInitialKRW, 'KRW')}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">월 지출 총액:</span>
            <div className="text-right">
              <div className="font-semibold text-gray-800">
                {formatCurrency(totalMonthlyCAD, 'CAD')}
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(totalMonthlyKRW, 'KRW')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

