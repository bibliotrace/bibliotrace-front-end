import Cookies from "js-cookie";
import { useRef, useState } from "react";
import tailwindConfig from "../../tailwind.config";
import NavBar from "../components/NavBar";
import ErrorModal from "../modals/ErrorModal";
import defaultBook from "../assets/generic-book.png?react";

export default function RemoveBook() {
  const bulkAddDialog = useRef(null);
  const [isbn, setIsbn] = useState("");
  const [qr, setQr] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function scanQr(e, qr) {
    e.preventDefault();

    setSuccess(false);
    console.log("scanning qr");
    if (qr == null || qr == "") {
      return;
    }
    const jwt = Cookies.get("authToken");
    setLoading(true);

    // We need the book data for the book that we are about to delete
    // such that it can be displayed on a successful delete
    try {
      const qrResponse = await fetch(`http://localhost:8080/api/bookdata/qr/${qr}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await qrResponse.json();
      if (qrResponse.ok) {
        console.log(data);
        setTitle(data.object.book_title);
        setAuthor(data.object.author);
        await getCoverThumbnail(data.object.isbn_list.split("|")[0]);
      } else {
        setMessage(`${data.message}`);
        setLoading(false);
        setSuccess(false);
        return;
      }
    } catch (error) {
      setMessage(`${error.message}`);
      setLoading(false);
      return;
    }

    try {
      const book = await fetch(`http://localhost:8080/api/inventory/delete/qr`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          qr,
        }),
      });
      const data = await book.json();
      if (book.ok) {
        setSuccess(true);
      } else {
        setMessage(`${data.message}`);
      }
    } catch (error) {
      setMessage(`${error.message}`);
    }

    setLoading(false);
  }

  async function scanIsbn(e, isbn) {
    e.preventDefault();
    setSuccess(false);
    console.log("scanning isbn");
    if (isbn == null || isbn == "") {
      return;
    }

    setLoading(true);
    const jwt = Cookies.get("authToken");
    // We need the book data for the book that we are about to delete
    // such that it can be displayed on a successful delete
    try {
      const book = await fetch(`http://localhost:8080/api/bookdata/${isbn}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await book.json();
      if (book.ok) {
        setTitle(data.object.book_title);
        setAuthor(data.object.author);
        await getCoverThumbnail(isbn);
      } else {
        setMessage(`${data.message}`);
        setLoading(false);
        return;
      }
    } catch (error) {
      setMessage(`${error.message}`);
      setLoading(false);
      return;
    }

    try {
      const book = await fetch(`http://localhost:8080/api/inventory/delete/isbn`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          isbn,
        }),
      });
      const data = await book.json();
      if (book.ok) {
        console.log("Book successfully deleted from inventory.");
        setSuccess(true);
      } else {
        setMessage(`${data.message}`);
      }
    } catch (error) {
      setMessage(`${error.message}`);
    }

    setLoading(false);
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

      <h1 className="text-center 5xl:my-16 3xl:my-12 lg:my-4 3xl:text-5xl text-black font-rector">
        Remove Books
      </h1>

      {message && (
        <ErrorModal
          description={"Error Removing Book"}
          message={message}
          onExit={() => {
            setMessage(null);
          }}
        />
      )}
      
      <div className="flex flex-row mt-40">
        <section className="2xl:p-20 xl:p-10 p-5 flex-1 flex flex-col justify-around text-lg">
          <div className="mb-5 flex items-center w-full">
            <input
              id="qr"
              type="text"
              className="flex-grow p-2 border-2 border-darkBlue rounded-lg focus:outline-none focus:border-darkBlue"
              placeholder="QR code"
              value={qr}
              onChange={(e) => setQr(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !message) {
                  scanQr(e, qr);
                }
              }}
            />
            <button
              className="ml-4 px-4 py-2 border-2 border-darkBlue text-darkBlue rounded-lg"
              onClick={(e) => scanQr(e, qr)}
            >
              Remove by QR
            </button>
          </div>
          <div className="mb-5 flex items-center w-full">
            <input
              id="isbn"
              type="text"
              className="flex-grow p-2 border-2 border-darkBlue rounded-lg focus:outline-none focus:border-darkBlue"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !message) {
                  scanIsbn(e, isbn);
                }
              }}
            />
            <button
              className="ml-4 px-4 py-2 border-2 border-darkBlue text-darkBlue rounded-lg"
              onClick={(e) => scanIsbn(e, isbn)}
            >
              Remove by ISBN
            </button>
          </div>
          <p>1. Select either the QR field or the ISBN field</p>
          <p>2. Scan the respective code on the book that you wish to remove</p>
          <p>
            3. If the removal is successful, the book information for the recently removed book will
            appear on the right
          </p>
        </section>

        <section className="2xl:p-20 xl:p-10 p-5 flex-1">
          <div className="border-2 border-darkPeach rounded-md min-h-48 h-full">
            <h4 className="bg-darkPeach  text-center text-white 3xl:text-3xl xl:text-lg p-2">
              Book Removed:{" "}
            </h4>
            <div className="flex flex-row ">
              <section className="p-5 basis-1/2 flex-grow flex justify-center items-center">
                <img
                  className="5xl:h-[30rem] 3xl:h-60 2xl:h-54 w-auto"
                  src={thumbnail ?? defaultBook}
                  onError={(e) => {
                    e.target.onerror = null; // prevents looping
                    e.target.src = defaultBook;
                  }}
                ></img>
              </section>
              <div className="p-5 py-20 basis-1/2 flex-grow flex flex-col justify-evenly 5xl:text-[3rem] 3xl:text-[2rem] 2xl:text-lg xl:text-lg lg:text-lg">
                {title && author && success ? (
                  <>
                    <p className="">Book deleted successfully!</p>
                    <p className="">Title: {title}</p>
                    <p className="">Author: {author}</p>
                  </>
                ) : (
                  <>
                    {loading ? (
                      <p className="">Loading deletion request...</p>
                    ) : (
                      <p className="">
                        Last book deletion request was not successful. Please try again.
                      </p>
                    )}
                    <p className="">Last successfully deleted title: {title ?? "None"}</p>
                    <p className="">Author: {author ?? "None"}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <dialog className="border-2 border-darkPeach rounded-md min-h-48" ref={bulkAddDialog}>
        <h4 className="bg-lightRed  text-center text-black text-lg p-2">Bulk Remove by ISBN</h4>
        <span
          className="top-0 right-0 z-10 absolute mx-5 my-2 hover:cursor-pointer"
          onClick={() => bulkAddDialog.current.close()}
        >
          &#x2715;
        </span>
        <form
          className="flex flex-col mx-10 my-5"
          onSubmit={(e) => {
            scanIsbn(e, isbn);
          }}
        >
          <input
            autoFocus={true}
            className="mb-5 p-2 border-2 border-darkPeach rounded-lg focus:border-darkPeach focus:outline-none"
            type="text"
            name="isbn"
            placeholder="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !message) {
                scanIsbn(e, isbn);
              }
            }}
          ></input>
          <button className="self-center bg-lightRed text-white" type="submit">
            Remove
          </button>
        </form>
      </dialog>
    </>
  );
}
