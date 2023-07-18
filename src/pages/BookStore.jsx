import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../App.css";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import BookItem from "../components/BookItem";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";


export default function BookStore() {
  const navigate = useNavigate();
  const [bookList, setBookList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookList = async () => {
      const bookListRef = collection(db, "bookList");
      const docSnap = await getDocs(bookListRef);
      let bookList = [];
      docSnap.forEach((doc) => {
        return bookList.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setBookList(bookList);
      setLoading(false);
      // console.log(bookList);
    };
    fetchBookList();
  }, []);

  const onDelete = async (bookID) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "bookList", bookID));
      const updatedBookList = bookList.filter((book) => book.id !== bookID);
      setBookList(updatedBookList);
      toast.success("Successfully deleted!");
    }
  };

  const onEdit = (bookID) => {
    navigate(`/edit-book/${bookID}`);
  };


  return (
    <div className="max-w-6xl bg-slate-50 ">
      <Header />

      <div className="flex w-full">
        <Sidebar />

        <div
          className="lg:w-[90%] sm:w-[90%] md:w-[90%]
                    max-w-6xl 
                    m-6 p-6
                    bg-white shadow-lg"
        >
          {/* -------------------------------------------------------- */}

          <h1
            className="text-3xl mb-6
              font-bold text-[#4C4C6D]"
          >
            BOOK STORE - For rent
          </h1>
          {/* -------------------------------------------------------- */}

          <div 
          className="flex justify-between items-center mr-5 mb-12">
            <SearchBar 
            data2={bookList} 
            >Search a book</SearchBar>
            <Link to='/create-book'>
            <Button>Create Book</Button>
            </Link>
          </div>

          {/* -------------------------------------------------------- */}
          <section
            className="mt-6 bg-white
          max-w-6xl flex"
          >
            <div className="max-w-6xl px-3 mt-3">
              {!loading && bookList.length > 0 && (
                <div>
                  <ul
                    className="mt-3 mb-6
                  sm:grid sm:grid-cols-2
                  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 "
                  >
                    {bookList.map((book) => (
                      <BookItem
                        key={book.id}
                        id={book.id}
                        book={book.data}
                        onDelete={() => onDelete(book.id)}
                        onEdit={() => onEdit(book.id)}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <ScrollToTopButton />
        </div>
      </div>
    </div>
  );
}
