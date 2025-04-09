import Cookies from "js-cookie";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import tailwindConfig from "../../tailwind.config";
import defaultBook from "../assets/generic-book.png?react";
import NavBar from "../components/NavBar";

export default function Checkin() {
  const [thumbnail, setThumbnail] = useState(defaultBook);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const navigate = useNavigate();

  async function scanBook(e) {
    if (e.key !== "Enter" || e.target.value == "") {
      return;
    }
    const qr_code = e.target.value;

    setTitle("");
    setAuthor("");
    setThumbnail(defaultBook);
    setMessage("");

    const jwtDataString = Cookies.get("jwtData");
    if (jwtDataString == null) {
      navigate("/login");
    }

    const jwt = Cookies.get("authToken");
    try {
      const response = await fetch(`http://localhost:8080/api/inventory/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          qr_code: qr_code,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        if (data.message.includes("No inventory items were updated")) {
          setMessage("Book has already been checked in!");
        } else {
          setTitle(data.object.book_title);
          setAuthor(data.object.author);

          const isbn = data.object.isbn_list.split("|")[0];
          await getCoverThumbnail(isbn);
        }
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
          className="fill-peachPink"
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
        bgColor={tailwindConfig.theme.colors.peachPink}
        textColor={tailwindConfig.theme.colors.black}
        homeNavOnClick="/admin"
      />

      <div className="flex flex-col justify-between h-5/6">
        <h1 className="text-center my-10 text-black font-rector pb-20 text-5xl">Book Check In</h1>
        <p className="text-center text-lg text-darkPeach h-0">{message}</p>
        <div className="flex flex-row pb-20">
          <section className="p-20 flex-1 flex flex-col">
            <label className="mt-5 mb-2">QR Code:</label>
            <input
              className="self-center w-full mb-5 border-2 border-black text-black p-4 rounded-lg text-2xl"
              type="text"
              onKeyDown={(e) => scanBook(e)}
              placeholder="Start Scanning"
              ref={inputRef}
            />

            <p>1. Scan the QR on the book (book information will show up if scan is successful)</p>
            <p>2. All done! The book is checked in</p>
          </section>

          <section className="p-20 flex-1">
            <div className="border-2 border-darkBlue rounded-md min-h-56 h-full">
              <h4 className="bg-peachPink  text-center text-black text-2xl p-2">Checked In:</h4>
              {title != null && author != null ? (
                <div className="flex flex-row ">
                  <section className="p-5 basis-1/2 flex-grow flex justify-center items-center">
                    <img className="h-auto w-auto" src={thumbnail}></img>
                  </section>
                  <div className="p-5 py-20 basis-1/2 flex-grow flex flex-col justify-evenly text-lg">
                    <p className="">Title: {title}</p>
                    <p className="">Author: {author}</p>
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
