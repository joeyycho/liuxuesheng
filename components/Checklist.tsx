'use client';

import { useState, useEffect } from 'react';
import { ChecklistItem, StudyProfile } from '@/types';
import {
  generateChecklist,
  loadChecklistFromStorage,
  saveChecklistToStorage,
} from '@/lib/checklist';
import { getDaysUntil } from '@/lib/utils';

interface ChecklistProps {
  profile: StudyProfile | null;
}

/**
 * 체크리스트 컴포넌트
 */
export default function Checklist({ profile }: ChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('기타');

  // 프로필이 변경되면 체크리스트 재생성
  useEffect(() => {
    if (profile && profile.departureDate) {
      const stored = loadChecklistFromStorage();
      if (stored.length === 0) {
        // 저장된 것이 없으면 새로 생성
        const generated = generateChecklist(profile);
        setItems(generated);
        saveChecklistToStorage(generated);
      } else {
        // 저장된 것이 있으면 불러오기
        setItems(stored);
      }
    }
  }, [profile]);

  // 항목 체크/언체크
  const toggleItem = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updated);
    saveChecklistToStorage(updated);
  };

  // 항목 삭제
  const deleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveChecklistToStorage(updated);
  };

  // 새 항목 추가
  const addItem = () => {
    if (!newItemTitle.trim()) return;

    const daysUntil = profile
      ? getDaysUntil(profile.departureDate)
      : 0;
    const recommendedDate = `D-${Math.max(0, daysUntil)}`;

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      title: newItemTitle.trim(),
      recommendedDate,
      completed: false,
      category: newItemCategory,
    };

    const updated = [...items, newItem];
    setItems(updated);
    saveChecklistToStorage(updated);
    setNewItemTitle('');
  };

  // 카테고리별로 그룹화
  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, ChecklistItem[]>
  );

  const categories = Object.keys(groupedItems).sort();

  if (!profile || !profile.departureDate) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          출국 준비 체크리스트
        </h2>
        <p className="text-gray-500">
          유학 프로필을 먼저 입력해주세요.
        </p>
      </div>
    );
  }

  const daysUntil = getDaysUntil(profile.departureDate);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          출국 준비 체크리스트
        </h2>
        <div className="text-lg font-semibold text-primary-600">
          {daysUntil >= 0 ? `D-${daysUntil}` : 'D+0'}
        </div>
      </div>

      {/* 카테고리별 체크리스트 */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
              {category}
            </h3>
            <ul className="space-y-2">
              {groupedItems[category].map((item) => (
                <li
                  key={item.id}
                  className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItem(item.id)}
                    className="mt-1 w-5 h-5 text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          item.completed
                            ? 'text-gray-500 line-through'
                            : 'text-gray-800'
                        }
                      >
                        {item.title}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {item.recommendedDate}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm px-2"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 새 항목 추가 */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          새 항목 추가
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="항목 제목 입력"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="서류">서류</option>
            <option value="학교">학교</option>
            <option value="보험">보험</option>
            <option value="금융">금융</option>
            <option value="여행">여행</option>
            <option value="주거">주거</option>
            <option value="통신">통신</option>
            <option value="준비물">준비물</option>
            <option value="정보">정보</option>
            <option value="기타">기타</option>
          </select>
          <button
            onClick={addItem}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}

