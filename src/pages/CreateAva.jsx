import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  ref,
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getAuth, updateProfile } from "firebase/auth";
import {
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

export default function CreateAva() {
  const auth = getAuth();
    // console.log(auth.currentUser);
  const [formData, setFormData] = useState({
    image: [],
  });
  const [image1, setImage] = useState(null);

  const { image } = formData;

  useEffect(() => {
    const fetchPhoto = async () => {
      const docRef = 
      doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        // console.log('doc data: ' , docSnap.data().photoURL);
        setImage(docSnap.data().photoURL);
    }else{
        console.log("no")
      }
    };
    fetchPhoto();
  }, []);


  const handleImageChange = (e) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //STORAGE IMAGE---------------------------------------
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
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

    // GET imgUrls ---------------------------------------
    const imgUrls = await Promise.all(
        [...image].map((image) => storeImage(image))
      ).catch((err) => {
        console.log(err);
        return;
      });
      console.log("imgUrls", imgUrls);



    try {
        if (auth.currentUser !== null) {
          //update photoURL in firebase auth
          await updateProfile(auth.currentUser, {
            photoURL: imgUrls[0],
          });
          console.log("testing1");

        //console.log("auth currentuser photoURL: ", auth.currentUser.photoURL)
  

          //update photoURL in firestore
          const docRef = 
          doc(db, "users", auth.currentUser.uid);
          await updateDoc(docRef, {
            photoURL: imgUrls,
          });
        }
      } catch (error) {
        console.log(error + "cannot updateDoc");
      }


      const docRef = 
      doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        console.log('doc data: ' , docSnap.data().photoURL);
        setImage(docSnap.data().photoURL);
      }else{
        console.log("no")
      }

  };


//   console.log("image1: ", image1);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center">
        <div className="mb-6 border w-32 h-32 rounded-full">
          <img
            className="rounded-full w-32 h-32"
              src={image1}
            alt="avatar"
          />
        </div>
        <input
          type="file"
          onChange={handleImageChange}
          accept=".jpg, .png, .jpeg"
          multiple
        />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
