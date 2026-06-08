const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];
const FULL_DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export function createLocalDate(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === "string") {
    const [year, month, day] = value.split("-").map(Number);

    if (year && month && day) {
      return new Date(year, month - 1, day);
    }
  }

  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export function getFormattedDate(value) {
  const date = createLocalDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getMonday(value) {
  const date = createLocalDate(value);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);

  date.setDate(diff);
  return date;
}

export function addDays(value, amount) {
  const date = createLocalDate(value);
  date.setDate(date.getDate() + amount);

  return date;
}

export function addWeeks(value, amount) {
  return addDays(value, amount * 7);
}

export function getWeekDays(weekStartDate) {
  return DAY_NAMES.map((dayName, index) => {
    const date = addDays(weekStartDate, index);

    return {
      date,
      dateString: getFormattedDate(date),
      dayName,
      dayNumber: date.getDate(),
    };
  });
}

export function formatMonthTitle(value) {
  const date = createLocalDate(value);

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function formatKoreanDate(value) {
  const date = createLocalDate(value);
  const dayName = FULL_DAY_NAMES[date.getDay()];

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${dayName}요일`;
}
