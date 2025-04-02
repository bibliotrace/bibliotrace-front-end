import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExploreByAge from "../assets/ExploreByAge.jpg";
import ExploreByGenre from "../assets/ExploreByGenre.jpg";
import NewArrivalsIcon from "../assets/NewArrivalsIcon.jpg";
import SuggestBook from "../assets/SuggestBook.jpg";
import WhatsPopular from "../assets/WhatsPopular.jpg";
import CustomButton from "../components/ButtonComponent";
import NavBar from "../components/NavBar";
import PopUpBar from "../modals/PopUpSideBar";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isBlurred, setIsBlurred] = useState(false);
  const [showPopupBarAge, setShowPopupBarAge] = useState(false);
  const [showPopupBarGenre, setShowPopupBarGenre] = useState(false);
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

  const agesListString = Cookies.get("audienceList");
  let ages = [];
  if (agesListString) {
    const agesList = agesListString.split(",");
    ages = agesList.map((age) => {
      return { text: age };
    });
  }

  //handle routes
  const handleSearch = () => {
    console.log("HOME.jsx searchInput: ", searchInput);
    navigate("/search", { state: { initSearchInput: searchInput } });
  };

  const handleSuggestBookNav = () => {
    navigate("/suggest");
  };

  const handleExploreByAge = () => {
    setShowPopupBarAge(!showPopupBarAge);
  };

  const handleExploreByAgeMobile = () => {
    navigate("/age");
  };

  const handleExploreByGenre = () => {
    setShowPopupBarGenre(!showPopupBarGenre);
  };

  const handleExploreByGenreMobile = () => {
    navigate("/genre");
  };

  const handlePopular = (filterInput) => {
    navigate("/search", {
      state: { initFilterInput: { Audiences: [], Genres: [], Special: ["Popular"] } },
    });
  };

  const handleNewest = (filterInput) => {
    navigate("/search", {
      state: { initFilterInput: { Audiences: [], Genres: [], Special: ["Newest"] } },
    });
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
    <div className={`h-full w-full pb-5 start-bg flex flex-col items-center ${isBlurred ? "blur-sm" : ""}`}>
      <NavBar useDarkTheme={false} showTitle={false} bgColor={"#110057"} textColor={"#FFFFFF"} />
      <h1 className="mt-16 text-5xl text-white">Bibliotrace 3.0</h1>
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

      <div className="flex md:flex-row flex-col">
        {/* website buttons */}
        <CustomButton
          imageSrc={WhatsPopular}
          text={"What's\nPopular"}
          textColor="#FFFFFF"
          onClick={handlePopular}
          borderColor="#ff50df"
          bgColor="#110057"
          className=" hidden md:flex"
          imageWidth="12em"
          imageHeight="12rem"
          textWidth="12rem"
          textHeight="6rem"
          textSize="1.5rem"
        />

        <CustomButton
          imageSrc={ExploreByAge}
          text={"Explore By\nAge"}
          textColor="#FFFFFF"
          onClick={handleExploreByAge}
          borderColor="#fa8804"
          bgColor="#110057"
          className="mt-24 hidden md:flex"
          imageWidth="12rem"
          imageHeight="12rem"
          textWidth="12rem"
          textHeight="6rem"
          textSize="1.5rem"
        />
        {/* {showPulloutBar && <PullOutBar onClose={() => {setShowPulloutBar(false); }} />} */}
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

        <CustomButton
          imageSrc={NewArrivalsIcon}
          text={"New\nArrivals"}
          textColor="#FFFFFF"
          onClick={handleNewest}
          borderColor="#FFD700"
          bgColor="#110057"
          className=" hidden md:flex"
          imageWidth="12em"
          imageHeight="12rem"
          textWidth="12rem"
          textHeight="6rem"
          textSize="1.5rem"
        />

        <CustomButton
          imageSrc={ExploreByGenre}
          text={"Explore By\nGenre"}
          textColor="#FFFFFF"
          onClick={handleExploreByGenre}
          borderColor="#669bff"
          bgColor="#110057"
          className="mt-24 hidden md:flex"
          imageWidth="12em"
          imageHeight="12rem"
          textWidth="12rem"
          textHeight="6rem"
          textSize="1.5rem"
        />
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

        <CustomButton
          imageSrc={SuggestBook}
          text={"Suggest a\nBook"}
          textColor="#FFFFFF"
          onClick={handleSuggestBookNav}
          borderColor="#e12502"
          bgColor="#110057"
          className=" hidden md:flex"
          imageWidth="12em"
          imageHeight="12rem"
          textWidth="12rem"
          textHeight="6rem"
          textSize="1.5rem"
        />

        {/* Mobile buttons */}
        <CustomButton
          imageSrc={WhatsPopular}
          text={"What's Popular"}
          textColor="#FFFFFF"
          onClick={handlePopular}
          borderColor="#ff50df"
          bgColor="#110057"
          className="md:hidden"
          layout="row"
          imageWidth="6em"
          imageHeight="6rem"
          textWidth="12rem"
          textHeight="3rem"
          textSize="1rem"
        />

        <CustomButton
          imageSrc={NewArrivalsIcon}
          text={"New Arrivals"}
          textColor="#FFFFFF"
          onClick={handleNewest}
          borderColor="#FFD700"
          bgColor="#110057"
          className="md:hidden"
          layout="row"
          imageWidth="6em"
          imageHeight="6rem"
          textWidth="12rem"
          textHeight="3rem"
          textSize="1rem"
        />

        <CustomButton
          imageSrc={ExploreByGenre}
          text={"Explore By Genre"}
          textColor="#FFFFFF"
          onClick={handleExploreByGenreMobile}
          borderColor="#669bff"
          bgColor="#110057"
          className="md:hidden"
          layout="row"
          imageWidth="6rem"
          imageHeight="6rem"
          textWidth="12rem"
          textHeight="3rem"
          textSize="1rem"
        />

        <CustomButton
          imageSrc={ExploreByAge}
          text={"Explore By Age"}
          textColor="#FFFFFF"
          onClick={handleExploreByAgeMobile}
          borderColor="#fa8804"
          bgColor="#110057"
          className="md:hidden"
          layout="row"
          imageWidth="6rem"
          imageHeight="6rem"
          textWidth="12rem"
          textHeight="3rem"
          textSize="1rem"
        />

        <CustomButton
          imageSrc={SuggestBook}
          text={"Suggest a Book"}
          textColor="#FFFFFF"
          onClick={handleSuggestBookNav}
          borderColor="#e12502"
          bgColor="#110057"
          className="md:hidden"
          layout="row"
          imageWidth="6em"
          imageHeight="6rem"
          textWidth="12rem"
          textHeight="3rem"
          textSize="1rem"
        />
      </div>
    </div>
  );
};

export default Home;
