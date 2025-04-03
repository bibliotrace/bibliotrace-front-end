import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterBox from "../components/FilterBox.jsx";
import NavBar from "../components/NavBar";
const MobileFilter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(location.state?.initSearchInput ?? "");
  console.log("IN FIlter page search input: ", searchInput);
  const [filterInput, setFilterInput] = useState(
    location.state?.initFilterCheckBox ?? { Audiences: [], Genres: [], Special: [] }
  );
  console.log("IN FIlter page filter input: ", filterInput);

  //handle routes
  const handleSearch = () => {
    console.log("HOME.jsx searchInput: ", searchInput);
    navigate("/search", { state: { initSearchInput: filterInput } });
  };

  //event
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const jwt = Cookies.get("authToken");
    if (jwt == null) {
      navigate("login", { state: { loginType: "User Login" } });
    }
  }, []);

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

  return (
    <div className={`h-full w-full pb-5  search-bg flex flex-col items-center`}>
      <NavBar useDarkTheme={true} showTitle={false} bgColor={"none"} textColor={"#000000"} />

      <h1 className="mt-3 md:mt-16 md:text-5xl text-2xl text-gray">Bibliotrace 3.0</h1>

      {/* Search Bar */}
      <div className="h-16 my-6 flex md:w-7/12 w-full justify-center">
        <input
          className="m-2 px-3 w-10/12 border-2 border-purple rounded-2xl placeholder-purple placeholder:font-bold"
          type="text"
          placeholder="Search"
          value={searchInput}
          onInput={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        ></input>
        <button
          className="m-2 border-purple border-2 bg-white rounded-2xl font-bold text-purple"
          onClick={handleSearch}
        >
          Go!
        </button>
      </div>
      <h1 className="text-darkBlue text-3xl m-3">Filter</h1>
      <FilterBox
        onClose={(selectedFilters) => {
          console.log("pre set: ", filterInput);
          setFilterInput(selectedFilters);
          setTimeout(() => {
            // Ensure state update before navigation
            console.log("post set:", filterInput);
            navigate("/search", {
              state: { initFilterInput: selectedFilters, initSearchInput: searchInput },
            });
          }, 0);
        }}
        prevSelectedItems={filterInput}
      />
    </div>
  );
};

export default MobileFilter;
