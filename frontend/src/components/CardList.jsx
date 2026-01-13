import React, { useEffect, useState } from 'react'
import CardImg from "../assets/cardimg.jpg"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {Link} from "react-router";


const CardList = ({title, category}) => {
    const [data, setData] = useState([]);
    const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NjkzNTQ3Y2EwZTRjMDZiZGFjM2I0MWIxMzVkMjQ2ZCIsIm5iZiI6MTc2ODE1ODUxMi4wMiwic3ViIjoiNjk2M2Y1MzA2MzcxMmRiMWQ0OTBkMTkxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.TwbgPEkR1KYwKlu38XRpc6zhLpvEoKw3ipDWcKORoLQ'
  }
};

useEffect(() => {fetch(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`, options)
  .then(res => res.json())
  .then(res => setData(res.results || []))
  .catch(err => console.error(err));}, [])


  return (
    <div className="text-white md:px-4">
      <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>


      <Swiper slidesPerView={"auto"} spaceBetween={10} className="mySwiper">
          {data.map((item, index) => (
            <SwiperSlide key={index} className="max-w-72">
                <Link to={`/movie/${item.id}`}>
                <img src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`} alt="" className="h-44 w-full object-center object-cover rounded" />
                <p className="text-center pt-2">{item.original_title}</p>
                </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default CardList
