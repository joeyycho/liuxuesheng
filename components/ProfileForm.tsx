'use client';

import { useState, useEffect } from 'react';
import { StudyProfile } from '@/types';

interface ProfileFormProps {
  onProfileChange: (profile: StudyProfile | null) => void;
}

/**
 * 유학 프로필 입력 폼 컴포넌트
 */
export default function ProfileForm({ onProfileChange }: ProfileFormProps) {
  const [profile, setProfile] = useState<StudyProfile>({
    country: 'Canada',
    city: 'Toronto',
    schoolType: 'university',
    departureDate: '',
    durationMonths: 12,
  });

  // localStorage에서 프로필 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('studyProfile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
          onProfileChange(parsed);
        } catch {
          // 무시
        }
      }
    }
  }, [onProfileChange]);

  // 프로필 변경 시 localStorage에 저장 및 부모에게 전달
  const handleChange = (updates: Partial<StudyProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('studyProfile', JSON.stringify(newProfile));
    }
    
    onProfileChange(newProfile);
  };

  const canadianCities = [
    'Toronto',
    'Vancouver',
    'Montreal',
    'Ottawa',
    'Calgary',
    'Edmonton',
    'Winnipeg',
    'Quebec City',
    'Hamilton',
    'Kitchener',
    'London',
    'Victoria',
    'Halifax',
    '기타',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        유학 프로필 입력
      </h2>
      
      <div className="space-y-4">
        {/* 국가 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            국가 (Country)
          </label>
          <input
            type="text"
            value={profile.country}
            onChange={(e) => handleChange({ country: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* 도시 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            도시 (City)
          </label>
          <select
            value={profile.city}
            onChange={(e) => handleChange({ city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {canadianCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* 학교 타입 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            학교 타입 (School Type)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { value: 'language', label: '어학원' },
              { value: 'college', label: '컬리지' },
              { value: 'university', label: '대학' },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="schoolType"
                  value={option.value}
                  checked={profile.schoolType === option.value}
                  onChange={(e) =>
                    handleChange({
                      schoolType: e.target.value as StudyProfile['schoolType'],
                    })
                  }
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 출국 예정일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            출국 예정일 (Departure Date)
          </label>
          <input
            type="date"
            value={profile.departureDate}
            onChange={(e) => handleChange({ departureDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* 체류 기간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            예정 체류 기간 (Duration)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="1"
              max="48"
              value={profile.durationMonths}
              onChange={(e) =>
                handleChange({ durationMonths: parseInt(e.target.value) || 12 })
              }
              className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="text-gray-700">개월</span>
          </div>
        </div>
      </div>
    </div>
  );
}

