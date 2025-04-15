import NewBarButton from "../NewBarButtons.jsx";
export default function Sidebar({onMenuChange, activeButton, setActiveButton}) {
  //handle routes
  const handleButtonClick = (menu, buttonText) =>{
    setActiveButton(buttonText);
    if(menu){
      onMenuChange(menu);
    }
  }
  
  const buttons = [
    { text: "Manage Inventory", menu: "inventory" },
    { text: "Settings", menu: "settings" },
    { text: "Reports", menu: "report" },
  ];

  return (
    <div className="flex flex-col justify-center pl-[3vw] pr-5 gap-4  w-[20vw]">

      {buttons.map((button, index) => (
        <NewBarButton
          key={index}
          text={button.text}
          onClick={() => handleButtonClick(button.menu, button.text)}
          className={`transition-colors duration-300
            ${
              activeButton === button.text
                ? "bg-darkBlue text-white" // Active style
                : "bg-white text-darkBlue border-4 border-darkBlue" // Default style
            }`}
        />
      ))}
    </div>
  );
}