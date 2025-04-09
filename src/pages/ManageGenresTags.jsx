import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ErrorModal from "../modals/ErrorModal.jsx";

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
      if (!response.ok) {
        setMessage(`${data.message}`);
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
      if (!response.ok) {
        setMessage(`${data.message}`);
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
      <NavBar useDarkTheme={true} showTitle={true} bgColor={"#FFFFFF"} showNavButtons={true}></NavBar>
      <h1 className="text-center my-10">Edit Genres/Tags</h1>
      {message ? (
        <ErrorModal
          id="error-modal"
          tabIndex="-1"
          description={"Error modifying genres/tags"}
          message={message}
          onExit={() => {
            setMessage(null);
          }}
        />
      ) : null}
      <div className="flex flex-row justify-between w-full h-[calc(100vh-200px)]">
        <section id="genres-container" className="flex-1 w-full h-full mx-[5%] ml-[10%] ">
          <ul className="border h-[70%] overflow-y-scroll">
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
          <ul className="border h-[70%] overflow-y-scroll">
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
