//Icons
import PeachColorIcon from "../../assets/CheckInIcon.jpg";
import OrangeIcon from "../../assets/ExploreByAge.jpg";
import BlueIcon from "../../assets/ExploreByGenre.jpg";
import YellowIcon from "../../assets/NewArrivalsIcon.jpg";
import RedIcon from "../../assets/SuggestBook.jpg";
import PinkIcon from "../../assets/WhatsPopular.jpg";
import PurpleIcon from "../../assets/checkoutIcon.jpg";
//Libraries
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PopUpBar from "../../modals/PopUpSideBar";
import CustomButton from "../ButtonComponent";
import { openSuggestForm } from "../../pages/suggest";


export default function MainMenu() {
  const navigate = useNavigate();
  const [showPopupBarAge, setShowPopupBarAge] = useState(false);
  const [showPopupBarGenre, setShowPopupBarGenre] = useState(false);
  const [ages, setAges] = useState([]);
  const [genres, setGenres] = useState([]);

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

  const menuItems = [
    {
      label: "Check In",
      imageSrc: PeachColorIcon,
      onclick: () => navigate("/checkin"),
      borderColor: "#fbb7a4",
      textWidth: "35rem",
    },
    {
      label: "Suggest a Book",
      imageSrc: RedIcon,
      onclick: () => {
        //navigate("/suggest");
        openSuggestForm();
      },
      borderColor: "#e12502",
      textWidth: "35rem",
    },
    {
      label: "Popular",
      imageSrc: PinkIcon,
      onclick: handlePopular,
      borderColor: "#ff50df",
      textWidth: "35rem",
    },
    {
      label: "New Arrivals",
      imageSrc: YellowIcon,
      onclick: handleNewest,
      borderColor: "#FFD700",
      textWidth: "35rem",
    },
    {
      label: "By Age",
      imageSrc: OrangeIcon,
      onclick: () => setShowPopupBarAge(!showPopupBarAge),
      borderColor: "#fa8804",
      textWidth: "35rem",
    },
    {
      label: "By Genre",
      imageSrc: BlueIcon,
      onclick: () => setShowPopupBarGenre(!showPopupBarGenre),
      borderColor: "#669bff",
      textWidth: "35rem",
    },
  ];

  useEffect(() => {
    const genreListString = Cookies.get("genreList");
    if (genreListString) {
      const genreList = genreListString.split(",");
      setGenres((oldList) => {
        return genreList.map((genre) => {
          return { text: genre };
        });
      });
    }

    const agesListString = Cookies.get("audienceList");
    if (agesListString) {
      const agesList = agesListString.split(",");
      setAges((oldList) => {
        return agesList.map((age) => {
          return { text: age };
        });
      });
    }
  }, [])

  return (
    <div className="flex-1 w-full m-auto p-2 px-[10%] justify-center flex flex-col">
      <CustomButton
        imageSrc={PurpleIcon}
        text="Check Out"
        textColor="#FFFFFF" //same
        onClick={() => navigate("/checkout")}
        borderColor="#4b00e3"
        bgColor="#110057" //same
        layout="row" //same
        textSize="1.25rem"
      />
      <div className="grid grid-cols-2 justify-start">
        {menuItems.map((item, index) => (
          <CustomButton
            key={index}
            imageSrc={item.imageSrc}
            text={item.label}
            textColor="#FFFFFF"
            onClick={item.onclick}
            borderColor={item.borderColor}
            bgColor="#110057"
            layout="row"
            textSize="1.25rem"
          />
        ))}
      </div>
      {/* Conditionally Render PullOutBarGenre */}
      {showPopupBarAge && (
        <PopUpBar
          onClose={() => setShowPopupBarAge(false)}
          buttons={ages}
          side={"right"}
          uniformColor={"#fa8804"}
          titleText={"Explore By Age"}
          buttonWidth={"14vw"}
          buttonHeight={"4rem"}
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
          buttonHeight={"4rem"}
        />
      )}
    </div>
  );
}
