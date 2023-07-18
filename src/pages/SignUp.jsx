import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { setDoc, doc, serverTimestamp, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
    birthDate: "",
    phoneNumber: "",
    address: "",
  });
  const { name, email, password, photoURL,birthDate,phoneNumber,address} = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      //init
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      //update displayName
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL:"",
      });

      const user = userCredential.user;


      //delete password from formData
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      //create data in firestore database
      await setDoc(doc(db, "users", user.uid), formDataCopy);

      toast.success("Sign up successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with the registration!");
    }
  };

  return (
    <section>
      <h1 className="text-5xl text-center mt-6 font-bold text-orange-500">
        Sign Up
      </h1>

      <div
        className="flex justify-center flex-wrap items-center
      px-6 py-8 max-w-6xl mx-auto"
      >
        {/* PHOTO ---------------------------------------------- */}
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          
          <img
            src="https://plus.unsplash.com/premium_photo-1677151193419-9be7a26c02cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80"
            alt="book"
            className="w-full rounded"
          />
        </div>

        {/* FORM ---------------------------------------------------- */}
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
            {/* NAME------------ */}
            <input
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white
            border-gray-300 rounded transition ease-in-out mb-6"
              type="text"
              placeholder="Full Name"
              id="name"
              value={name}
              onChange={onChange}
            />

            {/* EMAIL------------ */}
            <input
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white
            border-gray-300 rounded transition ease-in-out mb-6"
              type="email"
              placeholder="Email Address"
              id="email"
              value={email}
              onChange={onChange}
            />

            {/* PASSWORD------------ */}
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white
            border-gray-300 rounded transition ease-in-out mb-6"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                value={password}
                onChange={onChange}
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute top-3 right-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className="absolute top-3 right-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>

            {/* ----------------------------- */}
            <div
              className="flex justify-between whitespace-nowrap
              text-sm sm:text-md"
            >
              <p className="mb-6">
                Don't have an account?
                <Link
                  to="/sign-up"
                  className="text-violet-500 hover:text-violet-700
                transition duration-200 ease-in-out ml-1"
                >
                  Register
                </Link>
              </p>

              <p>
                <Link
                  to="/forgot-password"
                  className="text-orange-500 hover:text-orange-700
                  transition duration-200 ease-in-out"
                >
                  Forgot password
                </Link>
              </p>
            </div>

            {/* ----------------------------- */}
            <button
              style={{ background: `linear-gradient(#a59ea6, #acb5b4)` }}
              className="w-full bg-blue-600 text-white px-7 py-3
              text-sm font-medium uppercase rounded shadow-md
              hover:bg-blue-700 transition duration-150 ease-in-out
              hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Sign up
            </button>

            {/* ----------------------------- */}
            <div
              className="flex items-center my-4
              before:border-t before:flex-1 before:border-gray-300
              after:border-t after:flex-1 after:border-gray-300"
            >
              <p className="text-center font-semibold mx-4">OR</p>
            </div>

            {/* ----------------------------- */}
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
