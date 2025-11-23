import { ChecklistItem, StudyProfile } from '@/types';
import { getDaysUntil, formatDaysUntil } from './utils';

/**
 * 체크리스트 템플릿 항목 정의
 */
const CHECKLIST_TEMPLATES: Array<{
  title: string;
  daysBefore: number;
  category: string;
}> = [
  { title: '여권 유효기간 확인 및 갱신', daysBefore: 180, category: '서류' },
  { title: '비자 신청 서류 준비', daysBefore: 150, category: '서류' },
  { title: '비자 신청 제출', daysBefore: 120, category: '서류' },
  { title: '학교 입학허가서 확인', daysBefore: 120, category: '학교' },
  { title: '학비 납부', daysBefore: 90, category: '학교' },
  { title: '의료보험 가입 신청', daysBefore: 90, category: '보험' },
  { title: '예방접종 확인 및 추가 접종', daysBefore: 90, category: '보험' },
  { title: '은행 계좌 개설 준비 (서류 등)', daysBefore: 60, category: '금융' },
  { title: '국제 신용카드/체크카드 발급', daysBefore: 60, category: '금융' },
  { title: '항공권 예약', daysBefore: 60, category: '여행' },
  { title: '숙소 확정 (기숙사/홈스테이/월세)', daysBefore: 60, category: '주거' },
  { title: '첫 달 월세/보증금 납부', daysBefore: 45, category: '주거' },
  { title: '통신사/유심카드 준비', daysBefore: 30, category: '통신' },
  { title: '짐 리스트 작성 (옷, 전자기기, 서류 등)', daysBefore: 30, category: '준비물' },
  { title: '필수 서류 복사본 준비', daysBefore: 14, category: '서류' },
  { title: '현지 연락처 및 주소 정리', daysBefore: 14, category: '정보' },
  { title: '공항 픽업/교통편 확인', daysBefore: 7, category: '여행' },
  { title: '최종 짐 꾸리기', daysBefore: 3, category: '준비물' },
  { title: '출국 전 최종 점검', daysBefore: 1, category: '기타' },
];

/**
 * 프로필 정보를 기반으로 체크리스트를 생성합니다.
 */
export function generateChecklist(profile: StudyProfile): ChecklistItem[] {
  const departureDate = new Date(profile.departureDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return CHECKLIST_TEMPLATES.map((template) => {
    const targetDate = new Date(departureDate);
    targetDate.setDate(targetDate.getDate() - template.daysBefore);

    const daysUntil = getDaysUntil(targetDate.toISOString().split('T')[0]);
    const recommendedDateStr = formatDaysUntil(daysUntil);

    return {
      id: `${template.daysBefore}-${template.title}`,
      title: template.title,
      recommendedDate: recommendedDateStr,
      completed: false,
      category: template.category,
    };
  }).sort((a, b) => {
    // D-180, D-120 순서로 정렬
    const aDays = parseInt(a.recommendedDate.replace('D-', '').replace('D+', '-'));
    const bDays = parseInt(b.recommendedDate.replace('D-', '').replace('D+', '-'));
    return bDays - aDays; // 내림차순 (D-180이 먼저)
  });
}

/**
 * localStorage에서 체크리스트를 불러옵니다.
 */
export function loadChecklistFromStorage(): ChecklistItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('checklist');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * 체크리스트를 localStorage에 저장합니다.
 */
export function saveChecklistToStorage(items: ChecklistItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('checklist', JSON.stringify(items));
}

