import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import Review from "../components/Review";
import { AiOutlinePlus, AiOutlineCloseCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import CreateFeedback from "./CreateFeedback";
import Spinner from "../components/Spinner";

import {
  serverTimestamp,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function Feedback() {
  const [expanded, setExpanded] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [myFeedback, setMyFeedback] = useState(null);
  const [otherFeedback, setOtherFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const auth = getAuth();
  const navigate = useNavigate();
  const { title, content } = formData;

  // fetch my feedback
  useEffect(() => {
    const fetchFeedbackList = async () => {
      const feedbackListRef = collection(db, "feedback");
      const q = query(
        feedbackListRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let list = [];
      querySnap.forEach((doc) => {
        return list.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setMyFeedback(list);
      setLoading(false);
    };
    fetchFeedbackList();
  }, [auth.currentUser.uid]);

  //fetch other feedback
  useEffect(() => {
    const fetchOtherFeedbackList = async () => {
      const otherFeedbackListRef = collection(db, "feedback");
      const q = query(
        otherFeedbackListRef,
        where("userRef", "!=", auth.currentUser.uid),
        orderBy("userRef"),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let list = [];
      querySnap.forEach((doc) => {
        return list.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setOtherFeedback(list);
      setLoading(false);
    };
    fetchOtherFeedbackList();
  }, []);

  // Create new feedback
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    //create formDataCopy
    const formDataCopy = {
      ...formData,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
      avatar: auth.currentUser.photoURL,
      name: auth.currentUser.displayName,
    };
    const docRef = await addDoc(collection(db, "feedback"), formDataCopy);
    setShowModal(false);
    // setLoading(false);
    toast.success("Your feedback created!");
    navigate("/feedback");
  };

  // Modal for create -------------------------------------------------------
  const handleClick = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    if (window.confirm("Do you want to cancel?")) {
      setShowModal(false);
    }
  };

  const actionBar = (
    <div>
      <AiOutlineCloseCircle
        onClick={handleClose}
        className="text-gray-500 text-xl 
    hover:text-gray-700
    transition duration-150 ease-in-out"
      />
    </div>
  );

  const modal = (
    <CreateFeedback actionBar={actionBar} onClose={handleClose}>
      <h1
        className="text-3xl text-center text-orange-900
          mt-6 mb-12 font-bold"
      >
        We are listening to you!
      </h1>
      {/* FORM ------------------------------- */}
      <form onSubmit={onSubmit}>
        {/* title  */}
        <div>
          <span
            className="mr-6 block
                after:content-[*] after:ml-0.5 after:text-red-500
                text-sm text-slate-700 font-medium
                whitespace-nowrap"
          >
            Title:
          </span>
          <input
            className="mt-1 px-3 py-2 bg-white border shadow-sm 
              border-slate-300 placeholder-slate-400 
              focus:outline-none focus:border-orange-700 
              focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
            type="text"
            id="title"
            value={title}
            placeholder="Title Feedback"
            required
            onChange={onChange}
          />
        </div>

        {/* Content  */}
        <div className="mt-3">
          <span
            className="mr-6 block
                after:content-[*] after:ml-0.5 after:text-red-500
                text-sm text-slate-700 font-medium
                whitespace-nowrap"
          >
            Feedback content:
          </span>
          <textarea
            className="h-24
            mt-1 px-3 py-2 bg-white border shadow-sm 
              border-slate-300 placeholder-slate-400 
              focus:outline-none focus:border-orange-700 
              focus:ring-orange-700 block w-full rounded-md 
              sm:text-sm focus:ring-1"
            type="text"
            id="content"
            value={content}
            placeholder="Feedback content"
            required
            onChange={onChange}
          />
        </div>

        {/* button */}
        <div className="mt-6 flex justify-center">
          <Button type="submit">Create Feedback</Button>
        </div>
      </form>
    </CreateFeedback>
  );
  //End Modal for create -------------------------------------------------------

  const onDelete = async (feedbackID) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "feedback", feedbackID));
      const updatedFeedbackList = myFeedback.filter(
        (feedback) => feedback.id !== feedbackID
      );
      setMyFeedback(updatedFeedbackList);
      toast.success("Successful deleted!");
    }
  };

  // const onEdit = () => {};

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="bg-slate-50 max-w-6xl relative">
      <Header />

      {/* modal for create-------------------*/}
      {showModal && modal}

      <div className="flex">
        <Sidebar />

        <div>
          {/* SECTION  my feedback------------------------------------------ */}
          <section
            className=" m-6 p-6
            bg-white  shadow-lg"
          >
            <div className="flex justify-between items-center mr-3">
              <h1
                className="uppercase
                font-semibold text-2xl text-[#4C4C6D]"
              >
                My Feedback
              </h1>

              <Button onClick={handleClick}>
                <AiOutlinePlus />
              </Button>
            </div>

            <div>
              {!loading && myFeedback.length > 0 && (
                <div>
                  <div
                    className={`${!expanded && "h-[150px]"} overflow-hidden`}
                  >
                    <ul className="">
                      {myFeedback.map((doc) => (
                        <Review
                          key={doc.id}
                          id={doc.id}
                          feedBack={doc.data}
                          onDelete={() => onDelete(doc.id)}
                        />
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-center mt-3">
                    <Button onClick={() => setExpanded(!expanded)}>
                      {expanded ? "See Less" : "Expand more"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SECTION  other feedback------------------------------------------ */}
          <section
            className=" m-6 p-6
            bg-white shadow-lg"
          >
            <div className="flex justify-between items-center mr-3">
              <h1
                className="uppercase
                font-semibold text-2xl text-[#4C4C6D]"
              >
                Other Feedback
              </h1>
            </div>

            <div>
              {!loading && otherFeedback != null && (
                <div>
                  <div
                    className={`${!expanded2 && "h-[250px]"} overflow-hidden`}
                  >
                    <ul className="">
                      {otherFeedback.map((doc) => (
                        <Review key={doc.id} id={doc.id} feedBack={doc.data} />
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-center mt-3">
                    <Button onClick={() => setExpanded2(!expanded2)}>
                      {expanded2 ? "See Less" : "Expand more"}
                    </Button>
                  </div>
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
