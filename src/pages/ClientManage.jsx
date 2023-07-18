import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ClientShow from "../components/ClientShow";
import SearchBar2 from "../components/SearchBar";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import ScrollToTopButton from "../components/ScrollToTopButton";


export default function ClientManage() {
  const [clientList, setClientList] = useState(null);
  const [loading, setLoading] = useState(true);

  //fetch clients' data
  useEffect(() => {
    const fetchClients = async () => {
      const clientList = collection(db, "clients");
      const docSnap = await getDocs(clientList);
      let list = [];
      docSnap.forEach((doc) => {
        return list.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setClientList(list);
      setLoading(false);
      console.log(list);
    };
    fetchClients();
  }, []);

  if (loading) {
    return <Spinner />;
  }


  return (
    <div className="bg-slate-50 max-w-6xl">
      <Header />

      <div className="w-full flex">
        <Sidebar />

          {/* SECTION  client list----------------------------------------- */}
          <section
            className=" m-6 p-6
           bg-white w-full shadow-lg"
          >
          {/* -------------------------------------------------------- */}
          <h1
                className="uppercase mb-6
              font-bold text-3xl text-[#4C4C6D]"
              >
                Client Management
              </h1>
          {/* -------------------------------------------------------- */}
          <div 
          className="flex justify-between items-center mr-5 mb-12">
            <SearchBar2 data2={clientList}>Search by Name</SearchBar2>
            <Link to='/create-client'>
            <Button>New Client</Button>
            </Link>
          </div>



            <div>
              {!loading && clientList.length > 0 && (
                <div>
                  <ul>
                    {clientList.map((doc) => (
                      <ClientShow key={doc.id} id={doc.id} client={doc.data} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          <ScrollToTopButton />

      </div>
    </div>
  );
}
