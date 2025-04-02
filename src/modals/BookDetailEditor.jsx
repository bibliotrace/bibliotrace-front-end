// This is the modal that shows all of the details for a particular book. The details shown will differ depending on if we're in an Admin page or not.
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ErrorModal from "../modals/ErrorModal.jsx";

export default function BookDetailEditor({ bookData, onExit, colorScheme }) {
  const allGenresList = Cookies.get("genreList");
  const allAudiencesList = Cookies.get("audienceList");
  const allTagsList = Cookies.get("tagList");
  const jwt = Cookies.get("authToken");

  const [synopsis, setSynopsis] = useState("");
  const [title, setTitle] = useState(bookData.title);
  const [author, setAuthor] = useState(bookData.author);
  const [isbn, setIsbn] = useState(bookData.isbn);
  const [primaryGenre, setPrimaryGenre] = useState(bookData.primaryGenre);
  const [secondaryGenres, setSecondaryGenres] = useState(bookData.secondaryGenres);
  const [targetSecondaryGenre, setTargetSecondaryGenre] = useState("");
  const [audience, setAudience] = useState(bookData.audience);
  const [pages, setPages] = useState(bookData.pages);
  const [seriesName, setSeriesName] = useState(bookData.series_name);
  const [seriesNumber, setSeriesNumber] = useState(bookData.series_number);
  const [publishDate, setPublishDate] = useState(bookData.publishDate);
  const [language, setLanguage] = useState(bookData.language ?? "English");
  const [genres, setGenres] = useState(allGenresList ?? ["No Genres Found"]);
  const [audiences, setAudiences] = useState(allAudiencesList ?? ["No Audiences Found"]);
  const [tags, setTags] = useState(bookData.tag_list ?? []);
  const [tagOptions, setTagOptions] = useState(allTagsList ?? ["No Tags Found"]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSuggestionCall = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

    if (result.ok) {
      setErrorMessage((await result.json()).message);
      setShowMessage(true);
    }

    console.log(result);
  };

  const handleAddGenre = async (e) => {
    e.preventDefault();
    const fetchBody = {
      genre: targetSecondaryGenre,
    };
    console.log(fetchBody);
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
      setTargetSecondaryGenre("");
    }
  };

  const handleRemoveSecondaryGenre = async (e, index) => {
    e.preventDefault();
    const fetchBody = {
      genre: secondaryGenres[index],
    };
    console.log(fetchBody);
    const result = await fetch(`http://localhost:8080/api/bookdata/genre-list/${isbn.split("|")[0]}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify(fetchBody),
    });

    if (result.ok) {
      setSecondaryGenres(secondaryGenres.filter((_, i) => i !== index));
    }
  };

  const handleAddTag = async (e, newTag) => {
    e.preventDefault();
    const fetchBody = {
      tag: newTag,
    };
    console.log(fetchBody);
    const result = await fetch(`http://localhost:8080/api/bookdata/tag-list/${isbn.split("|")[0]}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(fetchBody),
    });

    if (result.ok) {
      setTags([...tags, newTag]);
      setTagSearchTerm("");
    }
  };

  const handleRemoveTag = async (e, index) => {
    e.preventDefault();
    const fetchBody = {
      tag: tags[index],
    };
    const result = await fetch(`http://localhost:8080/api/bookdata/tag-list/${isbn.split("|")[0]}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify(fetchBody),
    });

    if (result.ok) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const packageExit = async (e) => {
    onExit({
      book_title: title,
      author,
      pages,
      publish_date: publishDate,
      short_description: synopsis,
      audience_name: audience,
      primary_genre_name: primaryGenre,
      series_name: seriesName,
      series_number: seriesNumber,
      tag_list: tags,
      genre_list: secondaryGenres,
    });
  };

  useEffect(() => {
    const initializeData = async () => {
      await installGlobalMetadata();
      await installExistingBookData();
      console.log(tagOptions);
    };

    initializeData();
  }, []);

  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [tagSearchResults, setTagSearchResults] = useState([]);

  useEffect(() => {
    let results = tagOptions.filter((item) => item.toLowerCase().includes(tagSearchTerm.toLowerCase()));
    results = results.filter((item) => !tags.includes(item));
    setTagSearchResults(results);
  }, [tagSearchTerm, tagOptions]);

  const handleTagSearch = (event) => {
    setTagSearchTerm(event.target.value);
  };

  const handleTagAdd = () => {
    if (tagSearchTerm && !tagOptions.includes(tagSearchTerm)) {
      fetch("http://localhost:8080/api/inventory/tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          tag_name: tagSearchTerm,
        }),
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setShowMessage(true);
            setTagOptions([...tagOptions, tagSearchTerm]);
            setTags([...tags, tagSearchTerm]);
            setErrorMessage(data.message);
          });
        } else {
          setErrorMessage(`Tag Add was Unsuccessful`);
        }
      });

      setTagSearchTerm("");
    }
  };

  return (
    <AnimatePresence>
      {
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={packageExit}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-4/6 max-w-5xl relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex justify-end items-center pl-4 pr-4 pt-2 pb-2 bg-${colorScheme} rounded-t-lg`}
            >
              <h2 className="flex-1 text-center text-black text-lg font-semibold">{title}</h2>
              <button className="text-gray-600" onClick={packageExit}>
                Back
              </button>
            </div>
            <div className="flex flex-wrap justify-between">
              <div className="p-6 flex-1 flex-col flex max-h-[90vh] overflow-y-auto">
                <div className="flex text-xl items-center">
                  <h6 className="font-bold pr-2">ISBN: </h6>
                  <input
                    className="flex-1 mr-2 p-1 bg-[#f5f5f5] rounded-xl"
                    value={isbn}
                    placeholder="978123456789"
                    onChange={(e) => setIsbn(e.target.value)}
                  />
                  <button type="button" className="text-sm" onClick={(e) => handleSuggestionCall(e)}>
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
                    value={seriesNumber === 0 ? "" : seriesNumber}
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
                <div className="flex items-center text-xl pt-4 flex-wrap gap-2">
                  <h6 className="font-bold pr-2">Secondary Genres:</h6>
                  {secondaryGenres.map((genre, index) => {
                    return (
                      <button
                        role="button"
                        className={`bg-${colorScheme} px-4 py-1 m-2 rounded-3xl text-black font-normal text-center text-nowrap`}
                        onClick={(e) => handleRemoveSecondaryGenre(e, index)}
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
                    <button
                      className="p-2 ml-2 text-nowrap text-base"
                      onClick={(e) => handleAddGenre(e)}
                      role="button"
                    >
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
                <div className="flex text-xl pt-4 items-center flex-wrap gap-1">
                  <h6 className="font-bold pr-2">Tags:</h6>
                  {tags.map((tag, index) => {
                    return (
                      <button
                        role="button"
                        className={`bg-${colorScheme} px-4 py-1 m-2 rounded-3xl text-black font-normal text-center text-nowrap`}
                        onClick={(e) => handleRemoveTag(e, index)}
                      >
                        {tag}
                      </button>
                    );
                  })}
                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex space-x-2">
                      <input
                        className="bg-[#f5f5f5] rounded-xl p-3 w-80"
                        type="text"
                        placeholder="Search..."
                        value={tagSearchTerm}
                        onChange={handleTagSearch}
                      />
                      <button onClick={handleTagAdd}>Add</button>
                    </div>
                    {tagSearchTerm && (
                      <ul className="bg-[#f5f5f5] rounded-xl max-h-60 overflow-auto">
                        {tagSearchResults.map((item, index) => (
                          <li key={index} className="px-4 py-2 hover:bg-gray-100">
                            <button className="bg-white w-full" onClick={(e) => handleAddTag(e, item)}>
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2 mt-1">Synopsis:</h6>
                  <textarea
                    className="w-full p-2 text-base h-32"
                    value={synopsis}
                    placeholder="A basic description"
                    onChange={(e) => setSynopsis(e.target.value)}
                  />
                </div>

                <br></br>

                <button onClick={(e) => handleFormSubmit(e)}>Submit Changes</button>
              </div>
            </div>
            {showMessage && (
              <ErrorModal description={errorMessage} onExit={() => setShowMessage(!showMessage)} />
            )}
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  );
}
