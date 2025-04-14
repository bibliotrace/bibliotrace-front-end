import React from "react";
import { X } from "lucide-react";
import BarButton from "../components/BarButtons";
import { useNavigate } from "react-router-dom";
const PullOutBarGenre = ({ onClose, buttons, side, titleText, uniformColor, buttonWidth, buttonHeight}) => {
  const navigate = useNavigate(); 

  const handleSearch = (filterInput) => {
    console.log("Whats in the filter: ", filterInput);
    console.log("What is the titleText:", titleText)
    const filterBody = { Audiences: [], Genres: [], Special: [] }
    if (titleText === 'Explore By Genre') {
      filterBody.Genres.push(filterInput)
    } else {
      filterBody.Audiences.push(filterInput)
    }
    navigate("/search", { state: { initFilterInput: filterBody }});
  };

  return (
    <div className={`fixed right-0 inset-0 z-5 flex items-center justify-${side === "left" ? 'start' : 'end'} backdrop-blur-sm`} onClick={onClose}>
      {/* PullOutBar Container */}
      <div
        className={`top-${side === "left" ? "30 left-0" : "30 right-0"} h-auto md:w-1/4 bg-white 
                  ${side === "left" ? "rounded-tr-3xl rounded-br-3xl" : "rounded-tl-3xl rounded-bl-3xl"}
                  z-40 transition-transform translate-x-0`}
        style={{ borderColor: uniformColor, borderWidth: "4px" }}
      > 
        {/* Header with Close Icon */}
        <div className="flex items-center justify-between p-2 bg-orange-500 text-white">
          <button className="bg-white " onClick={onClose}>
            <X size={30} strokeWidth={4} style={{ color: uniformColor}}/>
          </button>
          <h2 className="text-xl font-bold" style={{ color: uniformColor}}>{titleText}</h2>
          
        </div>
        <div className="overflow-y-auto max-h-[calc(80vh-50px)] p-2 no-scrollbar">
          <ul>
          {buttons.map((button, index) => (
              <BarButton
                key={index}
                text={button.text}
                textColor={button.textColor || "#110057"}
                onClick={() => handleSearch(button.text)}
                borderColor={uniformColor}
                bgColor={button.bgColor || "#FFFFFF"}
                buttonBgColor = {"#FFFFFF"}
                width = {'100%'}
                height= {buttonHeight}
                className={'m-1'}
              />
            ))}
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default PullOutBarGenre;
