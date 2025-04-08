import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function FilterBox({ onClose, prevSelectedItems = { Audiences: [], Genres: [] } }) {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState({ Audiences: [], Genres: [] });
  const [audienceList, setAudienceList] = useState([]);
  const [genreList, setGenreList] = useState([]);

  const handleSubmit = () => {
    console.log("on submit pressed");
    onClose(selectedItems); // Pass selected filters back to parent
  };

  const handleToggleSelection = (category, text) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedCategory = prevSelectedItems[category] || [];

      return {
        ...prevSelectedItems,
        [category]: updatedCategory.includes(text)
          ? updatedCategory.filter((item) => item !== text)
          : [...updatedCategory, text],
      };
    });
  };

  const fetchGenres = () => {
    const genresDelimited = Cookies.get("genreList");
    const genresListSplit = genresDelimited.split(",");

    setGenreList(genresListSplit);
  };

  const fetchAudiences = () => {
    const audiencesDelimited = Cookies.get("audienceList");
    const audiencesListSplit = audiencesDelimited.split(",");

    setAudienceList(audiencesListSplit);
  };

  const categories = [
    {
      title: "Genres",
      items: genreList,
    },
    {
      title: "Audiences",
      items: audienceList,
    },
  ];

  useEffect(() => {
    setSelectedItems(prevSelectedItems); // Set initial preselected items on mount
    fetchAudiences();
    fetchGenres();
  }, [prevSelectedItems]);

  return (
    <div className="relative p-6 border-4 border-darkBlue backdrop-blur-3xl bg-opacity-100 bg-gray-900 rounded-xl">
      <div className="grid grid-cols-2 gap-6">
        {categories.map((category, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            <h2 className="text-xl text-darkBlue font-bold mb-2">{category.title}</h2>
            {category.items.map((text, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-6 w-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={selectedItems[category.title]?.includes(text)}
                  onChange={() => handleToggleSelection(category.title, text)}
                />
                <span className="text-darkBlue text-sm md:text-xl">{text}</span>
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="absolute right-4 bottom-4 border-4 border-darkBlue text-darkBlue px-6 py-3 rounded-2xl"
      >
        Apply
      </button>
    </div>
  );
}
