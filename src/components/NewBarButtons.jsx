function NewBarButton({
  text, 
  onClick, 
  className, 
  buttonBgColor, 
  width,
  height,
}) {
    return (
      <button
        className={`py-4 px-6
                    transition-transform hover:scale-105 rounded-2xl ${className}`}
        onClick={onClick}
        style={{ 
          background: buttonBgColor ,
          width: width, 
          height: height, 
          textAlign: 'center',
        }}
      >
        {text}
      </button>
    );
  }
   
  export default NewBarButton;
  