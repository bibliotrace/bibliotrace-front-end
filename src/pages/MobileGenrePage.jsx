import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarButton from "../components/BarButtons";
import NavBar from "../components/NavBar";

const Genre = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const genreListString = Cookies.get("genreList");
  let genres = [];
  if (genreListString) {
    const genreList = genreListString.split(",");
    console.log(genreList);
    genres = genreList.map((genre) => {
      return { text: genre };
    });
  }

  //handle routes
  const handleSearch = () => {
    console.log("HOME.jsx searchInput: ", searchInput);
    navigate("/search", { state: { initSearchInput: searchInput } });
  };

  const handleGenreSearch = (filterInput) => {
    console.log("Whats in the filter: ", filterInput);
    const filterBody = { Audiences: [], Genres: [], Special: [] };
    filterBody.Genres.push(filterInput);
    navigate("/search", { state: { initFilterInput: filterBody } });
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

  return (
    <div className={`h-full w-full pb-5 start-bg flex flex-col items-center`}>
      <NavBar useDarkTheme={false} showTitle={false} bgColor={"#110057"} textColor={"#FFFFFF"} />

      <h1 className="mt-3 md:mt-16 md:text-5xl text-2xl text-white">Bibliotrace 3.0</h1>

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

      <h1 className="text-white text-2xl">Explore by Genre</h1>
      <ul className="w-full">
        {genres.map((button, index) => (
          <BarButton
            key={index}
            text={button.text}
            textColor={"#FFFFFF"}
            onClick={() => handleGenreSearch(button.text)}
            borderColor={"#669bff"}
            bgColor={"#110057"}
            buttonBgColor={"#110057"}
            width={"100%"}
            height={"3rem"}
            className={"mt-12"}
          />
        ))}
      </ul>
      <div>&nbsp;</div>
    </div>
  );
};

export default Genre;
