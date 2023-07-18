
import Moment from "react-moment";
import { Link } from "react-router-dom";

export default function ClientShow({ client,id, onDelete, onEdit }) {
  return (
    <li
      className="m-3 pl-3 relative
     rounded shadow border border-slate-100
     hover:bg-slate-50 
     transition duration-150 ease-in-out"
    >
      <Link
      to={`/client-manage/${id}`}
      >
        <div className="flex items-center ">
          {/* image  */}
          <img
            className="w-10 h-full
            rounded-full"
            src={client.imgUrls}
            alt="avatar"
          />

          <div className="ml-3 p-3 w-full">
            <div className="flex items-center">
              {/* name  */}
              <h1
                className="font-semibold text-orange-700
          first-letter:uppercase"
              >
                {client.name}
              </h1>

              {/* timeCreated  */}
              <p
                className="mt-1 ml-2 italic
              text-xs text-gray-400
          first-letter:uppercase"
              >
                <Moment format="YYYY-MM-DD HH:mm:ss">
                  {client.timestamp?.toDate()}
                </Moment>
              </p>
            </div>

            {/* phone number  */}
            <p
              className="mt-1
            font-semibold text-sm text-gray-400"
            >
              {client.phoneNumber}
            </p>

            {/* content  */}
            <p
              className="mt-1 text-sm leading-6
          first-letter:uppercase"
            >
              {client.birthData}
            </p>
          </div>
        </div>
      </Link>

    </li>
  );
}
