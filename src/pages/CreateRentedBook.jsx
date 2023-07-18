import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import { addDoc, serverTimestamp,collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";


export default function CreateRentedBook() {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        startDate: '',
        endDate:'',
    });
    const {name, number, startDate, endDate} = formData;

    const onChange = (e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async(e) =>{
        e.preventDefault();

        // create formDataCopy 
        const formDataCopy = {
            ...formData,
            timestamp: serverTimestamp(),
        }

        const docRef = await addDoc(collection(db, 'rentedBooks'), formDataCopy);

        setLoading(false);
        toast.success('A new rented book created!');
        // navigate('/');
    }


    if(loading){
        return <Spinner />;
    }

  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />

        <section
          className="border border-gray-200 shadow-lg
    w-full bg-white
    m-8 px-12 pt-6"
        >
          <h1
            className="text-3xl text-center text-orange-900
        mt-6 font-bold"
          >
            New Rented Book
          </h1>

          {/* FORM --------------------------------------------------------------- */}
          <form
          onSubmit={onSubmit}
          >
            {/* NAME  */}
            <div className="mt-6 p-2">
              <span
                className="mr-6 after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700  whitespace-nowrap"
              >
                Book Name:
              </span>
              <input
                className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                type="text"
                id="name"
                value={name}
                placeholder="Book Name"
                required
                  onChange={onChange}
              />
            </div>

            {/* Number of book  */}
            <div className="mt-6 p-2">
              <span
                className="mr-6 after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700  whitespace-nowrap"
              >
                Number of Book:
              </span>
              <input
                className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                type="number"
                id="number"
                  value={number}
                placeholder="Number of Book"
                required
                  onChange={onChange}
              />
            </div>

            {/* ---------------------------------------- */}
            {/* Start  and End */}
            <div className="grid grid-cols-2 mt-3">
              {/* start  */}
              <div className="w-full p-2">
                <span
                  className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
                >
                  Start:
                </span>
                <input
                  className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                  type="date"
                  id="startDate"
                  value={startDate}
                  required
                  onChange={onChange}
                />
              </div>

              {/* end  */}
              <div className="w-full p-2">
                <span
                  className="after:content-['*'] after:ml-0.5 after:text-red-500 
          block text-sm font-medium text-slate-700 whitespace-nowrap"
                >
                  End:
                </span>
                <input
                  className="mt-1 px-3 py-2 bg-white border shadow-sm 
          border-slate-300 placeholder-slate-400 
          focus:outline-none focus:border-orange-700 
          focus:ring-orange-700 block w-full rounded-md sm:text-sm focus:ring-1"
                  type="date"
                  id="endDate"
                  value={endDate}
                  required
                  onChange={onChange}
                />
              </div>
            </div>

            {/* ---------------------------------------- */}

            {/* SUBMIT BUTTON  */}
            <button
              type="submit"
              className="flex mx-auto
              px-7 py-3 mt-12
        bg-orange-200 uppercase
        font-medium font-sm text-sm
        border-none rounded shadow-md
        hover:bg-orange-300 hover:shadow-lg
        focus:bg-orange-300 focus:shadow-lg
        transition duration-150 ease-in-out"
            >
              Create
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
