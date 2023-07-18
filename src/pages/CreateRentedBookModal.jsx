import ReactDOM from "react-dom";
import { useEffect } from "react";

export default function CreateRentedBookModal({ onClose, children, actionBar }) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return ReactDOM.createPortal(
    <div>
      <div
        // onClick={onClose}
        className="fixed inset-0 bg-gray-300 opacity-80 z-50"
      ></div>

      <div className="fixed inset-5 md:inset-[100px] p-10 
      bg-white overflow-hidden z-50 max-w-6xl">
        <div className="flex flex-col justify-start h-full">
          <div className="flex justify-end">{actionBar}</div>
          {children}
        </div>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
}

