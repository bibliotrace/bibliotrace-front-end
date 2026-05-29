import Cookies from "js-cookie";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import readingBook from "../assets/reading-book.svg";
import userOptions from "../assets/user-options.svg";
import NavBar from "../components/NavBar";
import PopUpBar from "../modals/PopUpSideBar";
import { openSuggestForm } from "./suggest";

// Percentage-based sprite values so the icon scales with its container.
// Derived from source SVG: 1466x439 viewBox, 92x92 icon cells at y=210, x=[136.6, 411.8, 687, 962.2, 1237.4].
const ICON_POSITIONS_X_PCT = [9.94, 29.97, 49.99, 70.01, 90.04];
const ICON_POSITION_Y_PCT = 60.53;

function iconSpriteStyle(index) {
  return {
    backgroundImage: `url(${userOptions})`,
    backgroundSize: "1593.5% 477.2%",
    backgroundPosition: `${ICON_POSITIONS_X_PCT[index]}% ${ICON_POSITION_Y_PCT}%`,
    backgroundRepeat: "no-repeat",
  };
}

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [showPopupBarAge, setShowPopupBarAge] = useState(false);
  const [showPopupBarGenre, setShowPopupBarGenre] = useState(false);
  const navigate = useNavigate();

  const genreListString = Cookies.get("genreList");
  let genres = [];
  if (genreListString) {
    const genreList = genreListString.split(",");
    genres = genreList.map((genre) => ({ text: genre }));
  }

  const agesListString = Cookies.get("audienceList");
  let ages = [];
  if (agesListString) {
    const agesList = agesListString.split(",");
    ages = agesList.map((age) => ({ text: age }));
  }

  const handleSearch = () => {
    navigate("/search", { state: { initSearchInput: searchInput } });
  };

  const handleSuggestBookNav = () => {
    openSuggestForm();
  };

  const handleExploreByAge = () => {
    setShowPopupBarAge(!showPopupBarAge);
  };

  const handleExploreByGenre = () => {
    setShowPopupBarGenre(!showPopupBarGenre);
  };

  const handlePopular = () => {
    navigate("/search", {
      state: { initFilterInput: { Audiences: [], Genres: [], Special: ["Popular"] } },
    });
  };

  const handleNewest = () => {
    navigate("/search", {
      state: { initFilterInput: { Audiences: [], Genres: [], Special: ["Newest"] } },
    });
  };

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

  const cards = [
    { label: "What's Popular", onClick: handlePopular },
    { label: "Explore by Age", onClick: handleExploreByAge },
    { label: "New Arrivals", onClick: handleNewest },
    { label: "Explore by Genre", onClick: handleExploreByGenre },
    { label: "Suggest a Book", onClick: handleSuggestBookNav },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <NavBar useDarkTheme={true} showTitle={false} bgColor={"white"} textColor={"#110057"} />

      {/* Hero */}
      <div className="w-full max-w-6xl mx-auto px-6 mt-4 short:mt-2">
        <img
          src={readingBook}
          alt="Mother and daughter reading together"
          className="block mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl short:max-w-[20rem] aspect-[1920/900] object-cover rounded-lg"
        />
        <div className="mt-3 sm:mt-4 short:mt-2 text-center text-[#110057]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl short:text-2xl font-serif font-bold">
            Bibliotrace
          </h1>
          <p className="mt-1 text-sm sm:text-base short:text-xs">Search our library by...</p>
        </div>
      </div>

      {/* Search */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 mt-5 sm:mt-8 short:mt-3">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9c7ad6] pointer-events-none"
          />
          <input
            type="text"
            placeholder="title, author, or genre"
            value={searchInput}
            onInput={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 pr-6 py-3 sm:py-4 short:py-2 border-2 border-[#9c7ad6] rounded-full text-[#110057] placeholder-[#9c7ad6] focus:outline-none focus:border-[#110057]"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 mt-5 sm:mt-7 md:mt-8 short:mt-3 mb-16 short:mb-4">
        <div className="flex flex-nowrap justify-center gap-1.5 sm:gap-3 md:gap-5 short:gap-2">
          {cards.map((card, index) => (
            <button
              key={card.label}
              onClick={card.onClick}
              className="flex flex-col items-center justify-center w-[18%] sm:w-32 md:w-40 lg:w-44 short:w-24 aspect-[5/6] sm:aspect-auto sm:h-36 md:h-44 lg:h-48 short:h-28 short:aspect-auto bg-white rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] short:rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition-shadow px-1.5 py-2 sm:px-3 sm:py-4 md:px-4 md:py-6 short:px-2 short:py-2"
            >
              <div
                className="rounded-full overflow-hidden w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 short:w-12 short:h-12"
                style={iconSpriteStyle(index)}
              />
              <span className="mt-1 sm:mt-2 md:mt-3 lg:mt-4 short:mt-1 text-[0.55rem] sm:text-[0.7rem] md:text-xs lg:text-sm short:text-[0.65rem] font-bold text-[#4A00E2] text-center leading-tight">
                {card.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {showPopupBarAge && (
        <PopUpBar
          onClose={() => setShowPopupBarAge(false)}
          buttons={ages}
          side={"left"}
          uniformColor={"#fa8804"}
          titleText={"Explore By Age"}
          buttonWidth={"14vw"}
          buttonHeight={"10vh"}
        />
      )}
      {showPopupBarGenre && (
        <PopUpBar
          onClose={() => setShowPopupBarGenre(false)}
          buttons={genres}
          side={"right"}
          uniformColor={"#669bff"}
          titleText={"Explore By Genre"}
          buttonWidth={"14vw"}
          buttonHeight={"8vh"}
        />
      )}

      <p className="mt-auto px-6 pb-4 text-xs text-gray-500">
        Copyright &copy;2026, Intermountain Health, all rights reserved.
      </p>
    </div>
  );
};

export default Home;
