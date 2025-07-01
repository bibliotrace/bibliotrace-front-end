import NavBar from "../NavBar.jsx";

const AdminNavBar = ({ handleHomeClick, useDarkTheme, showTitle, bgColor, textColor }) => {
  return (
    <div className="w-full z-50">
      {/* Navigation Icon and Title */}
      <div className="">
        <NavBar
          useDarkTheme={useDarkTheme}
          showTitle={showTitle}
          bgColor={bgColor}
          textColor={textColor}
          onHomeClick={handleHomeClick}
        />
      </div>
    </div>
  );
};

export default AdminNavBar;
