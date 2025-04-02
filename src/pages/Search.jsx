import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import NavBar from "../components/NavBar.jsx";
import Filter from "../assets/filter.svg?react";
import Next from "../assets/next.svg?react";
import Prev from "../assets/prev.svg?react";
import SearchResult from "../components/SearchResult.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import FilterBox from "../components/FilterBox.jsx";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const rowHeight = 160;
  const headerHeight = 450;
  const [showFilter, setShowFilter] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [pageOffset, setPageOffset] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(location.state?.initSearchInput ?? ""); // Arch idea: use the initSearchInput as a text-based passthrough for searches by Genre, Age group, date range, etc...
  // Maybe the string can be like "||GENRE:fantasy||" or "||AGE:board||" or "||DATE_START:01/02/0003 DATE_END:04/05/0006||" or "||IDENTIFIER:searchstring||"
  const [filterInput, setFilterInput] = useState(
    location.state?.initFilterInput ?? { Audiences: [], Genres: [], Special: [] }
  );
  const [inputQuery, setInputQuery] = useState("");
  const [searchResults, setSearchResults] = useState([
    {
      key: "helloSearch",
      selfLink: "none",
      title: "",
      author: "",
      isbn: "none",
      genre: "",
      series: "",
    },
  ]);

  const conductSearch = () => {
    if (
      (searchInput == "" || searchInput == null) &&
      (filterInput == "" || filterInput == null)
    ) {
      return;
    }
    setLoading(true);

    // Generate Filter String
    let filterString = "";
    if (filterInput.Audiences.length > 0) {
      filterString += "||Audience:";
      for (let i = 0; i < filterInput.Audiences.length; i++) {
        filterString += filterInput.Audiences[i];
        if (i < filterInput.Audiences.length - 1) {
          filterString += ",";
        }
      }
      filterString += "||";
    }
    if (filterInput.Genres.length > 0) {
      filterString += "||Genre:";
      for (let i = 0; i < filterInput.Genres.length; i++) {
        filterString += filterInput.Genres[i];
        if (i < filterInput.Genres.length - 1) {
          filterString += ",";
        }
      }
      filterString += "||";
    }
    if (filterInput.Special.length > 0) {
      filterString += "||Special:";
      for (let i = 0; i < filterInput.Special.length; i++) {
        filterString += filterInput.Special[i];
        if (i < filterInput.Special.length - 1) {
          filterString += ",";
        }
      }
      filterString += "||";
    }

    try {
      const jwt = Cookies.get("authToken");
      fetch(`http://localhost:8080/api/search/query/${filterString}${searchInput}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              const bookItems = data.results;
              console.log("I GOT THE RESULTS!!");
              console.log(bookItems);
              setSearchResults(bookItems);
              setPageOffset(0);
              setInputQuery(searchInput);
              setLoading(false);
            });
          } else {
            if (response.status === 401) {
              navigate('/login')
            }
            setSearchResults([
              {
                author: `Error: ${response.status} Code Received`,
                key: "Error Code",
              },
              {
                author: `Error Address: ${response.url}`,
                key: "Error Addy",
              },
            ]);
            setPageOffset(0);
            setInputQuery(searchInput);
            setLoading(false);
          }
        })
        .catch((error) => {
          setSearchResults([
            {
              author: `Error: ${error}`,
              key: "errorResult",
            },
          ]);
          setPageOffset(0);
          setInputQuery(searchInput);
          setLoading(false);
        });
    } catch (error) {
      setSearchResults([
        {
          author: `Error: ${error}`,
        },
      ]);
      setPageOffset(0);
      setInputQuery(searchInput);
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      conductSearch();
    }
  };

  // Function to calculate the number of rows that can fit
  const calculateRowCount = () => {
    const availableHeight = window.innerHeight - headerHeight;
    const count = Math.max(5, Math.floor(availableHeight / rowHeight));
    setRowCount(count);
  };

  // Effect that runs once at initialization
  useEffect(() => {
    if (searchInput != "") {
      conductSearch();
    }

    calculateRowCount(); // Initial calculation
    window.addEventListener("resize", calculateRowCount);

    // Clean up the listener on unmount
    return () => {
      window.removeEventListener("resize", calculateRowCount);
    };
  }, []);

  useEffect(() => {
    if (
      searchInput != "" ||
      filterInput.Audiences.length > 0 ||
      filterInput.Genres.length > 0 || 
      filterInput.Special.length > 0
    ) {
      conductSearch();
    }
  }, [filterInput]);

  const incrementPage = () => {
    if (pageOffset + rowCount < searchResults.length) {
      setPageOffset(pageOffset + rowCount);
    }
  };

  const decrementPage = () => {
    if (pageOffset - rowCount < 0) {
      setPageOffset(0);
    } else {
      setPageOffset(pageOffset - rowCount);
    }
  };

  const handleFilterPress = () => {
    console.log("Buttons been pressed");
    setShowFilter(!showFilter);
  };

  const handleMobileFilterNav = () => {
    console.log("going to filter");
    console.log("filter input: " , filterInput);
    const filterBody = { 
      Audiences: [...filterInput.Audiences], 
      Genres: [...filterInput.Genres], 
      Special: [...filterInput.Special] 
    };
    navigate('/filter', { state: { initFilterCheckBox: filterBody, initSearchInput: searchInput }});
  };

  return (
    <div
      className="w-screen pb-5 search-bg flex flex-col items-center"
      style={{ minHeight: "100vh" }}
    >
      <NavBar useDarkTheme={true} showTitle={false} bgColor={"none"} />
      <h1 className="mt-16 text-5xl">Bibliotrace 3.0</h1>
      <div className="h-16 my-6 flex w-10/12 md:w-7/12 justify-center">
        {" "}
        {/* Search Bar */}
        <input
          className="m-2 px-3 w-10/12 border-2 border-[#110057] rounded-2xl"
          type="text"
          placeHolder="Search For Books"
          value={searchInput}
          onInput={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        ></input>
        <button
          className="flex items-center m-2 border-[#110057] border-2 bg-white rounded-2xl"
          onClick={conductSearch}
        >
          {isLoading ? <LoadingSpinner size={"3rem"} /> : "Go!"}
        </button>
      </div>
      <div className="w-10/12">
        {" "}
        {/* Search Results Table */}
        <div className="w-full flex justify-between my-4">
          {" "}
          {/* Buttons Above Results */}
          <button className="bg-transparent border-none flex xl:hidden " onClick={handleMobileFilterNav}>
            <Filter />
          </button>
          <button className="bg-transparent border-none hidden xl:flex" onClick={handleFilterPress}>
            <Filter />
          </button>
          {/* Filter Box (Overlay) */}
          {showFilter && (
            <div
              className="fixed top-5 left-52 w-full h-full flex justify-center items-center z-50
                          sm:w-80 md:w-96 lg:w-[30vw] xl:w-[50vw] max-w-full p-4"
            >
              <FilterBox
                onClose={(selectedFilters) => {
                  setShowFilter(false);
                  setFilterInput(selectedFilters);
                }}
                prevSelectedItems={filterInput}
              />
            </div>
          )}
          <p className="flex items-center">
            {inputQuery != "" ? `Showing search results for "${inputQuery}"` : ""}
          </p>
          <div className="w-10"></div>{" "}
          {/* placeholder to put above p element in the center */}
        </div>
        <div className="">
          {" "}
          {/* Results Table */}
          <div className="h-10 hidden md:flex justify-between bg-[#110057] text-white text-center items-center rounded-t-2xl">
            {" "}
            {/* Table Header */}
            <div className="h-10 flex items-center justify-center px-3 border-r-slate-50 border-r-2 w-28 text-transparent">
              <h3>Cover</h3>
            </div>
            <div className="h-10 flex items-center justify-center px-3 border-r-slate-50 border-r-2 w-1/3">
              <h3>Title</h3>
            </div>
            <div className="h-10 flex items-center justify-center px-3 border-r-slate-50 border-r-2 w-1/5">
              <h3>Author</h3>
            </div>
            <div className="h-10 flex items-center justify-center px-3 border-r-slate-50 border-r-2 w-1/5">
              <h3>Genre</h3>
            </div>
            <div className="h-10 flex items-center justify-center px-3 w-1/5">
              <h3>Series</h3>
            </div>
          </div>
          {Array.from({ length: rowCount }, (_, index) => {
            const targetIndex = index + pageOffset;
            if (targetIndex >= searchResults.length) {
              return null;
            }
            const bookData = searchResults[index + pageOffset];
            return bookData ? (
              <SearchResult
                key={bookData.id}
                bookData={bookData}
              />
            ) : null;
          })}
        </div>
        <div className="flex align-middle items-center justify-center py-4">
          {" "}
          {/* Pagination Buttons */}
          <button
            className="bg-transparent flex flex-col items-center"
            onClick={decrementPage}
          >
            <Prev />
            <p className="">Previous</p>
          </button>
          <p className="h-12">
            Showing {pageOffset + 1}-
            {Math.min(pageOffset + rowCount, searchResults.length)} of {searchResults.length}
          </p>
          <button
            className="bg-transparent flex flex-col items-center"
            onClick={incrementPage}
          >
            <Next />
            <p className="">Next</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
