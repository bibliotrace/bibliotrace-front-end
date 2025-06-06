import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ErrorModal from "../modals/ErrorModal.jsx";
import tailwindConfig from "../../tailwind.config";

export default function ManageGenresTags() {
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setGenres(Cookies.get("genreList")?.split(",") ?? []);
    setTags(Cookies.get("tagList")?.split(",") ?? []);
  }, []);

  async function handleAddGenre(e) {
    //fetch call to add genreToAdd
    setMessage("");
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const genreToAdd = formData.get("genre_name");

      if (!genreToAdd) {
        return;
      }

      const response = await fetch("http://localhost:8080/api/inventory/genre", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({ genre_name: genreToAdd }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(`${data.message}`);
        console.log(data.message);
      } else {
        let newGenres = [...genres, genreToAdd].sort();
        setGenres(newGenres);
        let genreList = newGenres.join(",");
        Cookies.set("genreList", genreList);
        e.target.reset();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleRemoveGenre(genre) {
    //fetch call to remove genre
    setMessage("");
    try {
      const response = await fetch("http://localhost:8080/api/inventory/genre", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({ genre_name: genre }),
      });

      const data = await response.json();
      setMessage(`${data.message}`);
      if (!response.ok) {
        console.log(data.message);
      } else {
        let newGenres = genres.filter((g) => g !== genre);
        setGenres(newGenres);
        let genreList = newGenres.join(",");
        Cookies.set("genreList", genreList);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleAddTag(e) {
    //fetch call to add tagToAdd
    e.preventDefault();
    setMessage("");
    try {
      const formData = new FormData(e.target);
      const tagToAdd = formData.get("tag_name");

      if (!tagToAdd) {
        return;
      }

      const response = await fetch("http://localhost:8080/api/inventory/tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({ tag_name: tagToAdd }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("tag: ", tagToAdd);
        setMessage(`${data.message}`);
        console.log(data.message);
      } else {
        let newTags = [...tags, tagToAdd].sort();
        setTags(newTags);
        let tagList = newTags.join(",");
        Cookies.set("tagList", tagList);
        e.target.reset();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleRemoveTag(tag) {
    //fetch call to remove tag
    setMessage("");
    try {
      const response = await fetch("http://localhost:8080/api/inventory/tag", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({ tag_name: tag }),
      });

      const data = await response.json();
      setMessage(`${data.message}`);
      if (!response.ok) {
        console.log(data.message);
      } else {
        let newTags = tags.filter((t) => t !== tag);
        setTags(newTags);
        let tagList = newTags.join(",");
        Cookies.set("tagList", tagList);
      }
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <>
      <svg
        className="-z-10 absolute left-0 top-0"
        width="100vw"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="fill-lightBlue"
          d="
            M-0.5,12
            C7,10 12,14 17,16
            C22,18 27,14 32,12
            C37,10 42,14 47,16
            C52,18 57,14 62,12
            C67,10 72,14 77,16
            C82,18 87,14 92,12
            C97,10 102,14 107,16
            C110,17.5 114,16 117,14
            C120,12 124,10 127,11
            L132,11
            L132,0
            L0,0
            Z"
          transform="rotate(0, 50, 50) scale(1, 1.75)"
        />
      </svg>

      <NavBar
        useDarkTheme={true}
        showTitle={true}
        bgColor={tailwindConfig.theme.colors.lightBlue}
        textColor={tailwindConfig.theme.colors.black}
        showNavButtons={true}
        back={true}
      />

      <h1 className="text-center my-10">Edit Genres and Tags</h1>

      {message ? (
        <ErrorModal
          id="error-modal"
          tabIndex="-1"
          description={message.includes("successfully") ? "Success" : "Error modifying genres/tags"}
          message={message}
          onExit={() => {
            setMessage(null);
          }}
        />
      ) : null}

      <div className="flex flex-row mt-40 justify-between w-full h-[calc(100vh-200px)]">
        <section id="genres-container" className="flex-1 w-full h-full mx-[5%] ml-[10%]">
          <ul
            className="border h-[70%] overflow-y-scroll"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddGenre(e);
              }
            }}
          >
            {genres.map((genre) => {
              return (
                <>
                  <li
                    key={genre}
                    className="flex flex-row flex-nowrap justify-between my-5 mx-10 text-lg items-center"
                  >
                    <p>{genre}</p>
                    <button onClick={() => handleRemoveGenre(genre)}>Remove</button>
                  </li>
                  <hr key={"hr" + genre} className="mx-10 opacity-30" />
                </>
              );
            })}
          </ul>
          <form className="flex flex-row w-full my-3" onSubmit={(e) => handleAddGenre(e)}>
            <input
              className="min-w-0 border grow mr-3 p-2"
              type="text"
              placeholder="Genre Name"
              name="genre_name"
            ></input>
            <button type="submit">Add Genre</button>
          </form>
        </section>

        <section id="tags-container" className="flex-1 w-full h-full mx-[5%] mr-[10%]">
          <ul
            className="border h-[70%] overflow-y-scroll"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTag(e);
              }
            }}
          >
            {tags.map((tag) => {
              return (
                <>
                  <li
                    key={tag}
                    className="flex flex-row flex-nowrap justify-between my-5 mx-10 text-lg items-center"
                  >
                    <p>{tag}</p>
                    <button onClick={() => handleRemoveTag(tag)}>Remove</button>
                  </li>
                  <hr key={"hr" + tag} className="mx-10 opacity-30" />
                </>
              );
            })}
          </ul>
          <form className="flex flex-row w-full my-3" onSubmit={(e) => handleAddTag(e)}>
            <input
              className="min-w-0 border grow mr-3 p-2"
              type="text"
              placeholder="Tag Name"
              name="tag_name"
            ></input>
            <button type="submit">Add Tag</button>
          </form>
        </section>
      </div>
    </>
  );
}
