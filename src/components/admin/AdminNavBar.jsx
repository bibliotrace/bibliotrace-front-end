import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar.jsx";
const AdminNavBar = ({ onMenuChange, setActiveButton, useDarkTheme, showTitle, bgColor, textColor }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    onMenuChange("main"); // Update the menu
    if (setActiveButton) {
      setActiveButton(null);
    }
    navigate("/admin"); // Navigate to admin home
  };

  return (
    <div className="w-full z-50">
      {/* Navigation Icon and Title */}
      <div className="">
        <NavBar
          useDarkTheme={useDarkTheme}
          showTitle={showTitle}
          bgColor={bgColor}
          textColor={textColor}
          homeNavOnClick="/admin"
          onHomeClick={handleHomeClick}
        />
      </div>
    </div>
  );
};

export default AdminNavBar;
