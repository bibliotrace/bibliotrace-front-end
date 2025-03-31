// This is the modal that shows all of the details for a particular book. The details shown will differ depending on if we're in an Admin page or not.
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import AddIcon from "../assets/add.svg?react";
import EditIcon from "../assets/edit.svg?react";

export default function BookDetailEditor({ bookData, onExit }) {
  const [synopsis, setSynopsis] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [primaryGenre, setPrimaryGenre] = useState("");
  const [secondaryGenres, setSecondaryGenres] = useState([]);
  const [targetSecondaryGenre, setTargetSecondaryGenre] = useState("");
  const [audience, setAudience] = useState("");
  const [pages, setPages] = useState("");
  const [seriesName, setSeriesName] = useState("");
  const [seriesNumber, setSeriesNumber] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [language, setLanguage] = useState("");
  const [imgCallback, setImgCallback] = useState("");
  const [genres, setGenres] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [targetTag, setTargetTag] = useState('');

  console.log(bookData);

  const installExistingBookData = async () => {
    setTitle(bookData.title);
    setAuthor(bookData.author);
    setIsbn(bookData.isbn);
    setSynopsis(bookData.synopsis);
    setPrimaryGenre(bookData.primaryGenre);
    setSecondaryGenres(bookData.secondaryGenres);
    setAudience(bookData.audience);
    setPages(bookData.pages);
    setSeriesName(bookData.series_name);
    setSeriesNumber(bookData.series_number);
    setAudience(bookData.audience);
    setPublishDate(bookData.publishDate);
    setTags(bookData.tag_list);
    setLanguage(bookData.language);
    setImgCallback(bookData.img_callback);
  };

  const installGlobalMetadata = async () => {
    const allGenresList = Cookies.get("genreList");
    const allAudiencesList = Cookies.get("audienceList");
    const jwt = Cookies.get("authToken");
    const fetchResponse = fetch(`http://localhost:8080/api/inventory/tag`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    let allTagsList;
    if (fetchResponse.ok) {
      const jsonData = await fetchResponse.json();
      allTagsList = jsonData.object.map((tagItem) => {
        return tagItem.tag_name;
      });
      Cookies.set('tagList', allTagsList)
      setTagOptions(allTagsList);
      console.log(allTagsList)
    } else {
      console.error(fetchResponse)
    }

    setGenres(allGenresList.split(","));
    setAudiences(allAudiencesList.split(","));
  };

  const handleSuggestionCall = async (e) => {
    e.preventDefault();
    const jwt = Cookies.get("authToken");
    const response = await fetch(`http://localhost:8080/api/bookdata/suggest/${isbn.split("||")[0]}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const bookData = data.object;
      setTitle(bookData.book_title);
      setAuthor(bookData.author);
      setImgCallback(bookData.img_callback);
      setIsbn(bookData.isbn_list);
      setLanguage(bookData.language);
      setPages(bookData.pages);
      setPublishDate(bookData.publish_date);
      setSynopsis(bookData.short_description);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const fetchBody = {
      book_title: title,
      isbn_list: isbn,
      author: author,
      primary_genre_name: primaryGenre,
      audience_name: audience,
      pages,
      series_name: seriesName,
      series_number: seriesNumber,
      publish_date: publishDate,
      short_description: synopsis,
      language,
    };
    console.log(fetchBody);
    const jwt = Cookies.get("authToken");
    const result = await fetch(`http://localhost:8080/api/bookdata/${isbn.split("|")[0]}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(fetchBody),
    });

    console.log(result);
  };

  const handleAddGenre = async (e) => {
    e.preventDefault();
    const fetchBody = {
      genre: targetSecondaryGenre,
    };
    console.log(fetchBody);
    const jwt = Cookies.get("authToken");
    const result = await fetch(`http://localhost:8080/api/bookdata/genre-list/${isbn.split("|")[0]}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(fetchBody),
    });

    if (result.ok) {
      setSecondaryGenres([...secondaryGenres, targetSecondaryGenre]);
    }
    console.log(secondaryGenres);
  };

  useEffect(() => {
    if (isbn) {
      handleSuggestionCall();
    }
  }, [isbn]);

  useEffect(() => {
    installGlobalMetadata();
    installExistingBookData();
  }, []);

  return (
    <AnimatePresence>
      {
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onExit}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-4/6 max-w-5xl relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end items-center pl-4 pr-4 pt-2 pb-2 bg-lightBlue rounded-t-lg">
              <h2 className="flex-1 text-center text-white text-lg font-semibold">{title}</h2>
              <button className="text-gray-600" onClick={onExit}>
                Back
              </button>
            </div>
            <div className="flex flex-wrap justify-between">
              <form className="p-6 flex-1 flex-col flex max-h-[90vh] overflow-y-auto" onSubmit={(e) => handleFormSubmit(e)}>
                <div className="flex text-xl items-center">
                  <h6 className="font-bold pr-2">ISBN: </h6>
                  <input
                    className="flex-1 mr-2 p-1 bg-[#f5f5f5] rounded-xl"
                    value={isbn}
                    placeholder="978123456789"
                    onChange={(e) => setIsbn(e.target.value)}
                  />
                  <button className="text-sm" onClick={(e) => handleSuggestionCall(e)}>
                    Pull Data From ISBNdb
                  </button>
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2">Title: </h6>
                  <input
                    className="flex-1 p-1 bg-[#f5f5f5] rounded-xl"
                    value={title}
                    placeholder="e.g. The Great Gatsby"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2">Author:</h6>
                  <input
                    className="flex-1 p-1 bg-[#f5f5f5] rounded-xl"
                    value={author}
                    placeholder="e.g. Herman Melville"
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2">Series Name:</h6>
                  <input
                    className="flex-1 p-1 bg-[#f5f5f5] rounded-xl"
                    value={seriesName}
                    placeHolder="e.g. Harry Potter"
                    onChange={(e) => setSeriesName(e.target.value)}
                  />
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2">Number In Series:</h6>
                  <input
                    className="flex-1 p-1 bg-[#f5f5f5] rounded-xl"
                    value={seriesNumber}
                    placeHolder="e.g. 1"
                    onChange={(e) => setSeriesNumber(e.target.value)}
                  />
                </div>
                <div className="flex items-center text-xl pt-4">
                  <h6 className="font-bold pr-2">Primary Genre:</h6>
                  <select
                    className=" mx-2 p-2 rounded-xl"
                    value={primaryGenre}
                    onChange={(e) => setPrimaryGenre(e.target.value)}
                  >
                    <option value="" disabled>
                      -- Choose an option --
                    </option>
                    {genres.map((genre) => {
                      return <option value={genre}>{genre}</option>;
                    })}
                  </select>
                </div>
                <div className="flex items-center text-xl pt-4 flex-wrap">
                  <h6 className="font-bold pr-2">Secondary Genres:</h6>
                  {secondaryGenres.map((genre) => {
                    return (
                      <button
                        className="bg-lightBlue px-4 py-1 m-2 rounded-3xl text-white font-normal text-center text-nowrap"
                        onClick={(e) => e.preventDefault()}
                      >
                        {genre}
                      </button>
                    );
                  })}
                  <form onSubmit={(e) => handleAddGenre(e)}>
                    <select
                      className=" mx-2 p-2 rounded-xl"
                      value={targetSecondaryGenre}
                      onChange={(e) => setTargetSecondaryGenre(e.target.value)}
                    >
                      <option value="" disabled>
                        -- Choose an option --
                      </option>
                      {genres.map((genre) => {
                        return <option value={genre}>{genre}</option>;
                      })}
                    </select>
                    <button className="p-2 ml-2 text-nowrap text-base" onClick={(e) => handleAddGenre(e)}>
                      Add Genre
                    </button>
                  </form>
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2">Audience:</h6>
                  <select
                    className=" mx-2 p-2 rounded-xl"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  >
                    <option value="" disabled>
                      -- Choose an option --
                    </option>
                    {audiences.map((audience) => {
                      return <option value={audience}>{audience}</option>;
                    })}
                  </select>{" "}
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2">Page Count:</h6>
                  <input
                    className="flex-1 p-1 bg-[#f5f5f5] rounded-xl"
                    value={pages}
                    placeHolder="e.g. 1"
                    onChange={(e) => setPages(e.target.value)}
                  />
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2">Published:</h6>
                  <input
                    className="flex-1 p-1 bg-[#f5f5f5] rounded-xl"
                    value={publishDate}
                    placeHolder="e.g. 1975"
                    onChange={(e) => setPublishDate(e.target.value)}
                    onSubmit={(e) => e.preventDefault()}
                  />
                </div>
                <div className="flex text-xl pt-4 items-center flex-wrap">
                  <h6 className="font-bold pr-2">Tags:</h6>
                  {tags.map((tag, index) => {
                    return (
                      <button
                        className="bg-lightBlue px-4 py-1 m-2 rounded-3xl text-white font-normal text-center text-nowrap"
                        onClick={(e) => e.preventDefault()}
                      >
                        {tag}
                      </button>
                    );
                  })}
                  <form onSubmit={(e) => handleAddTag(e)}>
                    <select
                      className=" mx-2 p-2 rounded-xl"
                      value={targetTag}
                      onChange={(e) => setTargetTag(e.target.value)}
                    >
                      <option value="" disabled>
                        -- Choose an option --
                      </option>
                      {tagOptions.map((option) => {
                        return <option key={option} value={option}>{option}</option>;
                      })}
                    </select>
                    <button className="p-2 ml-2 text-nowrap text-base" onClick={(e) => handleAddTag(e)}>
                      Add Tag
                    </button>
                  </form>
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2 mt-1">Synopsis:</h6>
                  <textarea
                    className="w-full p-2 text-base"
                    value={synopsis}
                    placeholder="A basic description"
                    onChange={(e) => setSynopsis(e.target.value)}
                  />
                </div>

                <br></br>

                <button>Submit Changes</button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  );
}
