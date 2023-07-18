import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router";
import Spinner from "./Spinner";
import Moment from "react-moment";
import Contact from "./Contact";
import ScrollToTopButton from "./ScrollToTopButton";


export default function BookDetail() {
  const [contact, setContact] = useState(false);
  const [photoShow, setPhotoShow] = useState("");
  const [show, setShow] = useState(false);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      const docRef = 
      doc(db, "bookList", params.bookId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBook(docSnap.data());
        setLoading(false);
      }
    };
    fetchBook();
  }, [params.bookId]);


  const choosePhoto = (e) => {
    setPhotoShow(e.target.src);
    setShow(true);
    // console.log(e.target.src);
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="max-w-6xl bg-slate-50 ">
      <Header />

      <div className="flex">
        <Sidebar />

        <div className="">
          {/* SECTION 1------------------------------------------------------- */}
          <section
            className="m-6
            bg-white
            flex flex-col md:flex-row
            border shadow-lg"
          >
            {/* DIV - IMAGE  -----------------------------*/}
            <div
              className="p-4
                sm:w-full border-r
                h-min-[600px] w-full"
            >
              {/* BIG IMAGE */}
              <div
                className="w-full rounded 
            mx-auto"
              >
                <p
                  className="pb-2 lowercase first-letter:uppercase
                  text-xs text-slate-500"
                >
                  category: {book.category}
                </p>
                <img
                  className="object-cover
                    w-full"
                  src={
                    !show ? book.imgUrls[book.imgUrls.length - 1] : photoShow
                  }
                  alt="book"
                />
              </div>

              {/* SMALL IMAGE */}
              <div
                className="flex 
            mx-3 mt-6 overflow-x-scroll"
              >
                {book.imgUrls.map((image, index) => (
                  <img
                    className=" w-[100px]"
                    src={image}
                    alt="book1"
                    key={index}
                    id="photoIndex"
                    // value={index}
                    onClick={choosePhoto}
                  />
                ))}
              </div>
            </div>

            {/* INFO DETAIL  -----------------------------*/}
            <div
              className="p-4
              sm:w-full"
            >
              <div>
                {/* NAME  */}
                <p
                  className="mb-6 mt-6
                text-3xl font-mono"
                >
                  {book.name}
                </p>

                {/* AUTHOR  */}
                <p
                  className="mb-6
                text-blue-500 "
                >
                  by {book.author}
                </p>

                {/* PRICE  */}
                <div
                  className="flex items-end
                p-6
                bg-slate-50"
                >
                  <p
                    className="text-4xl
                  text-red-600
                  flex flex-col"
                  >
                    <span
                      className="text-sm mb-3
                    text-slate-500"
                    >
                      Rent per week:
                    </span>
                    ${book.offer ? book.discountedPrice : book.regularPrice}
                  </p>
                  {book.offer && (
                    <p
                      className="ml-3
                text-slate-500 line-through"
                    >
                      ${book.regularPrice}
                    </p>
                  )}

                  {book.offer && (
                    <p
                      className="ml-3 text-sm
                  text-red-400"
                    >
                      save{" "}
                      {book.offer &&
                        parseInt(
                          ((book.regularPrice - book.discountedPrice) /
                            book.regularPrice) *
                            100
                        )}{" "}
                      %
                    </p>
                  )}
                </div>

                {/* ID BOOK  */}
                <p
                  className="mt-6
                text-sm text-slate-500"
                >
                  <span className="">Book ID: </span>
                  {book.bookID}
                </p>

                <p
                  className="mt-6
                text-sm text-slate-500"
                >
                  <span>Available from: </span>
                  <Moment fromNow>{book.timestamp?.toDate()}</Moment>
                </p>

                {/* BUTTON contact   */}
                <div>
                  <button
                    className="px-7 py-3 mt-6 w-full
                  text-sm font-medium
                  rounded shadow-md bg-orange-200 
                  hover:bg-orange-400 hover:shadow-lg
                  focus:bg-orange-400 focus:shadow-lg
                  transition duration-150 ease-in-out"
                    onClick={() => setContact(!contact)}
                  >
                    {`${!contact ? "Have a question?" : "Cancel"}`}
                  </button>

                  {contact && <Contact book={book} />}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2------------------------------------------------------- */}
          <section
            className="m-6
            border bg-white
            shadow-lg "
          >
            <div className="p-4">
              <p
                className="mt-3 text-2xl
              text-orange-800"
              >
                Book Description
              </p>
              <p className="mt-6 text-sm font-semibold">{book.name}</p>
              <div
                className={`
              ${!expanded ? "&& h-[85-px]" : ""}`}
              >
                <p
                  className={`mt-3 text-sm
                leading-6 
                ${!expanded && "line-clamp-6"}`}
                >
                  {book.bookDescription}
                </p>

                <button
                  className="py-3 px-[100px] 
                mt-6 mb-6 block mx-auto
                rounded
                text-orange-700
                border border-orange-300
                hover:bg-orange-100"
                  onClick={() => setExpanded(!expanded)}
                >
                  {!expanded ? "Show more" : "Show less"}
                </button>

              </div>
            </div>
          </section>

          <ScrollToTopButton />


        </div>
      </div>
    </div>
  );
}
