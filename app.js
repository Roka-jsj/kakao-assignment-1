// 로컬스토리지에서 기존 데이터를 불러오기
let todoListState = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// 선택된 날짜와 현재 화면에 보여지는 주(Week)의 기준이 되는 월요일을 관리할 변수
let currentSelectedDate = new Date();
let currentViewMonday = getMonday(new Date());

// DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoListContainer = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');

// 주간 네비게이션 DOM 선택
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const currentMonthDisplay = document.getElementById('current-month-display');
const weekCalendarContainer = document.getElementById('week-calendar');

// 데이터를 로컬스토리지에 저장하는 함수
function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todoListState));
}

// --- 날짜 관련 함수들 ---

// 특정 날짜가 포함된 주의 '월요일'을 계산하여 반환하는 함수
function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay(); // 0(일) ~ 6(토)
    // 일요일(0)이면 -6일, 그 외 요일이면 월요일이 되도록 차이 계산
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

// Date 객체를 'YYYY-MM-DD' 형태의 문자열로 변환 (데이터 비교용)
function getFormattedDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 주차 이동 함수 (offset은 -1(이전 주) 또는 1(다음 주))
function changeWeek(offset) {
    // 기준이 되는 월요일에 7일을 더하거나 빼서 주간을 이동
    currentViewMonday.setDate(currentViewMonday.getDate() + (offset * 7));
    renderWeeklyCalendar(); 
}

// 7일간의 주간 캘린더 렌더링 및 개수 업데이트 함수
function renderWeeklyCalendar() {
    weekCalendarContainer.innerHTML = '';

    // 헤더에 현재 표시 중인 주의 연/월 업데이트
    const year = currentViewMonday.getFullYear();
    const month = currentViewMonday.getMonth() + 1;
    currentMonthDisplay.textContent = `${year}년 ${month}월`;

    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const todayString = getFormattedDate(new Date());
    const selectedString = getFormattedDate(currentSelectedDate);

    // 월요일(0)부터 일요일(6)까지 반복하며 날짜 카드 생성
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(currentViewMonday);
        currentDay.setDate(currentViewMonday.getDate() + i); // 월요일 기준 +i일

        const dateString = getFormattedDate(currentDay);
        
        // [새로운 기능] 해당 날짜의 등록된 Todo 총 개수 구하기
        const count = todoListState.filter(todo => todo.date === dateString).length;

        // 개별 날짜 카드(div) 생성
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        // 선택된 날짜와 오늘 날짜의 시각적 구분 클래스 부여
        if (dateString === selectedString) {
            dayCard.classList.add('selected');
        }
        if (dateString === todayString) {
            dayCard.classList.add('today');
        }

        // 날짜 클릭 시 동작
        dayCard.onclick = () => {
            currentSelectedDate = currentDay;
            renderWeeklyCalendar(); // 클릭된 카드 강조 갱신
            renderTodos();          // 하단 리스트 해당 날짜로 갱신
        };

        // 요일 텍스트
        const dayNameSpan = document.createElement('span');
        dayNameSpan.className = 'day-name';
        dayNameSpan.textContent = dayNames[i];

        // 일(날짜) 텍스트
        const dayNumSpan = document.createElement('span');
        dayNumSpan.className = 'day-num';
        dayNumSpan.textContent = currentDay.getDate();

        // Todo 개수 뱃지 (1개 이상이면 메인 컬러로 활성화)
        const countSpan = document.createElement('span');
        countSpan.className = `todo-count ${count > 0 ? 'has-todos' : ''}`;
        countSpan.textContent = count;

        // 카드에 요소 추가 후 캘린더 컨테이너에 삽입
        dayCard.appendChild(dayNameSpan);
        dayCard.appendChild(dayNumSpan);
        dayCard.appendChild(countSpan);
        
        weekCalendarContainer.appendChild(dayCard);
    }
}

// --- Todo 핵심 CRUD 함수들 ---

function createTodo() {
    const textValue = todoInput.value.trim();
    if (textValue === '') {
        alert('할 일을 입력해주세요!');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: textValue,
        isCompleted: false,
        date: getFormattedDate(currentSelectedDate) // 현재 선택된 날짜에 저장
    };

    todoListState.push(newTodo);
    todoInput.value = '';
    
    saveTodosToLocalStorage();
    renderWeeklyCalendar(); // 캘린더의 Todo 개수 뱃지 갱신을 위해 호출
    renderTodos();
}

function toggleComplete(id) {
    todoListState = todoListState.map(todo => {
        if (todo.id === id) {
            return { ...todo, isCompleted: !todo.isCompleted };
        }
        return todo;
    });
    
    saveTodosToLocalStorage();
    renderTodos();
}

function updateTodo(id) {
    const todoToEdit = todoListState.find(todo => todo.id === id);
    if (!todoToEdit) return;

    const updatedText = prompt('할 일을 수정하세요:', todoToEdit.text);

    if (updatedText !== null && updatedText.trim() !== '') {
        todoListState = todoListState.map(todo => {
            if (todo.id === id) {
                return { ...todo, text: updatedText.trim() };
            }
            return todo;
        });
        
        saveTodosToLocalStorage();
        renderTodos();
    } else if (updatedText !== null && updatedText.trim() === '') {
        alert('수정할 내용을 입력해주세요!');
    }
}

function deleteTodo(id) {
    todoListState = todoListState.filter(todo => todo.id !== id);
    
    saveTodosToLocalStorage();
    renderWeeklyCalendar(); // 캘린더의 Todo 개수 뱃지 갱신을 위해 호출
    renderTodos();
}

function changeFilter(filterType) {
    currentFilter = filterType;
    renderTodos(); 
}

// --- 화면 렌더링 함수 ---

function renderTodos() {
    todoListContainer.innerHTML = '';

    // 1. 현재 선택된 날짜 기준 필터링
    const targetDateString = getFormattedDate(currentSelectedDate);
    let filteredTodos = todoListState.filter(todo => todo.date === targetDateString);

    // 2. 상태(전체/진행 중/완료) 기준 필터링
    if (currentFilter === 'active') {
        filteredTodos = filteredTodos.filter(todo => !todo.isCompleted);
    } else if (currentFilter === 'completed') {
        filteredTodos = filteredTodos.filter(todo => todo.isCompleted);
    }

    // 탭 시각적 활성화
    filterButtons.forEach(button => {
        if (button.dataset.filter === currentFilter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // 리스트 렌더링
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.isCompleted ? 'completed' : ''}`;

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;

        const actionDiv = document.createElement('div');
        actionDiv.className = 'action-buttons';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'btn-complete';
        completeBtn.textContent = todo.isCompleted ? '취소' : '완료';
        completeBtn.onclick = () => toggleComplete(todo.id);

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.textContent = '수정';
        editBtn.onclick = () => updateTodo(todo.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '삭제';
        deleteBtn.onclick = () => deleteTodo(todo.id);

        actionDiv.appendChild(completeBtn);
        actionDiv.appendChild(editBtn);
        actionDiv.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(actionDiv);
        todoListContainer.appendChild(li);
    });
}

// --- 초기화 및 이벤트 리스너 등록 ---

// 주간 네비게이션 이벤트
prevWeekBtn.addEventListener('click', () => changeWeek(-1));
nextWeekBtn.addEventListener('click', () => changeWeek(1));

// Todo 추가 이벤트
addBtn.addEventListener('click', createTodo);
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        createTodo();
    }
});

// 필터 버튼 이벤트
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        changeFilter(button.dataset.filter);
    });
});

// 초기 구동 시 주간 캘린더와 리스트 렌더링
renderWeeklyCalendar();
renderTodos();