import { useState } from "react";
import { GrLinkTop } from "react-icons/gr";

export default function ScrollToTopButton() {
  const [showed, setShowed] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


window.onscroll = function (){
    if(window.pageYOffset >= 10){
        setShowed(true);
    }else{
        setShowed(false);
    }
}

  return (
    <>
      {showed && (
        <div
          className="fixed bottom-[5%] left-[90%]
          transition duration-150 ease-linear"
          onClick={handleScrollToTop}
        >
          <GrLinkTop
            className="text-5xl 
            border px-3
            bg-gray-100 rounded-full"
          />
        </div>
      )}
    </>
  );
}
