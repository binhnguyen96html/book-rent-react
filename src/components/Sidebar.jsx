import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { GoHomeFill } from "react-icons/go";
import {  BiBookReader, BiLogOut,BiCategoryAlt } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { BsArrowLeftCircle } from "react-icons/bs";

export default function Sidebar() {
  const [imgShow, setImgShow] = useState('');
  const [nameDisplay, setNameDisplay] = useState('');

  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const auth = getAuth();


useEffect(()=>{
  onAuthStateChanged(auth, (user) => {
    if(user && auth.currentUser.photoURL !== null){
      setImgShow(auth.currentUser.photoURL);
      setNameDisplay(auth.currentUser.displayName);
    }else{
      setImgShow('https://tse3.mm.bing.net/th?id=OIP.JZBTJtNF8UwcrOQhh-UgogAAAA&pid=Api&P=0&h=180');
      setNameDisplay('');
    }
  })
},[auth])



  const onLogOut = () => {
    if(window.confirm("Do you want to sign out?")){
      auth.signOut();
      navigate('/sign-in');
    }
  }

  const Menus = [
    { title: "Home", src: <GoHomeFill />, pathName: '/', function: ()=>navigate('/') },
    { title: "Book Store", src: <BiCategoryAlt />, pathName: '/book-store', function: ()=>navigate('/book-store')  },
    { title: "Client", src: <BiBookReader />, pathName: '/client-manage', function: ()=>navigate('/client-manage')  },
    { title: "Profile", src: <CgProfile />, gap: true, pathName: '/profile', function: ()=>navigate('/profile')  },
    { title: "Logout", src: <BiLogOut />, pathName: '/sign-out', function: onLogOut   },
  ];




  return (
    <>
        <div
          className={` ${
            open ? "w-72" : "w-20"
          } bg-orange-200
          p-5
          min-h-screen
          relative
          duration-300`}
        >
          <BsArrowLeftCircle
            className={`absolute cursor-pointer -right-3 top-14 
            text-3xl text-white bg-orange-900 rounded-full
            border-orange-800 border-2
            ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />

          {/* PROFILE PHOTO */}
          {open && (
            <div
              className="mb-12 mt-6 flex flex-col
              items-center justify-between
              transition duration-300 "
            >
              <div className="mb-6 border w-32 h-32 rounded-full">
                <img
                  className="rounded-full w-32 h-32"
                  src={imgShow}
                  // src={`${imgShow || ""}`}
                  // src={auth.currentUser.photoURL}
                //   src="https://images.unsplash.com/photo-1687809200615-a35f5668696f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
                  alt="avatar"
                />
              </div>
              <p className="font-semibold text-sm text-slate-800">
                {/* {auth.currentUser.displayName} */}
                {nameDisplay}
                </p>
            </div>
          )}

          <div>
            <ul className="pt-6">
                {Menus.map((menu, index) => (
                    <li
                    key={index}
                    className={`flex items-center rounded-md p-2 gap-x-4
                    cursor-pointer hover:bg-orange-300
                    text-md text-orange-800
                    ${(location.pathname === menu.pathName) && 'bg-orange-300'}
                    ${menu.gap ? 'mt-9' : 'mt-2'} `}
                    onClick={menu.function}
                    >
                        {menu.src}
                        <span className={`${!open && 'hidden'} origin-left duration-200`}>
                            {menu.title}
                        </span>
                    </li>
                ))}
            </ul>
          </div>
        </div>
    </>
  );
}
