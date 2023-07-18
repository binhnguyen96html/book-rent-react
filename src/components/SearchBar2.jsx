import { MdClear } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";


export default function SearchBar2({ placeholder, data2, children }) {
  const [wordEntered, setWordEntered] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const handleFilter = (e) => {
    const searchWord = e.target.value;
    setWordEntered(searchWord);

    const newFilter = data2.filter((value) => {
      return value.data.name.toLowerCase().includes(searchWord.toLowerCase());
    })
    

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  
  return (
    <div className="relative w-[50%] ">
      <input
        className="block pl-2.5 pb-2.5 pt-4 pr-[50px] w-full
        text-sm text-slate-900 
      border-0 border-b-2 border-gray-300
      appearance-none dark:text-white 
      dark:border-gray-600 dark:focus:border-gray-600 
      focus:outline-none focus:ring-0 
      focus:border-gray-800 peer"
        id="searchBook"
        type="text"
        // placeholder={placeholder}
        placeholder=" "
        value={wordEntered}
        onChange={handleFilter}
      />
      <label
        className="absolute text-sm text-gray-400 italic
    bg-transparent
    dark:text-gray-500 duration-300 
    transform -translate-y-4 scale-75 
    top-2 z-10 origin-[0] bg-white 
    dark:bg-gray-900 px-2 
    peer-focus:px-0 
    peer-focus:text-orange-700 
    peer-focus:dark:text-orange-500 
    peer-placeholder-shown:scale-100 
    peer-placeholder-shown:-translate-y-1/2 
    peer-placeholder-shown:top-1/2 
    peer-focus:top-2 
    peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        htmlFor="searchBook"
      >
        {children}
      </label>

      {wordEntered != 0 && (
        <MdClear
          className="absolute top-5 right-[10px]
        cursor-pointer"
          onClick={clearInput}
        />
      )}


{/* use for search book coz Link link is customize, I dont know how to do it  */}
      {filteredData.length != 0 && (
        <div
          className="mt-1 w-full px-2 py-2
        bg-white shadow-lg 
        overflow-hidden overflow-y-auto
        text-sm"
        >
          {filteredData.slice(0, 5).map((value, key) => {
            return (
              <Link key={key} to={`/client-manage/${value.id}`}>
                <p
                  className="mt-2 truncate
              cursor-pointer hover:font-semibold"
                >
                  {value.data.name}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
