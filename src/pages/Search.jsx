import Cookies from "js-cookie";
import { Menu, Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import NavBar from "../components/NavBar.jsx";
import SearchResultCard from "../components/SearchResultCard.jsx";
import SearchSidebar from "../components/SearchSidebar.jsx";

const INITIAL_VISIBLE = 5;
const SHOW_MORE_INCREMENT = 5;

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState(location.state?.initSearchInput ?? "");
  const [filterInput, setFilterInput] = useState(
    location.state?.initFilterInput ?? { Audiences: [], Genres: [], Special: [] }
  );
  const [inputQuery, setInputQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const genres = (Cookies.get("genreList") ?? "").split(",").filter(Boolean);
  const audiences = (Cookies.get("audienceList") ?? "").split(",").filter(Boolean);

  const conductSearch = () => {
    const emptyFilters =
      filterInput.Audiences.length === 0 &&
      filterInput.Genres.length === 0 &&
      filterInput.Special.length === 0;

    if (searchInput.trim() === "" && emptyFilters) {
      setSearchResults([]);
      setInputQuery("");
      return;
    }

    setLoading(true);

    let filterString = "";
    if (filterInput.Audiences.length > 0) {
      filterString +=
        "||Audience:" + filterInput.Audiences.map(encodeURIComponent).join(",") + "||";
    }
    if (filterInput.Genres.length > 0) {
      filterString += "||Genre:" + filterInput.Genres.map(encodeURIComponent).join(",") + "||";
    }
    if (filterInput.Special.length > 0) {
      filterString +=
        "||Special:" + filterInput.Special.map(encodeURIComponent).join(",") + "||";
    }

    const jwt = Cookies.get("authToken");
    fetch(`http://localhost:8080/api/search/query/${filterString}${searchInput}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
      .then((response) => {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        if (!response.ok) {
          setSearchResults([]);
          setInputQuery(searchInput);
          setLoading(false);
          return;
        }
        response.json().then((data) => {
          setSearchResults(data.results ?? []);
          setVisibleCount(INITIAL_VISIBLE);
          setInputQuery(searchInput);
          setLoading(false);
        });
      })
      .catch(() => {
        setSearchResults([]);
        setLoading(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") conductSearch();
  };

  useEffect(() => {
    if (searchInput !== "") conductSearch();
  }, []);

  useEffect(() => {
    if (
      searchInput !== "" ||
      filterInput.Audiences.length > 0 ||
      filterInput.Genres.length > 0 ||
      filterInput.Special.length > 0
    ) {
      conductSearch();
    }
  }, [filterInput]);

  const visibleResults = searchResults.slice(0, visibleCount);
  const hasMore = visibleCount < searchResults.length;

  const sidebarProps = {
    filterInput,
    setFilterInput,
    genres,
    audiences,
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <NavBar useDarkTheme={true} showTitle={false} bgColor="white" textColor="#110057" />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-80 border-r border-gray-200 shrink-0">
          <SearchSidebar {...sidebarProps} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-6">
          <div className="mb-6">
            <p className="text-xs text-[#110057]">Bibliotrace</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#110057]">Search Results</h2>
            <div className="relative mt-4 max-w-xl">
              <SearchIcon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9c7ad6] pointer-events-none"
              />
              <input
                type="text"
                value={searchInput}
                onInput={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="search"
                className="w-full pl-10 pr-4 py-2 border-2 border-[#9c7ad6] rounded-full text-[#110057] placeholder-[#9c7ad6] focus:outline-none focus:border-[#110057]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden mb-4 inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold text-[#110057]"
          >
            <Menu size={16} /> Filters
          </button>

          {inputQuery && (
            <>
              <h3 className="text-lg sm:text-xl font-bold text-[#110057]">
                Showing results for &ldquo;{inputQuery}&rdquo;
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found
              </p>
            </>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="3rem" />
            </div>
          ) : searchResults.length === 0 ? (
            inputQuery ? (
              <p className="text-gray-700">No results found. Please try a different query.</p>
            ) : null
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {visibleResults.map((bookData) => (
                  <SearchResultCard
                    key={bookData.id ?? bookData.isbn}
                    bookData={bookData}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(visibleCount + SHOW_MORE_INCREMENT)}
                    className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-semibold text-[#110057] shadow-sm hover:shadow-md transition-shadow"
                  >
                    Show more
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-80 max-w-[85%] bg-white z-50 lg:hidden shadow-xl">
            <SearchSidebar {...sidebarProps} onClose={() => setDrawerOpen(false)} />
          </aside>
        </>
      )}
    </div>
  );
}
