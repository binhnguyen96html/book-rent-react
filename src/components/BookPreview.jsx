import React from "react";
import { Link } from "react-router-dom";

export default function BookPreview({ book, id }) {
  return (
    <li
      className=" m-3 mt-6 mb-6 p-3
    rounded-lg shadow-md "
    >
      <Link 
      className="contents"
      to={`/category/${book.type}/${id}`}
      >
        {/* ava, bookName, author  */}
        <div className="flex  h-[80px]">
          <img
            className="w-10 h-10 rounded-full"
            src={book.imgUrls[book.imgUrls.length - 1]}
            alt="avatar"
          />

          <div className="ml-2">
            <p className="text-sm font-semibold">{book.name}</p>
            <p className="text-sm text-gray-500">{book.author}</p>
          </div>
        </div>

        {/* image  */}

        <img
          className="h-[200px] w-full object-contain
        hover:scale-105 transition-scale
        duration-200 ease-in-out"
          loading="lazy"
          src={book.imgUrls[book.imgUrls.length - 1]}
        />

        {/* description  */}
        <p
          className="line-clamp-3 mt-6
      text-sm leading-7"
        >
          {book.bookDescription}
        </p>
      </Link>
    </li>
  );
}
