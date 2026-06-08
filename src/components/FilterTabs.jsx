const FILTERS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

function FilterTabs({ filter, onChangeFilter }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
      {FILTERS.map((item) => {
        const isActive = filter === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChangeFilter(item.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
