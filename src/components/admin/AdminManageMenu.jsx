import { useNavigate } from "react-router-dom";
import BarButton from "../BarButtons";
import React, { useState } from "react";

export default function AdminMainMenu({ menuButtons, title }) {
  return (
    <div className="flex-1 w-full m-auto p-2 px-[10%] max-w-6xl items-center justify-center flex flex-col">
      <h1 className="text-white pb-10 text-center">{title}</h1>
      <div className="grid grid-cols-2 w-fit gap-x-8 justify-center">
        {menuButtons.map((button, index) => (
          <BarButton
            key={index}
            text={button.text}
            textColor={button.textColor}
            onClick={button.onClick}
            borderColor={button.borderColor}
            bgColor={button.bgColor}
            buttonBgColor={button.buttonBgColor}
            width={button.width}
            height={button.height}
          />
        ))}
      </div>
    </div>
  );
}
