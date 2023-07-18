import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Slider from "../components/Slider";
import BookPreview from "../components/BookPreview";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router";
import { collection, orderBy, query, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import FeedBack from "../components/Review";
import ScrollToTopButton from "../components/ScrollToTopButton";


export default function Home() {
  const [feedbackList, setFeedbackList] = useState(null);
  const [bookList, setBookList] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  //get book data
  useEffect(() => {
    const fetchBookList = async () => {
      try {
        //get reference
        const bookListRef = collection(db, "bookList");
        //create the query
        const q = query(bookListRef, orderBy("timestamp", "desc"), limit(3));
        //execute the query
        const querySnap = await getDocs(q);
        const list = [];
        querySnap.forEach((doc) => {
          return list.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setBookList(list);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBookList();


    const fetchFeedbackList = async () => {
      try {
        const feedbackListRef = collection(db, "feedback");
        const q = query(
          feedbackListRef,
          orderBy("timestamp", "desc"),
          limit(3)
        );
        const querySnap = await getDocs(q);
        const list = [];

        querySnap.forEach((doc) => {
          return list.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setFeedbackList(list);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFeedbackList();

  }, []);




  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="bg-slate-50 max-w-6xl">
      <Header />

      <div className="flex w-full">
        <Sidebar />

        <div className="w-full overflow-hidden">
          {/* SECTION 1 slider------------------------------------------ */}
          <section
            className="m-6 bg-white 
            flex flex-col md:flex-row
            shadow-lg "
          >
            <Slider />
          </section>

          {/* SECTION 2 new books------------------------------------------ */}
          <section
            className="m-6 bg-white
            shadow-lg"
          >
            <h1
              className=" p-3 pb-0
            font-semibold text-2xl text-[#4C4C6D]
            hover:text-violet-900"
              onClick={() => navigate("/book-store")}
            >
              NEW BOOKS IN STORE
            </h1>

            {!loading && bookList.length > 0 && (
              <div className="flex">
                <ul className="sm:grid md:grid-cols-3">
                  {bookList.map((book) => (
                    <BookPreview key={book.id} book={book.data} id={book.id} />
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* SECTION 3 feedback------------------------------------------ */}
          <section
            className="m-6 p-3 
            bg-white
            shadow-lg"
          >
            <div className="flex justify-between items-center mr-3">
              <h1
                className="uppercase
            font-semibold text-2xl text-[#4C4C6D]
            hover:text-violet-900"
                onClick={() => navigate("/feedback")}
              >
                Feedback
              </h1>
            </div>

            {!loading && feedbackList !== null  && (
              <div>
                <ul className="">
                  {feedbackList.map((doc) => (
                    <FeedBack key={doc.id} id={doc.id} feedBack={doc.data} />
                  ))}
                </ul>
              </div>
            )}

          </section>

          <ScrollToTopButton />
        </div>
      </div>
    </div>
  );
}
