import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { db } from "../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function OAuth() {
  const navigate = useNavigate();

  const onGoogleClick = async () => {
    try {
      //khởi tạo hình thức đăng nhập bằng Google
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //check for the user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google!");
    }
  }

  return (
    <button
      type="button"
      onClick={onGoogleClick}
      style={{ background: `linear-gradient(#a59ea6, #acb5b4)` }}
      className="flex items-center justify-center
    w-full bg-red-600 text-white px-7 py-3
    text-sm font-medium uppercase rounded shadow-md
    hover:bg-red-700 transition duration-150 ease-in-out
    hover:shadow-lg active:bg-red-800"
    >
      <FcGoogle className="text-2xl mr-2 bg-white rounded-full" />
      Continue with google
    </button>
  );
}
