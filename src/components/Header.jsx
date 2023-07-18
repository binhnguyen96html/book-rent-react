import { useNavigate, useLocation } from "react-router-dom";
import logo from "../photo/logo.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageStatus, setPageStatus] = useState("");
  const auth = getAuth();

    

  useEffect( () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const imgShow = 
        <img src={`${auth.currentUser.photoURL}`} alt="ava" 
        className="w-5 h-5 rounded-full bg-orange-300" />;

        setPageStatus(imgShow);
        
      } else {
        const label = "Sign In";
        setPageStatus(label);
      }
    });
  }, [auth]);

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };



  return (
    <div className="bg-white border-b 
    shadow-sm sticky top-0 z-40">
      <header
        className="flex justify-between items-center px-9 py-3
      mx-auto "
      >
        {/* LOGO ------------------------------------------ */}
        <div 
        className="flex items-center"
        onClick={() => navigate("/")}
        >
          <img
            className="h-12 cursor-pointer mr-3"
            src={logo}
            alt="logo"
          />
            <p
            className="uppercase 
            text-3xl font-bold text-orange-800"
            >BookLover</p>
        </div>

        {/* ---------------------------------------------- */}
        <div>
          <ul className="flex space-x-10">
            {/* HOME  */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold
        text-orange-400 border-b-[3px] border-b-transparent
        ${pathMatchRoute("/") && "text-orange-600 border-b-orange-500"} `}
              onClick={() => navigate("/")}
            >
              Home
            </li>

            {/* FEEDBACK  */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold
        text-orange-400 border-b-[3px] border-b-transparent
        ${pathMatchRoute("/feedback") && "text-orange-600 border-b-orange-500"}`}
              onClick={() => navigate("/feedback")}
            >
              Feedback
            </li>

            {/* SIGN IN  */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold
        text-orange-400 border-b-[3px] border-b-transparent`}
              onClick={() => navigate("/profile")}
            >
              {pageStatus}
            </li>

          </ul>
        </div>
      </header>
    </div>
  );
}
