import { useState } from "react";
import { PiTrashSimpleThin } from "react-icons/pi";
import Moment from "react-moment";

export default function FeedBackPage({ feedBack, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li
      className="m-3 pl-3 relative
     rounded shadow"
    >
      <div className="flex items-center ">
        {/* image  */}
        <img
          className="w-10 h-10 rounded-full"
          src={feedBack.avatar}
          alt="avatar"
        />

        <div className="ml-3 p-3 w-full">
          <div className="flex items-center">
            {/* title  */}
            <h1
              className="font-semibold text-orange-700
          first-letter:uppercase"
            >
              {feedBack.title}
            </h1>

            {/* timeCreated  */}
            <p
              className="mt-1 ml-2 italic
              text-xs text-gray-400
          first-letter:uppercase"
            >
              <Moment format="YYYY-MM-DD HH:mm:ss">
                {feedBack.timestamp?.toDate()}
              </Moment>
            </p>
          </div>

          {/* name  */}
          <p
            className="font-semibold text-sm text-gray-500
          first-letter:uppercase"
          >
            {feedBack.name}
          </p>

          {/* content  */}
          <p
            className={`mt-1 text-sm leading-6
          first-letter:uppercase
          ${!expanded ? "line-clamp-2" : ""}`}
          >
            {feedBack.content}
          </p>
          <p
            className="text-xs text-gray-400 cursor-pointer
          hover:text-gray-600 duration duration-150 ease-in-out"
            onClick={() => setExpanded(!expanded)}
          >
            {!expanded ? "See more" : "See less"}
          </p>
        </div>
      </div>

      {onDelete && (
        <PiTrashSimpleThin
          className="absolute top-2 right-2
        cursor-pointer hover:text-orange-700
        transition duration-150 ease-in-out"
          onClick={() => onDelete(feedBack.id)}
        />
      )}
    </li>
  );
}
