import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { CgProfile } from "react-icons/cg";
import { AiOutlineMail } from "react-icons/ai";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { BsPhone } from "react-icons/bs";
import { PiAddressBook } from "react-icons/pi";
import Sidebar from "../components/Sidebar";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header";

export default function Profile() {
  const [changeDetail, setChangeDetail] = useState(false);
  const [changeBtnShow, setChangeBtnShow] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    photoURL: [],
    birthDate: "",
    phoneNumber: "",
    address: "",
  });
  const { name, email, photoURL, birthDate, phoneNumber, address } = formData;

  useEffect(() => {
    const fetchPhoto = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData((preState) => ({
          ...preState,
          photoURL: docSnap.data().photoURL,
          birthDate: docSnap.data().birthDate,
          phoneNumber: docSnap.data().phoneNumber,
          address: docSnap.data().address,
        }));
      } else {
        console.log("Cannot display photo avatar");
      }
    };
    fetchPhoto();
  }, []);

  //LOG OUT
  const onLogout = () => {
    if(window.confirm('Do you want to sign out?')){
      auth.signOut();
      navigate("/sign-in");
    }
  };

  //ONCHANGE info
  const onChange = (e) => {
    //Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        photoURL: e.target.files,
      }));
      console.log(e.target);
    }

    //Text,boolean,number
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  //ONSUBMIT for change info
  const onSubmit = async () => {
    try {
      //update displayName in firebase auth
      await updateProfile(auth.currentUser, {
        displayName: name,
        // photoURL: photoURL,
      });
      // console.log("hello");

      //update name in the firestore
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        name,
        photoURL,
        birthDate,
        phoneNumber,
        address,
      });

      toast.success("Profile details updated!");
    } catch (error) {
      toast.error("Could not update the profile details.");
    }
  };



  // ----------------------------------------------------------
  //ONCHANGE image
  const handleChangeImage = (e) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        photoURL: e.target.files,
      }));
    }
  };

  //ONSUBMIT for change photo
  const onSubmitChangeImage = async (e) => {
    e.preventDefault();

    //STORE IMAGE in firebase storage
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
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
      [...photoURL].map((img) => storeImage(img))
    ).catch((err) => {
      console.log('cannot get imUrl", err');
      return;
    });

    //SAVE uploaded image in firebase auth and in firestore
    try {
      if (auth.currentUser !== null) {
        //firebase auth
        await updateProfile(auth.currentUser, {
          photoURL: imgUrl[0],
        });
        //in firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          photoURL: imgUrl[0],
        });
      }
    } catch (error) {
      console.log("cannot updateDoc ", error);
    }

    //get imageShow for display by clicking change Photo
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const getPhotoURL = docSnap.data().photoURL;
      setFormData((prevState) => ({
        ...prevState,
        photoURL: getPhotoURL,
      }));
    } else {
      console.log("cannot get image from firestore to display");
    }

    //change status for changeBtnShow
    setChangeBtnShow(false);
  };

  // ----------------------------------------------------------

  return (
    <div className="max-w-6xl bg-slate-50 ">
      <Header />

      <div className="flex w-full">

        <Sidebar/>
        <main className="w-full overflow-hidden 
        bg-white shadow-lg
        m-6 p-6">
          {/* -------------------------------------------------------- */}
          {/* <div
            className="lg:w-[90%] sm:w-[90%] 
        max-w-6xl mx-auto  
        flex flex-row justify-between items-center "
          > */}
            <h1
              className="
              text-3xl text-[#4C4C6D] font-bold "
            >
              MY PROFILE
            </h1>
          {/* </div> */}

          {/* SECTION ======================================================== */}

          <section
            className="lg:w-[90%] sm:w-[90%] 
          mt-6
          overflow-hidden
          flex bg-white"
          >
            {/*AVATAR ----------------------------------------------------------------*/}
            <div
              className="w-[30%] mt-6 mx-6
                      flex flex-col items-center justify-start "
            >
              {/* photo  */}
              <div className="mb-6 border w-32 h-32 rounded-full">
                <img
                  className="rounded-full w-32 h-32"
                  src={photoURL}
                  alt="avatar"
                />
              </div>

              <button
                className="px-2 py-1 text-sm
            rounded-full shadow-md
            bg-orange-300
            hover:bg-orange-400 hover:shadow-lg
            focus:bg-orange-400 focus:shadow-lg
            transition duration-150 ease-in-out
            cursor-pointer"
                type="button"
                onClick={() => setChangeBtnShow(!changeBtnShow)}
              >
                {changeBtnShow ? "Cancel" : "Change photo"}
              </button>

              {changeBtnShow && (
                <form
                  className="mt-6 flex flex-col w-[90%]
                border-t pt-6"
                  onSubmit={onSubmitChangeImage}
                >
                  <div>
                    <input
                      className={`mb-6 text-xs
                text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-xs file:font-semibold
                file:bg-orange-50 file:text-orange-700
                hover:file:bg-orange-100
                `}
                      type="file"
                      onChange={handleChangeImage}
                      accept=".jpg, .png, .jpeg"
                    />
                  </div>

                  <button
                    className="px-2 py-1 text-sm
            rounded-full shadow-md
            cursor-pointer
            bg-orange-100
            hover:bg-orange-200 hover:shadow-lg
            focus:bg-orange-200 focus:shadow-lg
            transition duration-150 ease-in-out"
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>

            {/* INFO EDIT------------------------------------------------------------- */}
            <form onSubmit={onSubmit} className="w-[70%] mt-6 mx-12">
              <div>
                {/* NAME INPUT--------------------------- */}
                <div className="flex items-center border-b mb-6">
                  <CgProfile
                    className="text-3xl mr-4 "
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

                {/* EMAIL INPUT -------------------------- */}
                <div className="flex items-center border-b mb-6">
                  <AiOutlineMail
                    className="text-3xl mr-4 "
                    style={{ color: "rgb(211, 133, 62)" }}
                  />
                  <div className="w-full">
                    <label
                      className="ml-3 font-semibold"
                      style={{ color: "rgb(102, 108, 101)" }}
                    >
                      EMAIL
                    </label>
                    <input
                      className={`w-full text-gray-700
                    border-none border-gray-300
                    bg-inherit
                    transition ease-in-out 
                    mb-2
            
            ${changeDetail && " bg-orange-200 focus:bg-orange-200"}`}
                      type="email"
                      id="email"
                      value={email}
                      disabled
                    />
                  </div>
                </div>

                {/* Birthdate INPUT--------------------------- */}
                <div className="flex items-center border-b mb-6">
                  <LiaBirthdayCakeSolid
                    className="text-3xl mr-4 "
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

                {/* PhoneNumber INPUT--------------------------- */}
                <div className="flex items-center border-b mb-6">
                  <BsPhone
                    className="text-3xl mr-4 "
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

                {/* Address INPUT--------------------------- */}
                <div className="flex items-center border-b mb-6">
                  <PiAddressBook
                    className="text-3xl mr-4 "
                    style={{ color: "rgb(211, 133, 62)" }}
                  />
                  <div className="w-full">
                    <label
                      className="ml-3 font-semibold"
                      style={{ color: "rgb(102, 108, 101)" }}
                    >
                      ADDRESS
                    </label>
                    <input
                      className={`w-full text-gray-700
                    border-none border-gray-300
                    bg-inherit
                    transition ease-in-out 
                    mb-2
            
            ${changeDetail && " bg-orange-200 focus:bg-orange-200"}`}
                      type="text"
                      id="address"
                      value={address}
                      disabled={!changeDetail}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>

              {/* EDIT / SIGN OUT----------------------------------  */}
              <div
                className="flex justify-between whitespace-nowrap
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
                    {changeDetail ? "Apply change" : "Edit Profile"}
                  </span>
                </p>
                <p
                  className="text-slate-600 hover:text-orange-400
              transition duration-200 ease-in-out cursor-pointer"
                  onClick={onLogout}
                >
                  Sign out
                </p>
              </div>


            </form>
          </section>
        </main>

      </div>
      
    </div>
  );
}
