import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import tailwindConfig from "../../tailwind.config";
import defaultBook from "../assets/generic-book.png?react";
import NavBar from "../components/NavBar";
import ErrorModal from "../modals/ErrorModal";

export default function SetLocation() {
  const [thumbnail, setThumbnail] = useState(defaultBook);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [series, setSeries] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(null);
  const [formerLocation, setFormerLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [bulkModalShow, setBulkModalShow] = useState(false);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  async function getLocations() {
    const locationList = await JSON.parse(Cookies.get("locationList"));
    setLocations(locationList);
  }

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    const handleFocus = (event) => {
      if (!bulkModalShow && inputRef.current) {
        inputRef.current.focus();
      }
    };

    if (bulkModalShow) {
      // Remove event listeners when modal is open
      document.removeEventListener("click", handleFocus);
      document.removeEventListener("keydown", handleFocus);
    } else {
      // Add event listeners when modal is closed
      // document.addEventListener("click", handleFocus);
      document.addEventListener("keydown", handleFocus);
    }

    // Cleanup function to prevent multiple bindings
    return () => {
      document.removeEventListener("click", handleFocus);
      document.removeEventListener("keydown", handleFocus);
    };
  }, [bulkModalShow]);

  async function scanBook(e) {
    if (e.key !== "Enter" || e.target.value == "") {
      return;
    }
    const qr_code = e.target.value;
    if (!location) {
      setMessage("Please select a location");
      return;
    }

    setTitle("");
    setAuthor("");
    setThumbnail(defaultBook);
    setSeries("");
    setMessage("");

    const jwtDataString = Cookies.get("jwtData");
    if (jwtDataString == null) {
      navigate("/login");
    }

    const jwt = Cookies.get("authToken");
    try {
      const response = await fetch(`http://localhost:8080/api/inventory/setLocation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          qr_code: qr_code,
          location_id: location,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        console.log(data.object._object);
        setTitle(data.object._object.book_title);
        setAuthor(data.object._object.author);
        setSeries(data.object._object.series_name);
        setFormerLocation(data.object._object.location_name);

        const isbn = data.object._object.isbn_list.split("|")[0];
        await getCoverThumbnail(isbn);
      } else {
        setMessage(`${data.message}`);
      }
    } catch (error) {
      setMessage(`${error.message}`);
    }
    e.target.value = "";
  }

  async function getCoverThumbnail(isbn) {
    const jwt = Cookies.get("authToken");
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

      <div className="flex flex-col justify-between h-5/6">
        <h1 className="text-center my-10 text-white font-rector pb-20 text-5xl">
          Set Book Location
        </h1>
        {message && (
          <ErrorModal
            description={"Error Setting Book Location"}
            message={message}
            onExit={() => {
              setMessage(null);
            }}
          />
        )}
        <div className="flex flex-row pb-20">
          <section className="2xl:p-20 xl:p-10 p-5 flex-1 flex flex-col">
            <div className="text-xl mb-5">
              <label className="text-2xl">Location:</label>
              <select
                className="self-center border-2 w-full p-4 m-2 mx-0 rounded-lg text-2xl"
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              >
                <option disabled selected value>
                  -- Choose an option --
                </option>
                {locations.map((location_obj) => {
                  return <option value={location_obj.id}>{location_obj.location_name}</option>;
                })}
              </select>
            </div>

            <label className="text-2xl mb-2">QR Code:</label>
            <input
              className="self-center w-full mb-5 border-2 border-black text-black p-4 rounded-lg text-2xl"
              type="text"
              onKeyDown={(e) => scanBook(e)}
              placeholder="Start Scanning"
              ref={inputRef}
            />

            <p>1. Select the book's new location above</p>
            <p>2. Click on the QR Code input box to set the cursor there</p>
            <p>
              3. Scan the QR on the book (book information will appear if the location has been
              updated)
            </p>
          </section>

          <section className="2xl:p-20 xl:p-10 p-5 flex-1">
            <div className="border-2 border-darkBlue rounded-md min-h-56 h-full">
              <h4 className="bg-darkBlue  text-center text-white text-2xl p-2">Book Modified:</h4>
              {title != null && author != null ? (
                <div className="flex flex-row ">
                  <section className="p-5 basis-1/2 flex-grow flex justify-center items-center">
                    <img className="h-auto w-auto" src={thumbnail}></img>
                  </section>
                  <div className="p-5 py-20 basis-1/2 flex-grow flex flex-col justify-evenly text-lg">
                    <p className="">Title: {title}</p>
                    <p className="">Author: {author}</p>
                    <p className="">Former Location: {formerLocation}</p>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
