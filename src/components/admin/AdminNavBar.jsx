import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar.jsx";
const AdminNavBar = ({ onMenuChange, setActiveButton, useDarkTheme, showTitle, bgColor, textColor }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    console.log("HOME.jsx searchInput: ", searchInput);
    navigate("/search", { state: { initSearchInput: searchInput } });
  };

  const handleHomeClick = () => {
    onMenuChange("main"); // Update the menu
    if (setActiveButton) {
      setActiveButton(null);
    }
    navigate("/admin"); // Navigate to admin home
  };

  //event
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full bg-[#FFFFFFF] h-32">
      {/* Navigation Icon and Title */}
      <div className="flex items-center space-x-4">
        <NavBar
          useDarkTheme={useDarkTheme}
          showTitle={showTitle}
          bgColor={bgColor}
          textColor={textColor}
          homeNavOnClick="/admin"
          onHomeClick={handleHomeClick}
        />
      </div>

      {/* Search Bar */}
      <div className="mt-6 flex flex-col w-1/2 justify-start">
        {/* Header */}
        <h1 className="text-5xl xl:text-4xl lg:text-3xl sm:text-2xl text-white xl:ml-80 lg:ml-60 sm:ml-10">
          Bibliotrace 3.0
        </h1>

        {/* Search Bar & Button */}
        <div className="flex items-center m-2 ml-32 w-10/12 max-w-4xl">
          <input
            className="px-4 py-3 flex-grow border-2 border-[#ff78e6] rounded-2xl placeholder-[#ff78e6] placeholder:font-bold text-lg"
            type="text"
            placeholder="Search"
            value={searchInput}
            onInput={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="ml-2 px-4 py-2 border-[#110057]  border-2 hover:border-[#ff78e6] bg-white  rounded-2xl font-bold text-[#a49bc6] hover:text-[#ff78e6]"
            onClick={handleSearch}
          >
            Go!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavBar;
