function CustomButton({
  imageSrc,
  text,
  textColor,
  onClick,
  borderColor,
  bgColor,
  className,
  layout = "col",
  imageWidth = "6rem",
  imageHeight = "6rem",
  textHeight = "3rem",
  textSize = "1rem",
}) {
  return (
    <button
      className={`flex ${layout === "col" ? "flex-col" : "flex-row"}
                    items-center justify-center  
                    transition-transform duration-200 hover:scale-105 w-full ${className}`}
      onClick={onClick}
      style={{ backgroundColor: "transparent" }}
    >
      {/* Container for image */}
      <div
        className={`flex-shrink-0 ${layout === "col" ? "mb-4" : "mr-4"}`}
        style={{ width: imageWidth, height: imageHeight }}
      >
        <img src={imageSrc} alt={text} className="w-full h-full object-cover" />
      </div>

      {/* Container for text */}
      <div
        className="border-4 rounded-lg flex items-center justify-center font-bold"
        style={{
          borderColor: borderColor,
          background: bgColor,
          color: textColor,
          whiteSpace: "pre-wrap",
          width: '100%',
          height: textHeight,
          fontSize: textSize,
        }}
      >
        {text}
      </div>
    </button>
  );
}

export default CustomButton;
