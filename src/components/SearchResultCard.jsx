import Cookies from "js-cookie";
import { BookOpen, Library, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultBook from "../assets/generic-book.png";
import BookDetails from "../modals/BookDetails";

export default function SearchResultCard({ bookData }) {
  const [image, setImage] = useState(defaultBook);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      if (!bookData.isbn) return;
      const jwt = Cookies.get("authToken");
      try {
        const url = bookData.coverImageId
          ? `http://localhost:8080/api/search/cover/${bookData.coverImageId}`
          : `http://localhost:8080/api/search/cover/${bookData.isbn}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (response.ok) {
          const blob = await response.blob();
          if (blob.size >= 100) {
            setImage(URL.createObjectURL(blob));
          }
        } else if (response.status === 401) {
          navigate("/login");
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchImage();
  }, [bookData.isbn, bookData.coverImageId]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className="w-full text-left flex gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
      >
        <img
          src={image}
          alt={`Cover for ${bookData.title}`}
          className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-[#4A00E2] break-words">
            {bookData.title}
          </h3>
          {bookData.description && (
            <p className="mt-1 text-sm text-gray-700 line-clamp-2 sm:line-clamp-3">
              {bookData.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#110057]">
            {bookData.author && (
              <span className="inline-flex items-center gap-1">
                <User size={14} />
                {bookData.author}
              </span>
            )}
            {bookData.genre && (
              <span className="inline-flex items-center gap-1">
                <BookOpen size={14} />
                {bookData.genre}
              </span>
            )}
            {bookData.series && (
              <span className="inline-flex items-center gap-1">
                <Library size={14} />
                {bookData.series}
              </span>
            )}
          </div>
        </div>
      </button>
      {openModal && (
        <BookDetails onExit={() => setOpenModal(false)} bookData={bookData} imageSrc={image} />
      )}
    </>
  );
}
