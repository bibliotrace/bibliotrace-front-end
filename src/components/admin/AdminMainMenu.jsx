//Icons 
import OrangeIcon from "../../assets/ExploreByAge.jpg";
import BlueIcon from "../../assets/ExploreByGenre.jpg";
import YellowIcon from "../../assets/NewArrivalsIcon.jpg";
import RedIcon from "../../assets/SuggestBook.jpg";
import PinkIcon from "../../assets/WhatsPopular.jpg";
import PurpleIcon from "../../assets/checkoutIcon.jpg";
import PeachColorIcon from "../../assets/CheckInIcon.jpg";
//Libraries 
import { useNavigate } from "react-router-dom";
import CustomButton from "../ButtonComponent";
import React, { useState} from "react"
import PopUpBar from "../../modals/PopUpSideBar";
import Cookies from 'js-cookie';

const genreListString = Cookies.get('genreList')
let genres = []
if (genreListString) {
  const genreList = genreListString.split(',')
  genres = genreList.map((genre) => {return {text: genre}})
}


const agesListString = Cookies.get('audienceList')
let ages= []
if (agesListString) {
  const agesList = agesListString.split(",")
  ages = agesList.map((age) => {return {text: age}})
}

export default function MainMenu() {
  const navigate = useNavigate(); 
  const [isBlurred, setIsBlurred] = useState(false);
  const [showPopupBarAge, setShowPopupBarAge] = useState(false);
  const [showPopupBarGenre, setShowPopupBarGenre] = useState(false);

  const handleTestClick = () => {
    console.log('Button pressed');
  };

  const handleSuggestBookNav = () => {
    navigate("/suggest");
  };

  const handleExploreByAge = () => {
    setShowPopupBarAge(!showPopupBarAge)
  };

  const handleExploreByGenre = () => {
    setShowPopupBarGenre(!showPopupBarGenre)
  };
  
  const handlePopular = (filterInput) => {
    navigate("/search", { state: { initFilterInput: { Audiences: [], Genres: [], Special: ["Popular"] } }});
  };

  const handleNewest = (filterInput) => {
    navigate("/search", { state: { initFilterInput: { Audiences: [], Genres: [], Special: ["Newest"] } }});
  };

  const menuItems = [
    { label: 'Check In', imageSrc: PeachColorIcon, onclick: handleTestClick, borderColor: "#fbb7a4", textWidth: '35rem'},
    { label: 'Suggest A Book', imageSrc: RedIcon, onclick: handleSuggestBookNav, borderColor: "#4b00e3", textWidth: '35rem'},
    { label: 'Popular', imageSrc: PinkIcon, onclick: handlePopular, borderColor: "#ff50df", textWidth: '35rem'},
    { label: 'New Arrivals', imageSrc: YellowIcon, onclick: handleNewest, borderColor: "#FFD700", textWidth: '35rem'},
    { label: 'By Age', imageSrc: OrangeIcon, onclick: handleExploreByAge, borderColor: "#fa8804", textWidth: '35rem'},
    { label: 'By Genre', imageSrc: BlueIcon, onclick: handleExploreByGenre, borderColor: "#669bff", textWidth: '35rem'},
  ];

    
  return (
    <div className="absolute left-0 top-auto z-10">
      <CustomButton
          imageSrc={PurpleIcon}
          text="CHECK OUT"
          textColor="#FFFFFF" //same 
          onClick={handleTestClick}
          borderColor="#4b00e3" 
          bgColor="#110057"//same
          layout='row'//same
          textWidth= '42vw'
          
          textSize="1.25rem"
    />
      <div className="grid grid-cols-2 w-2/3 justify-start">
        {menuItems.map((item, index) => (
          <CustomButton
            key={index}
            imageSrc={item.imageSrc}
            text={item.label}
            textColor="#FFFFFF"
            onClick={item.onclick}
            borderColor={item.borderColor} 
            bgColor="#110057"
            layout='row'
            textWidth={item.textWidth}
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
            buttonWidth={'14vw'}
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
            buttonWidth={'14vw'}
            buttonHeight={"8vh"}
          />
        )}
    </div>
    
  );
}