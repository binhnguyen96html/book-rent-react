import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router";

export default function CreateClient() {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    birthDate: "",
    photos: {},
  });
  const { name, phoneNumber, birthDate, photos } = formData;

  const onChange = (e) => {
    //files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        photos: e.target.files,
      }));
    }

    //text/number/boolean
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //create storePhoto
    const storePhoto = async (photo) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${photo.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, photo);

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

    //get imgUrls
    const imgUrls = await Promise.all(
      [...photos].map((photo) => storePhoto(photo))
    ).catch((err) => {
      setLoading(false);
      toast.error("Photos not uploaded!");
      return;
    });

    //create formDataCopy
    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.photos;

    const docRef = await addDoc(collection(db, "clients"), formDataCopy);

    setLoading(false);
    toast.success("A new client created!");
    // console.log(formDataCopy.category);
    // navigate(`/category/${formDataCopy.category}/${docRef.id}`);
  };

  const handleClose = () => {
    if (window.confirm("Do you want to cancel?")) {
      navigate("/client-manage");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />

        <section
          className="border border-gray-200 shadow-lg
    w-full h-screen bg-white  relative
    m-8 px-12 pb-12 pt-6"
        >
          <h1
            className="text-3xl text-center text-orange-900
        mt-6 font-bold"
          >
            New Client
          </h1>

          <AiOutlineCloseCircle
            onClick={handleClose}
            className="text-gray-500 text-xl hover:text-gray-700
              transition duration-150 ease-in-out
              absolute top-6 right-6"
          />

          {/* FORM --------------------------------------------------------------- */}
          <form onSubmit={onSubmit}>
            {/* NAME  */}
            <div className="mt-6">
              <span
                className="mr-6 after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700  whitespace-nowrap"
              >
                Client Name:
              </span>
              <input
                className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                type="text"
                id="name"
                value={name}
                placeholder="Client Name"
                required
                onChange={onChange}
              />
            </div>

            {/* ---------------------------------------- */}
            {/* Client Phone Number  */}
            <div className="mt-6 w-full mr-3">
              <span
                className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
              >
                Phone Number:
              </span>
              <input
                className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                type="number"
                id="phoneNumber"
                value={phoneNumber}
                placeholder="phoneNumber"
                required
                onChange={onChange}
              />
            </div>

            {/* BirthDate  */}
            <div className="mt-6 w-full">
              <span
                className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
              >
                Date of Birth:
              </span>
              <input
                className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                type="date"
                id="birthDate"
                value={birthDate}
                placeholder="Date of Birth"
                required
                onChange={onChange}
              />
            </div>

            {/* ---------------------------------------- */}

            {/* IMAGE UPLOAD */}
            <div className="mt-6">
              <span
                className="mb-2 block text-sm font-medium 
          text-slate-700 whitespace-nowrap "
              >
                Avatar Photo:
              </span>
              <input
                className="mx-6 block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-orange-50 file:text-orange-700
            hover:file:bg-orange-100 "
                type="file"
                id="photos"
                accept=".jpg, .png, .jpeg"
                multiple
                required
                onChange={onChange}
              />
            </div>

            {/* SUBMIT BUTTON  */}
            <button
              type="submit"
              className="w-full px-7 py-3 mt-12
        bg-orange-200 uppercase
        font-medium font-sm text-sm
        border-none rounded shadow-md
        hover:bg-orange-300 hover:shadow-lg
        focus:bg-orange-300 focus:shadow-lg
        transition duration-150 ease-in-out"
            >
              Create
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
