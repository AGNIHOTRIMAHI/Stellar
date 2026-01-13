import React, { useEffect , useState} from 'react'
import HeroBg from '../assets/herobg2.jpg'
import { Bookmark, Play } from 'lucide-react'
import { Link } from 'react-router';

const Hero = () => {
  const [movie, setMovie] = useState(null);
  const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NjkzNTQ3Y2EwZTRjMDZiZGFjM2I0MWIxMzVkMjQ2ZCIsIm5iZiI6MTc2ODE1ODUxMi4wMiwic3ViIjoiNjk2M2Y1MzA2MzcxMmRiMWQ0OTBkMTkxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.TwbgPEkR1KYwKlu38XRpc6zhLpvEoKw3ipDWcKORoLQ'
  }
};

useEffect(() => {
fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
  .then(res => res.json())
  .then(res => {
    if(res.results && res.results.length > 0){
      const randomIndex=Math.floor(Math.random() * res.results.length);
      setMovie(res.results[randomIndex])
    }
  })
  .catch(err => console.error(err));
}, []);

if(!movie){
  return <p>Loading...</p>
}

  return (
    <div className="text-white relative">

      <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} alt="bg-img" className="w-full rounded-2xl h-[480px] object-center object-cover" /> 
      <div className='flex space-x-2 md:space-x-4 absolute bottom-3 left-4 md:bottom-8 md:left-10 font-medium'>
        <button className="flex justify-center items-center bg-white hover:bg-gray-200 text-[#5b21b6] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base"><Bookmark className="mr-2 w-4 h-5 md:w-5 md:h-5"/>Save for Later</button>
        <Link to={`/movie/${movie.id}`}>
        <button className="flex justify-center items-center text-white hover:bg-gray-200 bg-[#5b21b6] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base"><Play className="mr-2 w-4 h-5 md:w-5 md:h-5"/>Watch Now</button>
        </Link>
      </div>
    </div>
  )
}

export default Hero
