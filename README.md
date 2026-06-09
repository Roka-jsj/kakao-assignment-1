# 과제 2. React Todo 앱

과제 1에서 Vanilla JS로 구현했던 Todo 앱을 React Function Component와 Tailwind CSS로 다시 구성한 프로젝트입니다.
DOM을 직접 조작하던 방식 대신 `useState`, `useEffect`, props 전달, 조건부 렌더링으로 화면과 데이터를 관리합니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

> Tailwind CSS v4의 실행 환경을 맞추기 위해 Node 20 이상을 권장합니다.

## 프로젝트 구조

```text
kakao-assign-2/
├── src/
│   ├── components/
│   │   ├── FilterTabs.jsx     # 전체 / 진행 중 / 완료 필터 탭
│   │   ├── TodoInput.jsx      # Todo 입력과 빈 입력 안내
│   │   ├── TodoItem.jsx       # 완료, 인라인 수정, 삭제
│   │   ├── TodoList.jsx       # 선택 날짜와 필터에 맞는 목록 출력
│   │   └── WeekNavigator.jsx  # 주간 날짜 선택과 Todo 개수 표시
│   ├── App.jsx                # 전체 상태와 데이터 흐름 관리
│   ├── index.css              # Tailwind 진입점과 전역 스타일
│   └── main.jsx               # React 앱 진입점
├── index.html
├── vite.config.js
└── package.json
```

## 구현 기능

### 기본 미션

- Todo 생성, 조회, 인라인 수정, 완료 처리, 삭제
- 빈 Todo 입력과 빈 수정 저장 방지
- 전체 / 진행 중 / 완료 상태별 필터링
- 오늘 날짜 표시와 이전 / 다음 날짜 이동
- 선택된 날짜에 해당하는 Todo만 표시
- Todo 생성 시 현재 선택 날짜를 `YYYY-MM-DD` 형태로 저장
- `localStorage`에 Todo 데이터를 JSON 형태로 저장하고 새로고침 후 복원

### 도전 미션

- 주간 뷰에서 이번 주 날짜 목록 표시
- 이전 주 / 다음 주 이동
- 날짜 셀 클릭 시 선택 날짜와 Todo 목록이 함께 변경
- 날짜별 Todo 개수 표시
- 오늘 날짜와 선택 날짜를 시각적으로 구분
- `weekStartDate`를 저장해 새로고침 후에도 주간 뷰 기준 유지

## 상태와 컴포넌트 설계

- `App.jsx`는 `todos`, `selectedDate`, `filter`, `weekStartDate` 상태를 관리합니다.
- `TodoInput`은 입력값 상태를 가지고, 유효한 텍스트만 상위 컴포넌트에 전달합니다.
- `TodoItem`은 `isEditing`, `editText` 상태로 `prompt()` 없이 인라인 수정 UI를 전환합니다.
- `FilterTabs`는 현재 필터를 props로 받아 활성 탭을 표시하고, 클릭 시 필터 변경을 요청합니다.
- `TodoList`는 이미 필터링된 Todo 배열을 받아 목록과 빈 상태 메시지를 렌더링합니다.
- `WeekNavigator`는 주간 날짜 배열과 전체 Todo 목록을 받아 날짜별 Todo 개수를 계산해 보여줍니다.

## 활용 스택

- React v18+
- Vite v5.x
- Tailwind CSS v4.x (`@tailwindcss/vite`)
- JavaScript
- Web Storage API (`localStorage`)

## Vanilla JS와 달라진 점

- `querySelector`, `innerHTML`, `appendChild` 대신 state 변경으로 화면을 다시 그립니다.
- Todo 변경 후 직접 저장 함수를 반복 호출하지 않고, `useEffect`에서 `todos` 변경을 감지해 저장합니다.
- `prompt()` 팝업 수정 대신 Todo 항목 내부의 편집 상태로 입력창을 전환합니다.
- 날짜, 필터, 주간 뷰 상태가 props를 통해 하위 컴포넌트로 전달됩니다.
