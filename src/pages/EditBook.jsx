import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DropDown from "../components/DropDown";
import Spinner from '../components/Spinner';
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import {getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage';
import { v4 as uuidv4 } from "uuid";
import {doc, getDoc, serverTimestamp, updateDoc} from 'firebase/firestore';
import { db } from "../firebase";
import Header from "../components/Header";

export default function EditBook() {
  const [loading, setLoading] = useState(false);
  const [book,setBook]= useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
// console.log(auth.currentUser);


  const titleList = [
    { title: "Romance", value:'romance' },
    { title: "Self-Help", value:'selfHelp' },
    { title: "Mystery", value:'mystery' },
  ];

  const [formData, setFormData] = useState({
    name: "",
    bookID: "",
    author: "",
    bookDescription: "",
    category: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    photos: {},
  });
  const {
    name,
    bookID,
    author,
    bookDescription,
    category,
    offer,
    regularPrice,
    discountedPrice,
    photos,
  } = formData;

const params = useParams();


  //control who can edit
  useEffect(()=>{
    // if(book && book.userRef !== auth.currentUser.uid){
    if(!auth.currentUser){
        toast.error('You cannot edit this book');
        navigate('/');
    }
  },[auth.currentUser, navigate])
  // },[auth.currentUser.uid, book, navigate])

  //fetch data
  useEffect(()=>{
    setLoading(true);

    const fetchBook = async()=>{
        const docRef = 
        doc(db, 'bookList', params.bookId);
        const docSnap = await getDoc(docRef);
        if( docSnap.exists()){
            setBook(docSnap.data());
            setFormData({
                ...docSnap.data()
            });
            setLoading(false);
        }else{
            navigate('/');
            toast.error("Book doesn't exist!")
        }
    }
    fetchBook();

  },[navigate, params.bookId])


  const onChange = (e) => {
    //true-false
    let boolean = null;
    if(e.target.value === 'true'){
      boolean = true;
    }
    if(e.target.value === 'false'){
      boolean = false;
    }

    //files
    if(e.target.files){
      setFormData((prevState)=>({
        ...prevState,
        photos: e.target.files,
      }))
    }

    //text/number/boolean
    if(!e.target.files){
      setFormData((prevState)=>({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  };

  const onSubmit = async (e) =>{
    e.preventDefault();
    setLoading(true);

    //set condition for price
    if(+discountedPrice >= +regularPrice){
      setLoading(false);
      toast.error("Discounted price should be less than regular price!");
      return;
    }

    //create storePhoto
    const storePhoto = async(photo) =>{
      return new Promise((resolve, reject) =>{
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
      })
    }

    //get imgUrls
    const imgUrls = await Promise.all(
      [...photos]
      .map((photo)=>storePhoto(photo))
    ).catch((err)=>{
      setLoading(false);
      toast.error("Photos not uploaded!");
      return;
    })

    //create formDataCopy
    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    }

    delete formDataCopy.photos;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = doc(db, 'bookList', params.bookId);
    await updateDoc(docRef, formDataCopy);

    setLoading(false);
    toast.success('This book is edited!');
    navigate(`/category/${formDataCopy.category}/${docRef.id}`);
  }


if(loading){
  return <Spinner />;
}

  return (
    <div>
      <Header />
    <div className="flex border">
      <Sidebar />

      <section
        className="border border-gray-200 shadow-lg
    max-w-lg mx-auto mt-12 px-12 pb-12
    h-fit"
      >
        <h1
          className="text-3xl text-center text-orange-900
        mt-6 font-bold"
        >
          Edit Book
        </h1>

        {/* FORM --------------------------------------------------------------- */}
        <form onSubmit={onSubmit}>
          {/* NAME  */}
          <div className="mt-6">
            <span
              className="mr-6 after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700  whitespace-nowrap"
            >
              Name:
            </span>
            <input
              className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
              type="text"
              id="name"
              value={name}
              placeholder="Book Name"
              required
              onChange={onChange}
            />
          </div>

          {/* ---------------------------------------- */}
          <div className="flex justify-between">
            {/* BOOK ID  */}
            <div className="mt-6 w-full mr-3">
              <span
                className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
              >
                Book ID:
              </span>
              <input
                className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                type="text"
                id="bookID"
                value={bookID}
                placeholder="Book ID"
                required
                onChange={onChange}
              />
            </div>

            {/* BOOK AUTHOR  */}
            <div className="mt-6 w-full">
              <span
                className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
              >
                Book Author:
              </span>
              <input
                className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                type="text"
                id="author"
                value={author}
                placeholder="Book Author"
                required
                onChange={onChange}
              />
            </div>
          </div>

          {/* CATEGORIES  */}
          <div className="flex whitespace-nowrap mt-3">
            <div className="mt-6  mr-4 w-full">
              <span
                className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
              >
                Categories:
              </span>
              <DropDown 
              optionList={titleList} 
              id='category'
              value={category}
              onChange={onChange}
              />
            </div>

            {/* REGULAR PRICE  */}
            <div className="mt-6 w-full">
              <span
                className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
              >
                Regular Price:
              </span>

              <div className="flex items-center justify-center">
                <input
                  className="mt-1 mr-2 py-2 px-10 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                  type="number"
                  id="regularPrice"
                  value={regularPrice}
                  required
                  onChange={onChange}
                />
                <p
                  className="mr-3 text-sm font-medium text-slate-700 
          whitespace-nowrap"
                >
                  $ / Week
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------------------- */}
          <div className="flex whitespace-nowrap mt-3">
            {/* OFFER  */}
            <div className="mt-6 mr-6 w-full">
              <span
                className="mb-1
          block text-sm font-medium text-slate-700 whitespace-nowrap"
              >
                Offer:
              </span>
              <div className="flex justify-center">
                {/* YES  */}
                <button
                  className={`mr-3 px-2 py-2 text-sm uppercase font-medium
            shadow-md rounded-full border
            hover:shadow-lg focus:shadow-lg
            active:shadow-lg transition duration-150 ease-in-out
            ${offer ? "bg-orange-400 text-white" : "bg-white text-black"}`}
                  type="button"
                  id="offer"
                  value={true}
                  onClick={onChange}
                >
                  YES
                </button>

                {/* NO  */}
                <button
                  className={`px-2 py-2 font-medium text-sm uppercase
            shadow-md rounded-full border
            hover:shadow-lg focus:shadow-lg
            active:shadow-lg transition duration-150 ease-in-out
            ${!offer ? "bg-orange-400 text-white" : "bg-white text-black"}`}
                  type="button"
                  id="offer"
                  value={false}
                  onClick={onChange}
                >
                  No
                </button>
              </div>
            </div>

            {/* DISCOUNTED PRICE  */}
            <div className="mt-6 w-full">
              <span className="block text-sm font-medium text-slate-700 whitespace-nowrap">
                Discounted Price:
              </span>

              <div
                className={`flex items-center space-x-6 justify-center
          ${!offer && "text-slate-300"}`}
              >
                <input
                  className="mt-1 px-10 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  required={offer}
                  disabled={!offer}
                  onChange={onChange}
                />
                <p
                  className="text-sm font-medium
          whitespace-nowrap w-full"
                >
                  $
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------------------- */}
          {/* BOOK DESCRIPTION  */}
          <div className="mt-6">
            <span
              className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
            >
              Book Description:
            </span>
            <textarea
              className="mt-1 px-3 py-2 
              peer h-full min-h-[100px] resize-none
              bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
              type="text"
              id="bookDescription"
              value={bookDescription}
              placeholder="Book Description"
              required
              onChange={onChange}
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="mt-6">
            <span
              className="mb-2 block text-sm font-medium 
          text-slate-700 whitespace-nowrap "
            >
              Book Photo (max 6)
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
            className="w-full px-7 py-3 mt-6
        bg-orange-200 uppercase
        font-medium font-sm text-sm
        border-none rounded shadow-md
        hover:bg-orange-300 hover:shadow-lg
        focus:bg-orange-300 focus:shadow-lg
        transition duration-150 ease-in-out"
          >
            Updated
          </button>
        </form>
      </section>
    </div>
    </div>
  );
}
