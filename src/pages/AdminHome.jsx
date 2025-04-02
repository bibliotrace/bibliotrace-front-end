// This page will mainly be the landing page for the Admin portal. It will be a shell with the navbar, search bar,
// and navigation buttons on the right hand side. The inner portion will be filled by the following list of components:
// Home, ManageInventory, Settings, Help, and Reports. These components are stored in the ../components/admin folder.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../components/admin/AdminNavBar.jsx";
import AdminMainMenu from "../components/admin/AdminMainMenu.jsx";
import AdminSideBar from "../components/admin/AdminSideBar.jsx";
import AdminManageMenu from "../components/admin/AdminManageMenu.jsx";

export default function AdminHome({}) {
  const [activeMenu, setActiveMenu] = useState("main"); //for the component
  const [activeButton, setActiveButton] = useState(null); //for side bar highlighting
  const navigate = useNavigate();
  //handle routes
  const handleTestClick = () => {
    console.log("Button pressed");
  };

  const handleAddBookNav = () => {
    navigate("/add-scanned");
  };

  const handleRemoveBookNav = () => {
    navigate("/remove-book");
  };

  const handleSetLocation = () => {
    navigate("/set-location");
  };
  const handleCreateUser = () => {
    navigate("/create-user");
  };

  const handleManageLocations = () => {
    navigate("/manage-locations");
  };

  const handleEditBookNav = () => {
    navigate("/edit-book");
  }

  //reports
  const handleShoppingList = () => {
    navigate("/shopping-list");
  };
  const handleRestockList = () => {
    navigate("/restock-list");
  };


  //buttons
  const settingButtons = [
    {
      text: "Manage Profile",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleTestClick,
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Manage Locations",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleManageLocations,
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Create New Profile",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleCreateUser,
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Feature 2",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleTestClick,
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Create New Database",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleTestClick,
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Feature 3",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleTestClick,
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Manage Database",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleTestClick,
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Feature 4",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleTestClick,
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
      onClick: handleAddBookNav,
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
      onClick: handleRemoveBookNav,
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
      onClick: handleEditBookNav,
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Set Locations",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleSetLocation,
      width: "20vw",
      height: "10vh",
    },
    // {
    //   text: "Add Title",
    //   textColor: "white",
    //   bgColor: "#110057",
    //   borderColor: "white",
    //   buttonBgColor: "#110057",
    //   onClick: handleTestClick,
    //   width: "20vw",
    //   height: "10vh",
    // },
    // {
    //   text: "Generate QR Codes",
    //   textColor: "white",
    //   bgColor: "#110057",
    //   borderColor: "white",
    //   buttonBgColor: "#110057",
    //   onClick: handleTestClick,
    //   width: "20vw",
    //   height: "10vh",
    // },
  ];

  const ReportButtons = [
    {
      text: "Shopping List",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleShoppingList,
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Audit",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleTestClick,
      width: "20vw",
      height: "10vh",
    },
    {
      text: "Restock List",
      textColor: "white",
      bgColor: "#110057",
      borderColor: "white",
      buttonBgColor: "#110057",
      onClick: handleRestockList,
      width: "20vw",
      height: "10vh",
    },
  ];

  return (
    <div className={`size-full pb-5 flex flex-col items-center`}>
      <svg
        className="-z-10 absolute left-0 top-0"
        width="100vw"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="fill-darkBlue "
          d="
            M0,40
            C12.5,38 25,40 37.5,42
            C50,44 62.5,42 75,40
            C87.5,38 93,39 100,40
            L100,0
            L0,0
            Z"
          transform="rotate(270, 50, 50) scale(1, 2)"
        />
      </svg>
      <AdminNavBar
        onMenuChange={setActiveMenu}
        setActiveButton={setActiveButton}
        useDarkTheme={true}
        showTitle={false}
        bgColor={"#FFFFFF"}
        textColor={"#110057"}
        resetActiveButton={() => setActiveButton(null)}
      />
      <div className="pt-32">
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
            <AdminManageMenu menuButtons={ReportButtons} title="Reports" />
          </>
        ) : null}
      </div>
      <AdminSideBar onMenuChange={setActiveMenu} activeButton={activeButton} setActiveButton={setActiveButton} />
    </div>
  );
}
