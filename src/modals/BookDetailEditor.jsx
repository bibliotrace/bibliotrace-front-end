// This is the modal that shows all of the details for a particular book. The details shown will differ depending on if we're in an Admin page or not.
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ErrorModal from "../modals/ErrorModal.jsx";

export default function BookDetailEditor({ mode, bookData, onExit, colorScheme }) {
  const allGenresList = Cookies.get("genreList");
  const allAudiencesList = Cookies.get("audienceList");
  const allTagsList = Cookies.get("tagList");
  const jwt = Cookies.get("authToken");

  const [synopsis, setSynopsis] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [primaryGenre, setPrimaryGenre] = useState("");
  const [secondaryGenres, setSecondaryGenres] = useState([]);
  const [targetSecondaryGenre, setTargetSecondaryGenre] = useState("");
  const [audience, setAudience] = useState("");
  const [pages, setPages] = useState();
  const [seriesName, setSeriesName] = useState();
  const [seriesNumber, setSeriesNumber] = useState();
  const [publishDate, setPublishDate] = useState();
  const [language, setLanguage] = useState();
  const [genres, setGenres] = useState(allGenresList.split(",") ?? ["No Genres Found"]);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [audiences, setAudiences] = useState(allAudiencesList.split(",") ?? ["No Audiences Found"]);
  const [tags, setTags] = useState(bookData.tag_list ?? []);
  const [tagOptions, setTagOptions] = useState(allTagsList.split(",") ?? ["No Tags Found"]);
  const [messageString, setMessageString] = useState("");

  useEffect(() => {
    console.log("change in bookData!", bookData);

    setSynopsis(bookData.synopsis ?? "");
    setTitle(bookData.title ?? "");
    setAuthor(bookData.author ?? "");
    setIsbn(bookData.isbn ?? "");
    setPrimaryGenre(bookData.primaryGenre ?? "");
    const newAvailableGenresList = genres.filter((val) => val != bookData.primaryGenre);
    setAvailableGenres(newAvailableGenresList);
    setSecondaryGenres(bookData.secondaryGenres ?? []);
    setTargetSecondaryGenre("");
    setAudience(bookData.audience ?? "");
    setPages(bookData.pages ?? "");
    setSeriesName(bookData.series_name ?? "");
    setSeriesNumber(bookData.series_number ?? "");
    setPublishDate(bookData.publishDate ?? "");
    setLanguage(bookData.language ?? "English");

    if (!bookData.title) {
      handleSuggestionCall(null, bookData.isbn);
    }
  }, [bookData]);

  const handlePrimaryGenreChange = (e) => {
    setPrimaryGenre(e.target.value);
    const newAvailableGenresList = genres.filter((val) => val != e.target.value);
    console.log(newAvailableGenresList);
    setAvailableGenres(newAvailableGenresList);
  };

  const handleSuggestionCall = async (e, isbnSeed) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const jwt = Cookies.get("authToken");
    const isbnValue = isbnSeed ?? isbn.split("||")[0];
    const response = await fetch(`http://localhost:8080/api/bookdata/suggest/${isbnValue}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const bookData = data.object;
      setTitle(bookData.book_title);
      setAuthor(bookData.author);
      setLanguage(bookData.language);
      setPages(bookData.pages);
      setPublishDate(bookData.publish_date);
      setSynopsis(bookData.short_description);
    }
  };

  const handleBookFormSubmit = async (e) => {
    e.preventDefault();
    const fetchBody = {
      book_title: title,
      isbn_list: isbn,
      author: author,
      primary_genre_name: primaryGenre,
      audience_name: audience,
      pages,
      series_name: seriesName,
      series_number: seriesNumber != "" ? seriesNumber : 0,
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

    if (!result.ok) {
      setMessageString(`Error Submitting: ${(await result.json()).message}`);
      return;
    }

    if (mode === "add") {
      for (const genre of secondaryGenres) {
        const result = await callAddSecondaryGenre(genre);
        if (!result.ok) {
          setMessageString(`Error Adding Secondary Genre: ${(await result.json()).message}`);
          return;
        }
      }

      for (const tag of tags) {
        const result = await callAddTag(tag);
        if (!result.ok) {
          setMessageString(`Error Adding Tag: ${(await result.json()).message}`);
          return;
        }
      }
    }

    packageExit((await result.json()).message);
  };

  const handleAddSecondaryGenre = async (e) => {
    e.preventDefault();
    if (mode === "edit") {
      const result = await callAddSecondaryGenre(targetSecondaryGenre);
      if (result.ok) {
        setSecondaryGenres([...secondaryGenres, targetSecondaryGenre]);
        setTargetSecondaryGenre("");
      } else {
        setMessageString(`Error Adding Secondary Genre: ${(await result.json()).message}`);
      }
    }
    else if (mode === "add") {
      if (targetSecondaryGenre && !secondaryGenres.includes(targetSecondaryGenre)) {
        setSecondaryGenres([...secondaryGenres, targetSecondaryGenre]);
        setTargetSecondaryGenre("");
      } else {
        setMessageString("Error Adding Secondary Genre");
      }
    }
  };

  const callAddSecondaryGenre = async (genre) => {
    const fetchBody = {
      genre,
    };
    console.log(fetchBody);
    const result = await fetch(
      `http://localhost:8080/api/bookdata/genre-list/${isbn.split("|")[0]}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(fetchBody),
      }
    );
    return result;
  }

  const handleRemoveSecondaryGenre = async (e, index) => {
    e.preventDefault();
    if (mode === "edit") {
      const fetchBody = {
        genre: secondaryGenres[index],
      };
      console.log(fetchBody);
      const result = await fetch(
        `http://localhost:8080/api/bookdata/genre-list/${isbn.split("|")[0]}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          method: "DELETE",
          body: JSON.stringify(fetchBody),
        }
      );

      if (result.ok) {
        setSecondaryGenres(secondaryGenres.filter((_, i) => i !== index));
      } else {
        setMessageString(`Error Removing Secondary Genre: ${(await result.json()).message}`);
      }
    }
    else if (mode == "add") {
      setSecondaryGenres(secondaryGenres.filter((_, i) => i !== index));
    }
  };

  const handleAddTag = async (e, newTag) => {
    e?.preventDefault();
    if (mode === "edit") {
      const result = await callAddTag(newTag);
      if (result.ok) {
        setTags([...tags, newTag]);
        setTagSearchTerm("");
      } else {
        setMessageString(`Error Adding Tag: ${(await result.json()).message}`);
      }
    }
    else if (mode === "add") {
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagSearchTerm("");
      } else {
        setMessageString("Error Adding Tag");
      }
    }
  };

  const callAddTag = async (tag) => {
    const fetchBody = {
      tag,
    };
    console.log(fetchBody);
    const result = await fetch(
      `http://localhost:8080/api/bookdata/tag-list/${isbn.split("|")[0]}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(fetchBody),
      }
    );
    return result;
  }

  const handleRemoveTag = async (e, index) => {
    e?.preventDefault();
    if (mode === "edit") {
      const fetchBody = {
        tag: tags[index],
      };
      const result = await fetch(
        `http://localhost:8080/api/bookdata/tag-list/${isbn.split("|")[0]}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          method: "DELETE",
          body: JSON.stringify(fetchBody),
        }
      );

      if (result.ok) {
        setTags(tags.filter((_, i) => i !== index));
      } else {
        setMessageString(`Error Removing Tag: ${(await result.json()).message}`);
      }
    }
    else if (mode === "add") {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const packageExit = async (exitMessage) => {
    setSynopsis("");
    setTitle("");
    setAuthor("");
    setIsbn("");
    setPrimaryGenre("");
    setSecondaryGenres([]);
    onExit({
      exitMessage,
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

  // The code below is the search algorithm for the tag search bar
  // If the searchTerm in lowercase is in any string in the tagOptions, that tagOptions is returned in the results var
  // We also check if the result item is already in the book's tag list to remove duplication
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [tagSearchResults, setTagSearchResults] = useState([]);

  useEffect(() => {
    let results = tagOptions.filter((item) =>
      item.toLowerCase().includes(tagSearchTerm.toLowerCase())
    );
    results = results.filter((item) => !tags.includes(item));
    setTagSearchResults(results);
  }, [tagSearchTerm, tagOptions]);

  const handleAddNewTag = () => {
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
        response.json().then((data) => {
          if (response.ok) {
            const newTagOptions = [...tagOptions, tagSearchTerm];
            Cookies.set("tagList", newTagOptions.join(","));
            setTagOptions([...tagOptions, tagSearchTerm]);

            handleAddTag(null, tagSearchTerm);
            setMessageString(data.message);
          } else {
            setMessageString(`Tag Add was Unsuccessful: ${data.message}`);
          }
        });
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
          onClick={() => packageExit()}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg md:w-5/6 lg:w-4/6 max-w-5xl relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex justify-end items-center pl-4 pr-4 pt-2 pb-2 bg-${colorScheme} rounded-t-lg`}
            >
              <h2 className="flex-1 text-center text-black text-lg font-semibold">{title}</h2>
              <button className="text-gray-600" onClick={() => packageExit()}>
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
                  <button
                    type="button"
                    className="text-sm"
                    onClick={(e) => handleSuggestionCall(e)}
                  >
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
                    placeholder="e.g. Harry Potter"
                    onChange={(e) => setSeriesName(e.target.value)}
                  />
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2">Number In Series:</h6>
                  <input
                    className="flex-1 p-1 bg-[#f5f5f5] rounded-xl"
                    value={seriesNumber === 0 ? "" : seriesNumber}
                    placeholder="e.g. 1"
                    onChange={(e) => setSeriesNumber(e.target.value)}
                  />
                </div>
                <div className="flex items-center text-xl pt-4">
                  <h6 className="font-bold pr-2">Primary Genre:</h6>
                  <select
                    className=" mx-2 p-2 rounded-xl"
                    value={primaryGenre}
                    onChange={(e) => handlePrimaryGenreChange(e)}
                  >
                    <option value="" disabled>
                      -- Choose an option --
                    </option>
                    {genres.map((genre) => {
                      return (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      );
                    })}
                  </select>
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
                      return (
                        <option key={audience} value={audience}>
                          {audience}
                        </option>
                      );
                    })}
                  </select>{" "}
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2">Page Count:</h6>
                  <input
                    className="flex-1 p-1 bg-[#f5f5f5] rounded-xl"
                    value={pages}
                    placeholder="e.g. 1"
                    onChange={(e) => setPages(e.target.value)}
                  />
                </div>
                <div className="flex text-xl pt-4">
                  <h6 className="font-bold pr-2">Published:</h6>
                  <input
                    className="flex-1 p-1 bg-[#f5f5f5] rounded-xl"
                    value={publishDate}
                    placeholder="e.g. 1975"
                    onChange={(e) => setPublishDate(e.target.value)}
                    onSubmit={(e) => e.preventDefault()}
                  />
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
                <div className="flex items-center text-xl pt-4 flex-wrap gap-2">
                  <h6 className="font-bold pr-2">Secondary Genres:</h6>
                  {secondaryGenres.map((genre, index) => {
                    return (
                      <button
                        key={`${genre}${index}`}
                        role="button"
                        className={`bg-${colorScheme} px-4 py-1 m-2 rounded-3xl text-black font-normal text-center text-nowrap`}
                        onClick={(e) => handleRemoveSecondaryGenre(e, index)}
                      >
                        {genre}
                      </button>
                    );
                  })}
                  <form onSubmit={(e) => handleAddSecondaryGenre(e)}>
                    <select
                      className=" mx-2 p-2 rounded-xl h-12"
                      value={targetSecondaryGenre}
                      onChange={(e) => setTargetSecondaryGenre(e.target.value)}
                    >
                      <option value="" disabled>
                        -- Choose an option --
                      </option>
                      {availableGenres.map((genre) => {
                        return (
                          <option key={genre} value={genre}>
                            {genre}
                          </option>
                        );
                      })}
                    </select>
                    <button
                      className="p-2 ml-2 h-12 text-nowrap text-base"
                      onClick={(e) => handleAddSecondaryGenre(e)}
                      role="button"
                    >
                      Add Genre
                    </button>
                  </form>
                </div>
                <div className="flex text-xl pt-4 items-center flex-wrap gap-1">
                  <h6 className="font-bold pr-2">Tags:</h6>
                  {tags.map((tag, index) => {
                    return (
                      <button
                        key={`${tag}${index}`}
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
                        className="bg-[#f5f5f5] rounded-xl p-3 w-80 h-12"
                        type="text"
                        placeholder="Search..."
                        value={tagSearchTerm}
                        onChange={(event) => setTagSearchTerm(event.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (tagSearchResults.includes(tagSearchTerm)) {
                              handleAddTag(e, tagSearchTerm);
                            } else {
                              handleAddNewTag(e, tagSearchTerm);
                            }
                          }
                        }}
                      />
                      <button role="button" className="h-12 text-base" onClick={handleAddNewTag}>
                        Add
                      </button>
                    </div>
                    {tagSearchTerm && (
                      <ul className="bg-[#f5f5f5] rounded-xl max-h-60 overflow-auto">
                        {tagSearchResults.map((item, index) => (
                          <li key={index} className="px-4 py-2 hover:bg-gray-100">
                            <button
                              className="bg-white w-full"
                              onClick={(e) => handleAddTag(e, item)}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <br></br>

                <button onClick={(e) => handleBookFormSubmit(e)}>Submit Changes</button>
              </div>
            </div>
            {messageString && (
              <ErrorModal description={messageString} onExit={() => setMessageString("")} />
            )}
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  );
}
