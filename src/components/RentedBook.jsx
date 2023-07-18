import { PiTrashSimpleThin } from "react-icons/pi";


export default function RentedBook({ rentedBook, onDelete }) {
  return (
    <li
      className="m-3 p-3 relative
    rounded shadow"
    >
      <div >
        {/* BOOK NAME    */}
        <p className="text-sm">
          <span
            className="first-letter:uppercase mr-2
           text-orange-700"
          >
            Book Name:
          </span>
          {rentedBook.nameBook}
        </p>

        {/* NUMBER OF BOOKS  */}
        <p className="text-sm">
          <span
            className="first-letter:uppercase mr-2
           text-orange-700"
          >
            Number of Books:
          </span>
          {rentedBook.number}
        </p>

        {/* START DATE  */}
        <p className="text-sm">
          <span
            className="first-letter:uppercase mr-2
          text-orange-700"
          >
            Start Date:
          </span>
          {rentedBook.startDate}
        </p>

        {/* END DATE */}
        <p className="text-sm">
          <span
            className="first-letter:uppercase mr-2
           text-orange-700"
          >
            End Date:
          </span>
          {rentedBook.endDate}
        </p>
      </div>

      {onDelete && (
        <PiTrashSimpleThin
          className="absolute top-2 right-2
        cursor-pointer hover:text-orange-700
        transition duration-150 ease-in-out"
          onClick={() => onDelete(rentedBook.id)}
        />
      )}

    </li>
  );
}
