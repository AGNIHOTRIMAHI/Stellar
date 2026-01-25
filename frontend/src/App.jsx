// import React from 'react'
// import Navbar from './components/Navbar'
// import Homepage from './pages/Homepage'
// import { Route, Routes } from 'react-router'
// import Moviepage from './pages/Moviepage'
// import SignIn from './pages/SignIn'
// import SignUp from './pages/SignUp'
// import { useEffect } from "react";
// import {Toaster} from "react-hot-toast";
// import { useAuthStore } from "./store/authStore";
// import AIRecommendations from "./pages/AIRecommendations";
// const App = () => {
//    const {fetchUser, fetchingUser} = useAuthStore();
   
//     useEffect(() => {
//     fetchUser()
//   }, [fetchUser])

//   if(fetchingUser){
//     return <p className="text-[#be21cd]">Loading...</p>
//   }

//   return (
//     <div>
//       <Toaster/>
//       <Navbar />
      
//       <Routes>
//         <Route path={"/"} element={<Homepage />} />
//         <Route path={"/movie/:id"} element={<Moviepage />} />
//         <Route path={"/signin"} element={<SignIn />} />
//         <Route path={"/signup"} element={<SignUp />} />
//         <Route path={"/ai-recommendations"} element={<AIRecommendations />} />
//       </Routes>
//     </div>
//   )
// }

// export default App

import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Moviepage from "./pages/Moviepage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AIRecommendations from "./pages/AIRecommendations";

import { useAuthStore } from "./store/authStore";

// Admin imports
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminMovies from "./admin/pages/AdminMovies";
import AdminUpload from "./admin/pages/AdminUpload";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminEditMovie from "./admin/pages/AdminEditMovie";


const App = () => {
  const { fetchUser, fetchingUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (fetchingUser) {
    return <p className="text-[#be21cd]">Loading...</p>;
  }

  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="movies/:id/edit" element={<AdminEditMovie />} />
          <Route path="upload" element={<AdminUpload />} />

        </Route>

        <Route
          path="/*"
          element={
            <div>
              <Navbar />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/movie/:id" element={<Moviepage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/ai-recommendations" element={<AIRecommendations />} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;
