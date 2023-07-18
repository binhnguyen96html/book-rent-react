import React, { useEffect, useState } from "react";

export default function Contact({ book }) {
  const [message, setMessage] = useState("");

const onChange = (e) =>{
    setMessage(e.target.value);
}

  useEffect(() => {});
  return (
    <div>
      <p
        className="mt-3
      text-sm"
      >
        Contact Admin for the
        <span className="text-slate-600 italic ml-1">
          {book.name.toLowerCase()}
        </span>
      </p>
      <textarea
        className="w-full px-4 py-2 mt-3
        text-sm text-gray-700 
        bg-white border border-gray-300 rounded
        transition duration-150 ease-in-out
        focus:text-gray-700 focus:bg-white 
        focus:border-slate-600"
        name="message"
        id="message"
        value={message}
        rows="2"
        onChange={onChange}
      ></textarea>

      <a
        href={`mailto:admin@gmail.com
        ?Subject=${book.name}
        &body=${message}`}
      >
        <button
          className="px-2 py-2
            bg-orange-300 font-medium text-xs text-center
                rounded  shadow-md 
                hover:bg-orange-400 hover:shadow-lg
                focus:bg-orange-400 focus:shadow-lg
                transition duration-150 ease-in-out"
        >
          Send
        </button>
      </a>
    </div>
  );
}
