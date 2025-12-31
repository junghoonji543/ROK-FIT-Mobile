# ROK-FIT - 군 체력 측정 모바일 앱

영상 기반 운동 카운팅을 통해 운동량을 기록하는 모바일 애플리케이션입니다.

## 주요 기능

### 1. 홈 화면
- **환영 카드**: 사용자 이름, 계급, 목표 달성률 표시
- **캘린더 뷰**: 월별 운동 기록 시각화
- **운동 종목 카드**: 팔굽혀펴기, 윗몸일으키기, 3km 달리기 등

### 2. 운동 측정
- **카메라 기반 측정**: 실시간 카메라 프리뷰
- **운동 카운팅**: 자동 카운팅 시스템 (현재 시뮬레이션, 향후 포즈 감지 통합 가능)
- **실시간 피드백**: COUNT, ANGLE, STATUS 표시
- **기록 저장**: 완료 시 자동 저장

### 3. 기록실
- **기록 조회**: 전체 운동 기록 리스트
- **필터링**: 운동 종목별 필터링
- **기록 관리**: 개별 기록 삭제 기능

### 4. 체력지표
- **등급 계산**: 현재 체력 등급 자동 계산 (특급, 1급, 2급, 3급)
- **통계**: 운동별 최고 기록, 평균, 총 운동 횟수
- **기준표**: 체력 등급별 기준 표시

## 기술 스택

- **프레임워크**: Expo SDK 54 + React Native 0.81
- **언어**: TypeScript 5.9
- **스타일링**: NativeWind 4 (Tailwind CSS)
- **카메라**: Expo Camera
- **저장소**: AsyncStorage (로컬)
- **상태 관리**: React Context API

## 프로젝트 구조

```
rok-fit-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # 홈 화면
│   │   ├── history.tsx        # 기록실
│   │   ├── stats.tsx          # 체력지표
│   │   └── more.tsx           # 더보기
│   └── workout/
│       └── [id].tsx           # 운동 측정 화면
├── lib/
│   ├── types.ts               # 타입 정의
│   ├── storage.ts             # 저장소 유틸리티
│   └── data-provider.tsx      # 데이터 컨텍스트
├── components/
│   └── screen-container.tsx   # 화면 컨테이너
└── assets/
    └── images/
        └── icon.png           # 앱 아이콘
```

## 데이터 모델

### Exercise (운동 종목)
```typescript
{
  id: string;
  name: string;
  icon: string;
  type: "counting" | "distance" | "time";
  description?: string;
}
```

### WorkoutRecord (운동 기록)
```typescript
{
  id: string;
  exerciseId: string;
  count?: number;
  distance?: number;
  duration?: number;
  date: string;
  timestamp: number;
  notes?: string;
}
```

### UserProfile (사용자 프로필)
```typescript
{
  id: string;
  name: string;
  rank: string;
  targetLevel: string;
  currentLevel: string;
  achievementRate: number;
}
```

## 확장 가능성

### 새로운 운동 종목 추가
`lib/storage.ts`의 `seedInitialData` 함수에서 새로운 운동 종목을 추가할 수 있습니다:

```typescript
{
  id: "squat",
  name: "스쿼트",
  icon: "🦵",
  type: "counting",
  description: "스쿼트 운동",
}
```

### 포즈 감지 통합 (향후 개선)
현재는 간단한 타이머 기반 시뮬레이션을 사용하지만, 다음 방법으로 실제 포즈 감지를 통합할 수 있습니다:

1. **Expo ML Kit**: 네이티브 포즈 감지
2. **TensorFlow Lite**: 네이티브 모듈
3. **서버 기반**: 영상 프레임을 서버로 전송하여 처리

## 개발 가이드

### 로컬 개발
```bash
pnpm dev
```

### 테스트
```bash
pnpm test
```

### 빌드
```bash
pnpm build
```

## 체력 등급 기준

| 등급 | 팔굽혀펴기 | 윗몸일으키기 |
|------|-----------|-------------|
| 특급 | 72회 이상 | 86회 이상   |
| 1급  | 65회 이상 | 78회 이상   |
| 2급  | 58회 이상 | 70회 이상   |
| 3급  | 50회 이상 | 62회 이상   |

## 향후 개선 사항

1. **실제 포즈 감지**: TensorFlow.js MoveNet 또는 ML Kit 통합
2. **소셜 기능**: 친구와 기록 공유, 랭킹 시스템
3. **훈련 프로그램**: 맞춤형 운동 프로그램 제공
4. **알림**: 운동 리마인더 및 목표 달성 알림
5. **클라우드 동기화**: 서버 기반 데이터 저장 (선택적)
6. **다양한 운동 종목**: 턱걸이, 달리기 등 추가
7. **통계 차트**: 시각화된 진행 상황 그래프
