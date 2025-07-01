import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Cookies from "js-cookie";
import useSorttable from "../components/useSorttable";
import BookDetails from "../modals/BookDetails";
import defaultBook from "../assets/generic-book.png";

export default function StockReport() {
  const [stock, setStock] = useState([]);
  const [bookData, setBookData] = useState({});
  const [coverImage, setCoverImage] = useState(defaultBook);
  const [openModal, setOpenModal] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useSorttable();
  useEffect(() => {
    getStock();
  }, []);

  const navigate = useNavigate();

  async function getStock() {
    try {
      const response = await fetch(`http://localhost:8080/api/report/stock`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });
      const data = await response.json();
      if (data.object) {
        setStock(data.object);
        setTotalQuantity(data.object.reduce((acc, entry) => acc + entry.quantity, 0));
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };

  const getBookData = async (bookId) => {
    try {
      const jwt = Cookies.get("authToken");
      const response = await fetch(`http://localhost:8080/api/bookdata/id/${bookId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await response.json();
      if (data.object) {
        return data.object;
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  const getBookCoverImage = async (isbn) => {
    if (isbn == null) {
      return;
    }
    const jwt = Cookies.get("authToken");
    try {
      let response = await fetch(`http://localhost:8080/api/search/cover/${isbn}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        if (blob.size >= 100) {
          const objectURL = URL.createObjectURL(blob);
          return objectURL;
        }
        else {
          return defaultBook;
        }
      } else {
        if (response.status === 401) {
          navigate('/login')
        }
        return defaultBook;
      }
    } catch (e) {
      console.log(e);
      return defaultBook;
    }
  };

  const viewBookData = async (bookId) => {
    let rawBookData = await getBookData(bookId);
    if (rawBookData) {
      let _bookData = {
        id: String(rawBookData.id),
        title: rawBookData.book_title,
        author: rawBookData.author ?? "Unknown",
        genre: rawBookData.genre_name,
        series: rawBookData.series_name ?? "None",
        isbn: rawBookData.isbn_list?.split("|")[0] ?? "Unknown",
        coverImageId: null,
      };
      setBookData(_bookData);
      setCoverImage(defaultBook);
      let _coverImage = await getBookCoverImage(_bookData.isbn);
      if (_coverImage) {
        setCoverImage(_coverImage);
      }
      toggleModal();
    }
  };

  return (
    <div className="search-bg w-full h-full">
      <NavBar useDarkTheme={true} showTitle={false} showNavButtons={true} back={true}></NavBar>

      <h1 className="text-center print:text-xl">Stock Report</h1>

      <div className="w-[80%] mx-auto">
        &nbsp;
        <button className="print:hidden border-black float-right" onClick={window.print}>
          Print Report
        </button>
      </div>

      <div className="flex flex-col w-full items-center">
        <ul className="flex-grow w-[80%] border mt-2 h-[70vh] bg-white p-10 overflow-y-scroll print:border-none print:w-full print:p-0 print:overflow-visible">
          <div className="text-right mt-2 mr-2">
            <span className="font-bold">Total Quantity:&nbsp;&nbsp;</span>
            <span>{totalQuantity}</span>
          </div>
          <table className="sortable border w-full print:text-xs">
            <thead>
              <tr>
                <th className="border hover:cursor-pointer">Title</th>
                <th className="border hover:cursor-pointer">Author</th>
                <th className="border hover:cursor-pointer">Genre</th>
                <th className="border hover:cursor-pointer">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((entry) => {
                return (
                  <>
                    <tr className="hover:bg-gray" onClick={() => viewBookData(entry.id)}>
                      <td className="border p-5 text-center print:p-2">{entry.book_title}</td>
                      <td className="border p-5 text-center print:p-2">{entry.author}</td>
                      <td className="border p-5 text-center print:p-2">{entry.genre_name}</td>
                      <td className="border p-5 text-center print:p-2">{entry.quantity}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </ul>
      </div>

      {openModal && (
        <BookDetails onExit={toggleModal} bookData={bookData} imageSrc={coverImage} />
      )}

    </div>
  );
}
