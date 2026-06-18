# Kakao Assignment 3 Todo

Next.js App Router와 FastAPI를 연결한 풀스택 Todo 앱입니다. 기존 React/Vite Todo 앱의 날짜별 보기, 주간 보기, 진행률, 인라인 추가/수정/삭제 UX를 유지하면서 Todo 데이터 저장은 `localStorage`가 아닌 FastAPI + SQLite 서버 흐름으로 전환했습니다.

## 배포 URL

| 구분 | URL |
| --- | --- |
| Frontend | 준비 중 |
| Backend API | 준비 중 |
| API Docs | 준비 중 |

배포가 끝나면 위 표의 `준비 중` 값을 실제 URL로 교체하면 됩니다.

## 주요 기능

- Todo 생성, 조회, 수정, 삭제
- Todo 완료 토글
- 날짜별 Todo 목록
- 이전/다음 날짜 이동과 오늘 이동
- 주간 보기와 날짜별 Todo 개수 표시
- 선택 날짜 기준 진행률 표시
- 인라인 Todo 추가/수정/삭제
- Todo 생성 전용 페이지: `/todos/new`
- Todo 수정 전용 페이지: `/todos/[todoId]`
- URL 기반 필터: `/todos?filter=active`, `/todos?filter=completed`
- URL 기반 검색: `/todos?search=키워드`
- 서버 기반 필터 + 검색 동시 적용
- Next API Route를 통한 FastAPI 프록시

## 기술 스택

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

### Backend

- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic v2
- python-dotenv

## 프로젝트 구조

```txt
kakao-assignment-3/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── app/
│   │   ├── api/todos/
│   │   ├── todos/
│   │   ├── actions.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

## 환경변수 설정

환경변수 예시 파일을 복사해 로컬 설정 파일을 만듭니다.

```bash
cp backend/.env.example backend/.env.local
cp frontend/.env.example frontend/.env.local
```

### `backend/.env.local`

```env
DATABASE_URL=sqlite:///./todos.db
FRONTEND_ORIGIN=http://localhost:3000
```

- `DATABASE_URL`: SQLite DB 위치입니다.
- `FRONTEND_ORIGIN`: CORS 허용 프론트엔드 주소입니다. 배포 후에는 Vercel 등 프론트 배포 URL로 바꿉니다.

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_URL=http://localhost:8000
```

- `NEXT_PUBLIC_API_URL`: Client Component에서 Next API Route를 호출할 때 사용합니다.
- `BACKEND_URL`: Server Component, `actions.ts`, `route.ts`에서 FastAPI를 호출할 때 사용합니다.

## 로컬 실행

### 1. Backend 실행

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

확인 주소:

- `http://localhost:8000`
- `http://localhost:8000/docs`

### 2. Frontend 실행

Node.js 20 이상을 사용합니다.

```bash
cd frontend
npm install
npm run dev
```

확인 주소:

- `http://localhost:3000`
- `http://localhost:3000/todos`

## API 명세

Base URL은 로컬 기준 `http://localhost:8000`입니다.

| Method | Endpoint | 설명 |
| --- | --- | --- |
| `GET` | `/` | API 서버 상태 확인 |
| `GET` | `/todos` | Todo 전체 목록 조회 |
| `GET` | `/todos?filter=active` | 진행 중 Todo 조회 |
| `GET` | `/todos?filter=completed` | 완료 Todo 조회 |
| `GET` | `/todos?search=키워드` | 키워드 검색 |
| `GET` | `/todos?filter=active&search=키워드` | 필터 + 검색 동시 적용 |
| `POST` | `/todos` | Todo 생성 |
| `GET` | `/todos/{todo_id}` | Todo 단건 조회 |
| `PUT` | `/todos/{todo_id}` | Todo 수정 |
| `DELETE` | `/todos/{todo_id}` | Todo 삭제 |

### Todo 요청/응답 형태

```ts
type Todo = {
  id: number;
  title: string;
  completed: boolean;
  date: string | null;
};
```

생성 예시:

```json
{
  "title": "과제 제출하기",
  "completed": false,
  "date": "2026-06-17"
}
```

수정 예시:

```json
{
  "title": "과제 최종 점검",
  "completed": true,
  "date": "2026-06-17"
}
```

## 데이터 흐름

```txt
초기 목록 조회:
/todos/page.tsx → app/actions.ts → FastAPI

클라이언트 상호작용:
Client Component → /api/todos → FastAPI → SQLite

수정 페이지 단건 조회:
/todos/[todoId]/page.tsx → app/actions.ts → FastAPI
```

Todo 데이터는 SQLite에 저장됩니다. `localStorage`는 Todo 저장에 사용하지 않고, 마지막 선택 날짜와 주간 기준일 같은 화면 전용 상태에만 사용합니다.

## 배포 가이드

### Frontend: Vercel 예시

1. GitHub 저장소를 Vercel에 연결합니다.
2. Root Directory를 `frontend`로 설정합니다.
3. 환경변수를 설정합니다.

```env
NEXT_PUBLIC_API_URL=https://프론트배포주소/api
BACKEND_URL=https://백엔드배포주소
```

4. 배포가 완료되면 README의 Frontend URL을 교체합니다.

### Backend: Render 또는 Railway 예시

1. GitHub 저장소를 Render/Railway에 연결합니다.
2. Root Directory를 `backend`로 설정합니다.
3. Start Command를 설정합니다.

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

4. 환경변수를 설정합니다.

```env
DATABASE_URL=sqlite:///./todos.db
FRONTEND_ORIGIN=https://프론트배포주소
```

5. 배포가 완료되면 README의 Backend API와 API Docs URL을 교체합니다.

> SQLite는 간단한 과제 제출과 데모에는 충분하지만, 배포 환경에서 파일 시스템이 초기화되는 플랫폼이면 데이터가 사라질 수 있습니다. 장기 운영이 필요하면 PostgreSQL 같은 외부 DB로 바꾸는 것이 좋습니다.

## 검증 방법

Backend:

```bash
cd backend
python -m py_compile main.py
source .venv/bin/activate
uvicorn main:app --reload
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

브라우저 확인:

- `/todos`
- `/todos/new`
- `/todos/[todoId]`
- 필터 URL: `/todos?filter=active`
- 검색 URL: `/todos?search=키워드`

## 제출 전 체크리스트

- [ ] `backend/.env.local`이 Git에 올라가지 않는다.
- [ ] `frontend/.env.local`이 Git에 올라가지 않는다.
- [ ] `node_modules`, `.next`, `.venv`, `todos.db`가 Git에 올라가지 않는다.
- [ ] `npm run lint`가 통과한다.
- [ ] `npm run build`가 통과한다.
- [ ] `http://localhost:8000/docs`에서 API를 확인했다.
- [ ] `http://localhost:3000/todos`에서 주요 기능을 확인했다.
