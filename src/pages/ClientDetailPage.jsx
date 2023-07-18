import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate, useParams } from "react-router";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import Spinner from "../components/Spinner";
import Avatar from "../components/Avatar";
import Moment from "react-moment";
import { toast } from "react-toastify";
import CreateRentedBookModal from "./CreateRentedBookModal";
import Button from "../components/Button";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { CgProfile } from "react-icons/cg";
import { BsPhone } from "react-icons/bs";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdRememberMe } from "react-icons/md";
import { AiOutlinePlus, AiOutlineCloseCircle } from "react-icons/ai";
import RentedBook from "../components/RentedBook";
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function ClientDetailPage() {
  const [rentedBookList, setRentedBookList] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [changeDetail, setChangeDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    birthDate: "",
    membership: "",
    clientID: "",
    imgUrls: [],
  });
  const { name, phoneNumber, birthDate, membership, clientID, imgUrls } =
    formData;

  useEffect(() => {
    const fetchClient = async () => {
      const docRef = doc(db, "clients", params.clientId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData((prevState) => ({
          ...prevState,
          clientID: docSnap.id,
          name: docSnap.data().name,
          phoneNumber: docSnap.data().phoneNumber,
          birthDate: docSnap.data().birthDate,
          membership: docSnap.data().timestamp,
          imgUrls: docSnap.data().imgUrls,
        }));
        // setClient(docSnap.data());
        // setLoading(false);
        // console.log(docSnap.data());
      }
    };
    fetchClient();
  }, [params.clientId]);

  useEffect(() => {
    const fetchRentedBooks = async () => {
      const listingRef = collection(db, "rentedBooks");
      const q = query(
        listingRef,
        where("clientRef", "==", params.clientId),
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
      setRentedBookList(list);
      // console.log(list);
      setLoading(false);
    };
    fetchRentedBooks();
  }, []);

  //   ONCHANGE info
  const onChange = (e) => {
    //Text, boolean, number
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  //ONSUBMIT for change info
  const onSubmit = async () => {
    try {
      //update info in the firestore
      const docRef = doc(db, "clients", params.clientId);
      await updateDoc(docRef, {
        name,
        phoneNumber,
        birthDate,
        membership,
        imgUrls,
      });
      toast.success("Client's information is updated!");
    } catch (error) {
      toast.error("Could not update the Client's information!");
    }
  };

  // ----------------------------------------------------------
  //onChange for image
  const handleChangeImage = (e) => {
    // if (e.target.files) {
    setFormData((prevState) => ({
      ...prevState,
      imgUrls: e.target.files,
    }));
    // }
  };

  //onSubmit for change photo
  const onSubmitChangePhoto = async (e) => {
    e.preventDefault();

    //STORE IMAGE in firebase storage
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${params.clientId}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    //GET link from image (imgUrl)
    const imgUrl = await Promise.all(
      [...imgUrls].map((img) => storeImage(img))
    ).catch((err) => {
      console.log("cannot get imgUrl", err);
      return;
    });

    //SAVE uploaded image in firestore
    try {
      //   if (params.clientId !== null) {
      //in firestore
      const docRef = doc(db, "clients", params.clientId);
      await updateDoc(docRef, {
        imgUrls: imgUrl[0],
      });
      //   }
    } catch (error) {
      console.log("cannot updateDoc ", error);
    }

    //get imageShow for display by clicking change Photo
    const docRef = doc(db, "clients", params.clientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const getImgUrls = docSnap.data().imgUrls;
      setFormData((prevState) => ({
        ...prevState,
        imgUrls: getImgUrls,
      }));
    } else {
      console.log("cannot get image from firestore to display");
    }

    toast.success("Avatar updated!");
  }; //end onSubmitChangePhoto
  // ----------------------------------------------------------

  // Modal for create -------------------------------------------------------
  const [formData2, setFormData2] = useState({
    nameBook: "",
    number: "",
    startDate: "",
    endDate: "",
  });
  const { nameBook, number, startDate, endDate } = formData2;

  const onChange2 = (e) => {
    setFormData2((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit2 = async (e) => {
    e.preventDefault();

    // create formDataCopy
    const formDataCopy = {
      ...formData2,
      timestamp: serverTimestamp(),
      clientRef: clientID,
    };

    const docRef = await addDoc(collection(db, "rentedBooks"), formDataCopy);

    toast.success("A new rented book created!");
    navigate(`/client-manage/${params.clientId}`);
    setShowModal(false);
  };

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
    <CreateRentedBookModal actionBar={actionBar} onClose={handleClose}>
      <h1
        className="text-3xl text-center text-orange-900
            mt-6 mb-12 font-bold"
      >
        New Rented Book
      </h1>
      {/* FORM ------------------------------- */}
      <form onSubmit={onSubmit2}>
        {/* NAME  */}
        <div className="mt-6 p-2">
          <span
            className="mr-6 after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700  whitespace-nowrap"
          >
            Book Name:
          </span>
          <input
            className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
            type="text"
            id="nameBook"
            value={nameBook}
            placeholder="Book Name"
            required
            onChange={onChange2}
          />
        </div>

        {/* Number of book  */}
        <div className="mt-6 p-2">
          <span
            className="mr-6 after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700  whitespace-nowrap"
          >
            Number of Book:
          </span>
          <input
            className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
            type="number"
            id="number"
            value={number}
            placeholder="Number of Book"
            required
            onChange={onChange2}
          />
        </div>

        {/* Start  and End */}
        <div className="grid grid-cols-2 mt-3">
          {/* start  */}
          <div className="w-full p-2">
            <span
              className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
            >
              Start:
            </span>
            <input
              className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
              type="date"
              id="startDate"
              value={startDate}
              required
              onChange={onChange2}
            />
          </div>

          {/* end  */}
          <div className="w-full p-2">
            <span
              className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
            >
              End:
            </span>
            <input
              className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
              type="date"
              id="endDate"
              value={endDate}
              required
              onChange={onChange2}
            />
          </div>
        </div>

        {/* button */}
        <div className="mt-12 flex justify-center">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </CreateRentedBookModal>
  );

  //End Modal for create -------------------------------------------------------

  const onDelete = async (bookID) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "rentedBooks", bookID));
      const updatedRentedList = rentedBookList.filter(
        (doc) => doc.id != bookID
      );
      setRentedBookList(updatedRentedList);
      toast.success("Successfully Deleted!");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl bg-slate-50">
      <Header />

      <div className="flex">
        <Sidebar />

        {/* =========================================================== */}
        <div>
          {/* SECTION 1 --------------------------------- */}
          <section
            className="m-6 p-6 
         bg-white shadow-lg border overflow-hidden"
          >
            {/* TITLE  */}
            <h1 className="text-2xl text-[#4C4C6D] font-bold uppercase ">
              Client information
            </h1>

            <div
              className="grid md:grid-cols-2 
          mt-6 shadow border border-slate-100"
            >
              {/* AVATAR  */}
              <div
                className="flex flex-col items-center justify-center
              overflow-hidden"
              >
                <Avatar
                  linkPhoto={imgUrls}
                  onSubmitBtn={onSubmitChangePhoto}
                  onChangeBtn={handleChangeImage}
                />
              </div>

              {/* CLIENT INFO AND CAN EDIT  */}
              <form
                className=" mt-6 pr-6 pb-6
              overflow-hidden"
              >
                {/* NAME INPUT--------------------------- */}
                <div className="flex items-center border-b mb-3">
                  <CgProfile
                    className="text-xl mr-4 "
                    style={{ color: "rgb(211, 133, 62)" }}
                  />
                  <div className="w-full">
                    <label
                      className="ml-3 font-semibold"
                      style={{ color: "rgb(102, 108, 101)" }}
                    >
                      NAME
                    </label>
                    <input
                      className={`w-full text-gray-700
                    border-none border-gray-300
                    bg-inherit
                    transition ease-in-out 
                    mb-2
            
            ${changeDetail && " bg-orange-200 focus:bg-orange-200"}`}
                      type="text"
                      id="name"
                      value={name}
                      disabled={!changeDetail}
                      onChange={onChange}
                    />
                  </div>
                </div>

                {/* PhoneNumber INPUT--------------------------- */}
                <div className="flex items-center border-b mb-3">
                  <BsPhone
                    className="text-xl mr-4 "
                    style={{ color: "rgb(211, 133, 62)" }}
                  />
                  <div className="w-full">
                    <label
                      className="ml-3 font-semibold"
                      style={{ color: "rgb(102, 108, 101)" }}
                    >
                      PHONE NUMBER
                    </label>
                    <input
                      className={`w-full text-gray-700 
                    border-none border-gray-300
                    bg-inherit
                    transition ease-in-out 
                    mb-2
            
            ${changeDetail && " bg-orange-200 focus:bg-orange-200"}`}
                      type="number"
                      id="phoneNumber"
                      value={phoneNumber}
                      disabled={!changeDetail}
                      onChange={onChange}
                    />
                  </div>
                </div>

                {/* BIRTHDAY INPUT--------------------------- */}
                <div className="flex items-center border-b mb-3">
                  <LiaBirthdayCakeSolid
                    className="text-xl mr-4 "
                    style={{ color: "rgb(211, 133, 62)" }}
                  />
                  <div className="w-full">
                    <label
                      className="ml-3 font-semibold"
                      style={{ color: "rgb(102, 108, 101)" }}
                    >
                      BIRTH OF DATE
                    </label>
                    <input
                      className={`w-full text-gray-700
                    border-none border-gray-300
                    bg-inherit
                    transition ease-in-out 
                    mb-2
            
            ${changeDetail && " bg-orange-200 focus:bg-orange-200"}`}
                      type="date"
                      id="birthDate"
                      value={birthDate}
                      disabled={!changeDetail}
                      onChange={onChange}
                    />
                  </div>
                </div>

                {/* MEMBERSHIP INPUT--------------------------- */}
                <div className="flex items-center border-b mb-3">
                  <MdRememberMe
                    className="text-xl mr-4 "
                    style={{ color: "rgb(211, 133, 62)" }}
                  />
                  <div className="w-full">
                    <label
                      className="ml-3 font-semibold"
                      style={{ color: "rgb(102, 108, 101)" }}
                    >
                      MEMBERSHIP FROM
                    </label>

                    <Moment
                      className="w-full block
                  mb-2 ml-3 mt-1
                  text-gray-700"
                      format="YYYY-MM-DD"
                    >
                      <input
                        type=""
                        id="membership"
                        value={membership}
                        disabled
                      />
                    </Moment>
                  </div>
                </div>

                {/* CLIENT ID--------------------------- */}
                <div className="flex items-center border-b mb-3">
                  <MdRememberMe
                    className="text-xl mr-4 "
                    style={{ color: "rgb(211, 133, 62)" }}
                  />
                  <div className="w-full">
                    <label
                      className="ml-3 font-semibold"
                      style={{ color: "rgb(102, 108, 101)" }}
                    >
                      CLIENT ID
                    </label>

                    <p
                      className="w-full block
                  mb-2 ml-3 mt-1
                  text-gray-700"
                    >
                      {formData.clientID}
                    </p>
                  </div>
                </div>

                {/* EDIT / SIGN OUT----------------------------------  */}
                <div
                  className="flex justify-end whitespace-nowrap
             text-sm sm:text-md 
              mt-12"
                >
                  <p className="flex items-center">
                    <span
                      className="text-slate-600 hover:text-orange-400
                transition ease-in-out duration-200 ml-1 cursor-pointer"
                      onClick={() => {
                        changeDetail && onSubmit();
                        setChangeDetail((prevState) => !prevState);
                      }}
                    >
                      {changeDetail ? "Apply change" : "Edit"}
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </section>

          {/* SECTION 2 --------------------------------- */}
          <section
            className="m-6 p-6 
         bg-white shadow-lg border"
          >
            {showModal && modal}

            {/* TITLE  */}
            <div className="flex justify-between items-center mr-3">
              <h1 className="text-2xl text-[#4C4C6D] font-bold uppercase ">
                book management
              </h1>
              <Button onClick={handleClick}>
                <AiOutlinePlus />
              </Button>
            </div>

            <div>
              {!loading && rentedBookList.length != null && (
                // <div>
                <ul>
                  {rentedBookList.map((doc) => (
                    <RentedBook
                      key={doc.id}
                      rentedBook={doc.data}
                      onDelete={() => onDelete(doc.id)}
                    />
                  ))}
                </ul>
                // </div>
              )}
            </div>
          </section>

          <ScrollToTopButton />
        </div>
      </div>
    </div>
  );
}
