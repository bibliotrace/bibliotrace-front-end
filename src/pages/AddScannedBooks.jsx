import NavBar from "../components/NavBar";
import tailwindConfig from "../../tailwind.config";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import defaultBook from "../assets/generic-book.png?react";
import BulkQrAndISBNDump from "../modals/BulkQrAndISBNDump";
import ErrorModal from "../modals/ErrorModal.jsx";
import BookDetailEditor from "../modals/BookDetailEditor.jsx";

export default function AddScannedBooks() {
  const [thumbnail, setThumbnail] = useState(defaultBook);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState(""); // this stores what the user types in
  const [primary_genre, setPrimaryGenre] = useState("");
  const [audience, setAudience] = useState("");
  const [pages, setPages] = useState("");
  const [series_name, setSeries_name] = useState("");
  const [series_number, setSeries_number] = useState("");
  const [publish_date, setPublish_date] = useState("");
  const [short_description, setShort_description] = useState("");
  const [location, setLocation] = useState("");
  const [qr, setQr] = useState("");
  const [bulkModalShow, setBulkModalShow] = useState(false);
  const [successType, setSuccessType] = useState("");
  const isbnInputRef = useRef(null);
  const qrInputRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [bookData, setBookData] = useState({});

  const jwt = Cookies.get("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    isbnInputRef.current.focus();

    async function getLocations() {
      const locationList = await JSON.parse(Cookies.get("locationList"));
      setLocations(locationList);
    }
    getLocations();
  }, []);

  useEffect(() => {
    if (error) {
      isbnInputRef.current.blur();
      qrInputRef.current.blur();
    }
  }, [error]);

  async function getBookInformationFromIsbn(e) {
    e.preventDefault();
    setError("");
    setSuccessType(false);
    if (!isbn) {
      setError("Please enter an ISBN number.");
      isbnInputRef.current.focus();
      return;
    }

    setPrimaryGenre("");
    setAudience("");

    const response = await fetch(`http://localhost:8080/api/bookdata/${isbn}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.ok) {
      const book = (await response.json()).object;
      console.log(book);
      setTitle(book.book_title);
      setAuthor(book.author);
      setPages(book.pages);
      setPublish_date(book.publish_date);
      setShort_description(book.short_description);
      setAudience(book.audience_name);
      setPrimaryGenre(book.primary_genre_name);
      setSeries_name(book.series_name);
      setSeries_number(book.series_number);
      setTags(book.tag_list);
      setGenres(book.genre_list);
      await getCoverThumbnail(isbn);
      console.log("Book successfully imported");
      qrInputRef.current.focus();
    } else {
      console.log(response.status, "response status");
      if (response.status === 401) {
        navigate("/login");
      } else if (response.status === 404) {
        setError("Book Not Recognized. Set it up in the editor window.");
        setTitle("Unrecognized Book");
        setAuthor("Open the Book Editor Below");
      } else {
        setError(`${JSON.parse(await response.text()).message}`);
      }
    }
  }

  async function getCoverThumbnail(isbn) {
    const response = await fetch(`http://localhost:8080/api/search/cover/${isbn}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      if (blob.size >= 100) {
        const objectURL = URL.createObjectURL(blob);
        setThumbnail(objectURL);
      }
    } else {
      if (response.status === 401) {
        navigate("/login");
      }
      setThumbnail(defaultBook);
    }
  }

  function handleEditButton(e) {
    setBookData({
      title,
      author,
      isbn,
      primaryGenre: primary_genre,
      synopsis: short_description,
      secondaryGenres: genres,
      audience,
      pages,
      publishDate: publish_date,
      tag_list: tags,
      series_name,
      series_number,
      language: "English",
      imgCallback: null,
    });

    setOpenEditModal(!openEditModal);
  }

  function onSubmit(e) {
    console.log("hello world!", isbn, location, qr);
    e.preventDefault();

    const fetchBody = {
      isbn,
      location_id: location,
      qr,
    };

    fetch("http://localhost:8080/api/inventory/add-book", {
      method: "POST",
      body: JSON.stringify(fetchBody),
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    }).then((result) => {
      result.json().then((data) => {
        if (data.message) {
          if (result.ok) {
            setMessage(`${data.message} [QR: ${qr}]`);
            setQr("")
          } else {
            setError(`Error Received: ${data.message}`);
          }
        }
      });
      
    });
  }

  return (
    <div className="h-lvh">
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
          transform="rotate(0, 50, 50) scale(1, 2)"
        />
      </svg>
      <NavBar
        useDarkTheme={true}
        showTitle={true}
        bgColor={tailwindConfig.theme.colors.lightBlue}
        textColor={tailwindConfig.theme.colors.black}
        homeNavOnClick="/admin"
      />

      <div className="flex flex-col justify-between h-5/6">
        <h1 className="text-center my-10 text-black font-rector pb-20 text-5xl">Add New Books</h1>
        <div className="flex flex-row pb-20">
          <section className="p-20 flex flex-col max-w-2xl">
            <h4>ISBN Number</h4>
            <form
              className="flex rounded-xl items-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getBookInformationFromIsbn(e);
                }
              }}
            >
              <input
                className="self-center border-2 w-full p-4 m-2 mx-0 rounded-lg text-2xl"
                type="text"
                placeholder="Start Scanning Here"
                ref={isbnInputRef}
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
              <button
                className="m-4"
                onClick={(e) => {
                  getBookInformationFromIsbn(e);
                }}
              >
                Grab Book Information
              </button>
            </form>

            <br></br>

            <label>
              Location:
              <select
                className="self-center border-2 w-full p-4 m-2 mx-0 rounded-lg text-2xl"
                value={location}
                onChange={(e) => {
                  console.log(e.target.value);
                  setLocation(e.target.value);
                }}
              >
                <option value="" disabled>
                  -- Choose an option --
                </option>
                {locations.map((location_obj) => {
                  return (
                    <option key={location_obj.id} value={location_obj.id}>
                      {location_obj.location_name}
                    </option>
                  );
                })}
              </select>
            </label>

            <br></br>

            <h4>QR Code</h4>
            <form
              className="flex rounded-xl items-center"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSubmit(e);
                }
              }}
            >
              <input
                className="self-center border-2 w-full p-4 m-2 mx-0 rounded-lg text-2xl"
                type="text"
                placeholder="Scan Above, Then Scan Here"
                ref={qrInputRef}
                value={qr}
                onChange={(e) => setQr(e.target.value)}
              />
              <button
                className="m-4"
                onClick={(e) => {
                  onSubmit(e);
                }}
              >
                Add To Inventory
              </button>
            </form>

            <br></br>

            <p>1. Use the scanner to scan a book's ISBN Number, usually on the back.</p>
            <p>2. Verify the information in the details to the right, updating it as needed.</p>
            <p>3. Select the location of this book in the location dropdown.</p>
            <p>4. Click the QR code field above then scan a new QR code in.</p>
            <p>
              5. Scanning the new code should add the book, click the Add to Inventory button if it doesn't.
            </p>
            <button
              className="w-fit mt-4"
              onClick={() => {
                setBulkModalShow(true);
              }}
            >
              Scanner Data Dump
            </button>
            {bulkModalShow && (
              <BulkQrAndISBNDump
                id="bulk-add-modal"
                title="Bulk Add Scan Dump"
                onExit={() => {
                  setBulkModalShow(false);
                }}
                operationType="add"
              />
            )}
          </section>

          <section className="p-20 flex-1">
            <div className="border-2 border-darkBlue rounded-md min-h-56 h-full">
              <h4 className="bg-lightBlue text-center text-black text-2xl p-2">
                Last Scanned Book:
                {successType === "create" ? (
                  <p className="text-green-500">Book successfully created!</p>
                ) : successType === "update" ? (
                  <p className="text-green-500">Book successfully updated!</p>
                ) : successType === "unknown" ? (
                  <p className="text-green-500">Book successfully modified!</p>
                ) : null}
              </h4>

              <div className="flex flex-row" style={{ height: "calc(100% - 3rem)" }}>
                <section className="p-5 basis-1/2 flex-grow flex justify-center items-center">
                  <img className="max-h-72 w-auto" src={thumbnail}></img>
                </section>
                <div className="p-5 py-10 basis-1/2 flex-grow flex flex-col justify-evenly text-lg">
                  <label>
                    <b>Title:</b> {title === "" ? "Not Yet Scanned" : title}
                  </label>
                  <label>
                    <b>Author:</b> {author}
                  </label>
                  <label>
                    <b>Primary Genre: </b> {primary_genre}
                  </label>
                  <label className="flex items-center">
                    <b className="pr-2">Secondary Genres: </b>
                    {genres.map((genreString) => {
                      return (
                        <p className="bg-lightBlue px-4 py-1 m-2 rounded-3xl text-white text-center text-nowrap">
                          {genreString}
                        </p>
                      );
                    })}
                  </label>
                  <label>
                    <b>Audience: </b> {audience}
                  </label>
                  <label>
                    <b>Page Count:</b> {pages}
                  </label>
                  <label>
                    <b>Series Name:</b> {series_name}
                  </label>
                  <label>
                    <b>Series Number:</b> {series_number}
                  </label>
                  <label>
                    <b>Publish Date:</b> {publish_date}
                  </label>
                  <label className="flex items-center">
                    <b className="pr-2">Tags: </b>
                    {tags.map((tag) => {
                      return (
                        <p className="bg-lightBlue px-4 py-1 m-2 rounded-3xl text-white text-center text-nowrap">
                          {tag}
                        </p>
                      );
                    })}
                  </label>
                  <label>
                    <b>Synopsis:</b> {short_description}
                  </label>
                  {author && (
                    <button className="mt-2 text-nowrap" onClick={(e) => handleEditButton(e)}>
                      Edit {title}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        <div id="error-modal">
          {error && (
            <ErrorModal
              id="error-modal"
              tabIndex="-1"
              description={"Error"}
              message={error}
              onExit={() => {
                setError("");
              }}
            />
          )}
          {message && (
            <ErrorModal
            id="message-modal"
            tabIndex="-1"
            description={"Message"}
            message={message}
            onExit={() => {
              setMessage("");
            }}
          />
          )}
        </div>
        <div id="detail-editor-modal">
          {openEditModal && (
            <BookDetailEditor
              bookData={bookData}
              imageSrc={thumbnail}
              onExit={() => setOpenEditModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
