// This page will mainly be the landing page for the Admin portal. It will be a shell with the navbar, search bar,
// and navigation buttons on the right hand side. The inner portion will be filled by the following list of components:
// Home, ManageInventory, Settings, Help, and Reports. These components are stored in the ../components/admin folder.
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminNavBar from "../components/admin/AdminNavBar.jsx";
import AdminMainMenu from "../components/admin/AdminMainMenu.jsx";
import AdminSideBar from "../components/admin/AdminSideBar.jsx";
import AdminManageMenu from "../components/admin/AdminManageMenu.jsx";
import AdminMenuState from "../components/admin/AdminHomeState.js";
import ScreenSizeChecker from "../components/admin/ScreenSizeChecker.jsx";

export default function AdminHome({ }) {
  const location = useLocation();
  const navigate = useNavigate();

  let localStorageActiveMenu = AdminMenuState.getActiveMenu();
  let localStorageActiveButton = AdminMenuState.getActiveButton();

  const [activeMenu, setActiveMenu] = useState(localStorageActiveMenu ?? "main"); //for the component
  const [activeButton, setActiveButton] = useState(localStorageActiveButton ?? null); //for side bar highlighting
  const [searchInput, setSearchInput] = useState("");

  let setAndStoreActiveMenu = (menu) => {
    setActiveMenu(menu);
    AdminMenuState.setActiveMenu(menu);
  };

  let setAndStoreActiveButton = (button) => {
    setActiveButton(button);
    AdminMenuState.setActiveButton(button);
  };

  const handleSearch = () => {
    //console.log("HOME.jsx searchInput: ", searchInput);
    if (searchInput != null && searchInput != "") {
      navigate("/search", { state: { initSearchInput: searchInput } });
    }
  };

  const settingButtons = [
    // {
    //   text: "Manage Profile",
    //   textColor: "white",
    //   bgColor: "#110057",
    //   borderColor: "white",
    //   buttonBgColor: "#110057",
    //   onClick: handleTestClick,
    //   width: "20vw",
    //   height: "10vh",
    // },
    {
      text: "Manage Locations",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/manage-locations"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Create New User",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/create-user"),
      width: "20vw",
      height: "10vh",
    },
  ];

  const inventoryButtons = [
    {
      text: "Add Books",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/add-scanned"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Audit",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/audit"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Remove Books",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/remove-book"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Edit Genres and Tags",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/edit-genres-tags"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Edit Books",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/edit-book"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Set Locations",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/set-location"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Update Backlog Books",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/backlog-update-book"),
      width: "20vw",
      height: "10vh",
    },
  ];

  const reportButtons = [
    {
      text: "Shopping List",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/shopping-list"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Restock List",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/restock-list"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Popular Report",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/popular"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Audit Reports",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/audit-list"),
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Stock Report",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: () => navigate("/stock"),
      width: "20vw",
      height: "10vh",
    },
  ];

  const handleHomeClick = () => {
    // We are already on the admin home page, so we don't need to navigate.
    // We just need to force a re-render.
    setAndStoreActiveMenu("main");
    setAndStoreActiveButton(null);
    //navigate("/admin");
  }

  return (
    <div className="min-h-screen w-screen pb-5 flex flex-col relative overflow-hidden">
      {/* <ScreenSizeChecker /> */}
      <svg
        className="-z-10 absolute left-0 top-0"
        width="100vw"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="fill-darkBlue"
          d="
            M0,41
            C15,40 26,41 37,42
            C50,43 62,42 72,41
            C84,40 96,41 100,41.5
            L100,0
            L0,0
            Z"
          transform="rotate(270, 50, 50) scale(1, 2)"
        />
      </svg>
      <AdminNavBar
        handleHomeClick={handleHomeClick}
        useDarkTheme={true}
        showTitle={false}
        bgColor={"#FFFFFF"}
        textColor={"#110057"}
      />

      <div className="flex-1 flex gap-5 w-full justify-center mb-10">
        <div className="flex flex-col w-full">
          {/* Search Bar */}
          <div className="mt-6 px-14 flex flex-col justify-start">
            {/* Header */}
            <h1 className="text-white text-center pb-4">Bibliotrace 3.0</h1>

            {/* Search Bar & Button */}
            <div className="flex items-center w-full m-auto px-[10%]">
              <input
                className="px-4 py-2 w-full border-2 rounded-2xl placeholder:font-bold text-lg"
                type="text"
                placeholder="Search"
                value={searchInput}
                onInput={(e) => setSearchInput(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <button
                className="ml-2 border-[#110057]  border-2 bg-white  rounded-2xl font-bold text-[#a49bc6]"
                onClick={handleSearch}
              >
                Go!
              </button>
            </div>
          </div>
          {activeMenu === "main" ? (
            <AdminMainMenu />
          ) : activeMenu === "settings" ? (
            <>
              <AdminManageMenu menuButtons={settingButtons} title="Settings" />
            </>
          ) : activeMenu === "inventory" ? (
            <>
              <AdminManageMenu menuButtons={inventoryButtons} title="Manage Inventory" />
            </>
          ) : activeMenu === "report" ? (
            <>
              <AdminManageMenu menuButtons={reportButtons} title="Reports" />
            </>
          ) : null}
        </div>
        <AdminSideBar onMenuChange={setAndStoreActiveMenu} activeButton={activeButton} setActiveButton={setAndStoreActiveButton} />
      </div>
    </div>
  );
}
