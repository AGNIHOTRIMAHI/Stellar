import React from 'react'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import { Route, Routes } from 'react-router'
import Moviepage from './pages/Moviepage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { useEffect } from "react";
import {Toaster} from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import AIRecommendations from "./pages/AIRecommendations";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";


const App = () => {
   const {fetchUser, fetchingUser} = useAuthStore();
   
    useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if(fetchingUser){
    return <p className="text-[#be21cd]">Loading...</p>
  }

  return (
    <div>
      <Toaster/>
      <Navbar />
      
      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/movie/:id"} element={<Moviepage />} />
        <Route path={"/signin"} element={<SignIn />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/ai-recommendations"} element={<AIRecommendations />} />
        <Route path="/book/:movieId" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </div>
  )
}

export default App
