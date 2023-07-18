import Moment from "react-moment";
import { Link } from "react-router-dom";
import { PiTrashSimpleThin } from "react-icons/pi";
import { CiEdit } from "react-icons/ci";

export default function BookItem({ book, id, onDelete, onEdit }) {

  return (
    <li
      className="relative bg-white 
    flex flex-col  items-center
    shadow-md hover:shadow-xl rounded-md overflow-hidden
    transition-shadow duration-150 m-[15px]"
    >
      <Link className="contents" 
      to={`/category/${book.category}/${id}`}>
        <img
          className="h-[200px] w-full object-cover
        hover:scale-105 transition-scale
        duration-200 ease-in-out"
          loading="lazy"
          src={book.imgUrls[book.imgUrls.length-1]}
        />
        {book.offer && (
          <div
            className="absolute bg-[#E76161]
            text-white uppercase text-xs font-semibold
            px-10 py-1 shadow-lg
            -rotate-45 -left-7 top-3"
          >
            Sale
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        <div
          className="w-full mt-5 
        flex flex-col items-center"
        >
          <p
            className="font-semibold
          text-center text-sm px-2 
          max-h-[40px] min-h-[40px]
          w-[95%]
          text-ellipsis overflow-hidden"
          >
            {book.name}
          </p>

          <p className={`text-[#E76161] text-sm mt-2 font-semibold`}>
            $ {book.offer ? book.discountedPrice : book.regularPrice} / week
          </p>

          <p className="text-xs mb-10 mt-2  ">
            available
            <Moment className="ml-1 text-[#454545]" fromNow>
              {book.timestamp?.toDate()}
            </Moment>
          </p>
        </div>
      </Link>

      {/* -------------------------------------------------------------- */}

      {onDelete && (
        <PiTrashSimpleThin
          className="absolute bottom-2 right-2 
         cursor-pointer"
         onClick={()=>onDelete(book.id)}
        />
      )}

      {onEdit && (
        <CiEdit
          className="absolute bottom-2 right-8
        cursor-pointer"
        onClick={()=>onEdit(book.id)}
        />
      )}
    </li>
  );
}
