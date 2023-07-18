import ReactDOM from "react-dom";
import { useEffect } from "react";

export default function Modal({ onClose, children, actionBar }) {
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
        className="fixed inset-0 bg-gray-300 opacity-80"
      ></div>

      <div className="fixed inset-16 md:inset-[200px] p-10 bg-white overflow-hidden">
        <div className="flex flex-col justify-start h-full">
          <div className="flex justify-end">{actionBar}</div>
          {children}
        </div>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
}