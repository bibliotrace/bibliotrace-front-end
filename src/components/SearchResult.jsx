import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultBook from "../assets/generic-book.png";
import BookDetails from "../modals/BookDetails";
import Cookies from "js-cookie";

const SearchResult = ({ bookData }) => {
  const [image, setImage] = useState(defaultBook);
  const [openModal, setOpenModal] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  const navigate = useNavigate(); 

  const isbn = bookData.isbn;
  const coverImageId = bookData.coverImageId;
  const title = bookData.title;
  const author = bookData.author;
  const genre = bookData.genre;
  const series = bookData.series;

  const bookTitle = (
    <p id="book-title" className="">
      {title}
    </p>
  );
  const bookAuthor = (
    <p id="book-author" className="text-center">
      {author}
    </p>
  );
  const bookGenre = (
    <p id="book-genre" className="text-center">
      {genre}
    </p>
  );
  const bookSeries = (
    <p id="book-series" className="text-center">
      {series}
    </p>
  );

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (isbn == null) {
        return;
      }

      const jwt = Cookies.get("authToken");

      try {
        let response;
        if (coverImageId != null && coverImageId != "") {
          response = await fetch(
            `http://localhost:8080/api/search/cover/${coverImageId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
        } else {
          response = await fetch(`http://localhost:8080/api/search/cover/${isbn}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
        }

        if (response.ok) {
          const blob = await response.blob();
          if (blob.size >= 100) {
            const objectURL = URL.createObjectURL(blob);
            setImage(objectURL);
          }
        } else {
            if (response.status === 401) {
                navigate('/login')
            }
            setImage(defaultBook);
        }
      } catch (e) {
        console.log(e);
        setImage(defaultBook);
      }
    };
    fetchImage();
  }, [isbn]);

  return (
    <div>
      <div
        className="hidden md:flex justify-between cursor-pointer h-fit 
        border-x-2 border-x-[#110057] border-b-2 border-b-[#110057] 
        bg-[#FFFFFF] bg-opacity-90 text-xl 
        transition-transform duration-200 ease-in-out hover:scale-105 "
        onClick={toggleModal}
      >
        <div className="h-40 flex items-center justify-center px-3 border-r-slate-50 border-r-2 w-28 text-transparent">
          <img src={image} className="w-28 m-2" alt="Cover Thumbnail"></img>
        </div>
        <div className="flex items-center justify-center px-3 border-r-slate-50 border-r-2 w-1/3">
          {bookTitle}
        </div>
        <div className="flex items-center justify-center px-3 border-r-slate-50 border-r-2 w-1/5">
          {bookAuthor}
        </div>
        <div className="flex items-center justify-center px-3 border-r-slate-50 border-r-2 w-1/5">
          {bookGenre}
        </div>
        <div className="flex items-center justify-center px-3 w-1/5">{bookSeries}</div>
      </div>

      <div
        className="justify-between h-fit  bg-[#FFFFFF] bg-opacity-90"
        onClick={toggleModal}
      >
        <div className="flex md:hidden w-70 h-64 relative rounded-lg shadow-lg overflow-hidden items-center justify-start p-4">
          <img src={image} className="w-26 h-32 object-cover rounded-md mr-4" alt="Cover Thumbnail"></img>
          
          <div className="flex flex-col justify-center items-start text-left">
            <h3 className="text-lg font-bold text-[#000000] text-left">{bookTitle}</h3>
            <p className="text-md text-[#000000]">{bookAuthor}</p>
            <p className="text-sm text-[#000000]">{bookGenre}</p>
            <p className="text-sm text-[#000000]">{bookSeries}</p>
          </div>  
        </div>
      </div>
      

      {openModal && (
        <BookDetails onExit={toggleModal} bookData={bookData} imageSrc={image} />
      )}
    </div>
  );
};

export default SearchResult;
