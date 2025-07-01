import { useNavigate } from "react-router-dom";
import IhLogo from "../assets/ih-color.svg?react";
import IhLogoDark from "../assets/ih-dark.svg?react";
import HomeLogo from "../assets/home-white.svg?react";
import HomeLogoDark from "../assets/home-black.svg?react";
import LogoutLogo from "../assets/logout-white.svg?react";
import LogoutLogoDark from "../assets/logout-black.svg?react";
import Cookies from "js-cookie";
import AdminHomeState from "../components/admin/AdminHomeState.js";

const NavBar = ({ useDarkTheme, showTitle, textColor, showNavButtons = true, onHomeClick, back = false }) => {
  const navigate = useNavigate();

  const jwtDataString = Cookies.get("jwtData");
  let isAdmin = false;
  if (jwtDataString != null) {
    const jwtDataObject = JSON.parse(jwtDataString);
    isAdmin = jwtDataObject.userRole.roleType === "Admin";
  }

  const navigateHome = () => {
    //console.log("Home Button was pressed");
    if (onHomeClick) {
      onHomeClick();
    }
    else {
      if (isAdmin) {
        AdminHomeState.clearActiveMenu();
        AdminHomeState.clearActiveButton();
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  };
  const navigateLogOut = () => {
    Object.keys(Cookies.get()).forEach((item) => {
      Cookies.remove(item);
    });
    navigate("/login", { state: { loginType: "User Login" } });
  };

  let title;
  if (showTitle) {
    title = (
      <h1 className="hidden h-16 absolute top-0 right-0 left-0 md:flex text-center md:text-3xl items-center justify-center p-2 pointer-events-none">
        BiblioTrace 3.0
      </h1>
    );
  }
  //TODO change the LOGO so that it isnt the dark theme or not and its actually a logo that we pass in or this wont work
  const Logo = useDarkTheme ? IhLogoDark : IhLogo;
  const Home = useDarkTheme ? HomeLogoDark : HomeLogo;
  const Logout = useDarkTheme ? LogoutLogoDark : LogoutLogo;

  let onBack = () => navigate(-1);

  return (
    <div className="flex flex-row w-full items-center justify-between px-4 print:hidden" style={{ color: textColor }}>
      <div className="flex items-center">
        {back ? (
          <div className="hover:cursor-pointer flex flex-row justify-center items-center" onClick={onBack}>
            <span className="text-3xl relative font-bold">&#8592;</span>
            <span className="text-lg p-2">Back</span>
          </div>
        ) : (
          <Logo className="h-12 md:h-16 w-24 md:w-48 bg-transparent" onClick={navigateHome} />
        )}
        <span>{title}</span>
      </div>
      {showNavButtons && (
        <div className="flex items-center mt-2 md:mt-0">
          <button
            style={{ backgroundColor: "transparent", color: textColor }}
            className="flex flex-col justify-center items-center"
            onClick={navigateHome}
          >
            <Home />
            <p>Home</p>
          </button>

          <button
            style={{ backgroundColor: "transparent", color: textColor }}
            className="flex flex-col justify-center items-center"
            onClick={navigateLogOut}
          >
            <Logout />
            <p>Logout</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
