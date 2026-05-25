import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";

function FilterSection({ title, items, selected, onToggle, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-3 text-[#110057] font-semibold"
      >
        {title}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 pb-4">
          {items.map((item) => {
            const isSelected = selected.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => onToggle(item)}
                className={`px-3 py-2 text-xs rounded-full border transition-colors text-center ${
                  isSelected
                    ? "bg-[#110057] text-white border-[#110057]"
                    : "bg-white text-[#110057] border-gray-300 hover:border-[#110057]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchSidebar({
  filterInput,
  setFilterInput,
  genres,
  audiences,
  onClose,
}) {
  const toggleGenre = (g) => {
    const next = filterInput.Genres.includes(g)
      ? filterInput.Genres.filter((x) => x !== g)
      : [...filterInput.Genres, g];
    setFilterInput({ ...filterInput, Genres: next });
  };

  const toggleAudience = (a) => {
    const next = filterInput.Audiences.includes(a)
      ? filterInput.Audiences.filter((x) => x !== a)
      : [...filterInput.Audiences, a];
    setFilterInput({ ...filterInput, Audiences: next });
  };

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-[#110057]">Filters</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[#110057] lg:hidden"
            aria-label="Close filters"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <FilterSection
        title="Genre"
        items={genres}
        selected={filterInput.Genres}
        onToggle={toggleGenre}
      />
      <FilterSection
        title="Audiences"
        items={audiences}
        selected={filterInput.Audiences}
        onToggle={toggleAudience}
      />
    </div>
  );
}
