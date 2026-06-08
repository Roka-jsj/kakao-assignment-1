# React Todo 앱 만들기

Vanilla JS로 만든 Todo 앱을 React Function Component 구조로 마이그레이션한 과제입니다. 기존 앱의 날짜별 Todo, 주간 뷰, 필터, 진행률, localStorage 저장 기능을 React의 state와 props 흐름으로 다시 구성했습니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`에 접속합니다.

> 현재 프로젝트는 Vite v5.x와 Tailwind CSS v4 기준이므로 Node 20 이상 환경에서 실행해야 합니다.

## 구현 기능

- Todo 생성, 조회, 인라인 수정, 완료 처리, 삭제
- 빈 Todo 입력과 빈 수정 저장 방지
- 전체 / 진행 중 / 완료 필터링
- 이전 / 다음 날짜 이동과 오늘 날짜 이동
- 선택한 날짜에 해당하는 Todo만 표시
- 선택한 날짜 기준 달성률 표시
- 주간 뷰에서 날짜 선택, 이전 / 다음 주 이동
- 날짜별 Todo 개수 표시
- 오늘 날짜와 선택 날짜 스타일 구분
- Todo 목록과 주간 뷰 기준 날짜를 localStorage에 저장

## 컴포넌트 구조

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
    DailyNavigator.jsx
    FilterTabs.jsx
    ProgressDashboard.jsx
    TodoInput.jsx
    TodoItem.jsx
    TodoList.jsx
    WeeklyCalendar.jsx
  utils/
    date.js
```

## Vanilla JS와 React 차이

- Vanilla JS에서는 `querySelector`, `innerHTML`, `appendChild`로 DOM을 직접 바꿨습니다.
- React에서는 `todos`, `selectedDate`, `filter`, `weekStartDate` 상태를 바꾸면 화면이 자동으로 다시 렌더링됩니다.
- Vanilla JS에서는 Todo 변경 함수마다 `localStorage.setItem()`을 호출했습니다.
- React에서는 `useEffect` 하나로 `todos`가 바뀔 때마다 자동 저장합니다.
- 기존 `prompt()` 수정 방식은 `TodoItem` 내부의 `isEditing`, `editText` 상태를 사용하는 인라인 수정 UI로 변경했습니다.

## 검증한 흐름

- Todo 생성 -> 수정 -> 완료/취소 -> 삭제
- 빈 입력 또는 빈 수정 저장 시 안내 메시지 표시
- 필터 탭 전환 후 Todo 추가 시 필터 상태 유지
- 날짜 이동 시 날짜별 Todo 분리
- 주간 뷰 날짜 선택과 이전/다음 주 이동
- 새로고침 후 Todo와 주간 뷰 기준 날짜 유지
- `npm run build` 성공 확인
- Headless Chrome 기준 주요 CRUD, 필터, 날짜 이동, localStorage 흐름 확인

현재 작업 환경의 Node 버전이 낮으면 Vite 실행 전에 Node 20 이상으로 업그레이드해야 합니다.
