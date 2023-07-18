import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";

import { useEffect, useState } from "react";
import { collection, orderBy, query, getDocs, limit } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router";

import c1 from '../photo/cover/c1.png';
import c2 from '../photo/cover/c2.png';
import c3 from '../photo/cover/c3.png';
import c4 from '../photo/cover/c4.png';
import c5 from '../photo/cover/c5.png';
import c6 from '../photo/cover/c6.png';


export default function Slider() {
  const [bookList, setBookList] = useState(null);
  const [loading, setLoading] = useState(true);

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  const navigate = useNavigate();

  const photoCover = [c1,c2,c3,c4,c5,c6]

  useEffect(() => {
    const fetchBookList = async () => {
      const bookListRef = collection(db, "bookList");
      const q = query(bookListRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let list = [];
      querySnap.forEach((doc) => {
        return list.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setBookList(list);
      setLoading(false);
      // console.log("slider:", list[0].data.imgUrls[0]);
    };
    fetchBookList();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (bookList.length === 0) {
    return <></>;
  }

  return (
    bookList && (

    <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {/* {bookList.map(({ data, id }) => (
            <SwiperSlide key={id}>
              <div
                className="h-[300px] 
                overflow-hidden border border-red-200"
                style={{
                  background: `url(${data.imgUrls[data.imgUrls.length-1]}) 
                center`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))} */}

{photoCover.map((photo, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[300px] 
                overflow-hidden border border-red-200"
                style={{
                  background: `url(${photo}) center`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}

        </Swiper>
    </>
    )
  );
}
