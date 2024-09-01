import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Bus from "./../img/image 4.png";
import { ReactComponent as Vector } from "./../svg/Vector.svg";
import { setDate } from "../Slice/redux";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

function Route() {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const token = localStorage.getItem("authToken");
  const decoded = jwtDecode(token);
  console.log(decoded);
  const handleRoute = (route, id) => {
    localStorage.setItem("route", route);
    localStorage.setItem("routeId", id);
    navigate("/home");
  };
useEffect(()=>{
  dispatch(setDate());
}


)
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between  h-screen">
    <div className="w-full lg:w-1/3 mb-6 lg:mb-0 flex-shrink-0">
      <img src={Bus} alt="Bus" className="w-full h-auto" />
    </div>
    <div className="flex flex-col items-center justify-center w-full lg:w-1/3 flex-grow">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
        {decoded.email === "devaliya" || decoded.email === "vinay" ? (
          <>
            <div
              className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 text-center cursor-pointer"
              onClick={() => handleRoute("દેવળીયા", "66baef03ca76caa6b46215f5")}
            >
              દેવળીયા લાઇન
            </div>
            <div
              className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 text-center cursor-pointer"
              onClick={() => handleRoute("ચીતલ", "66baef17ca76caa6b46215f7")}
            >
              ચીતલ લાઇન
            </div>
            <div
              className="bg-purple-500 text-white p-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 text-center cursor-pointer"
              onClick={() => handleRoute("થોરખાણ", "66baef33ca76caa6b46215fb")}
            >
              થોરખાણ લાઇન
            </div>
          </>
        ) : null}
        {decoded.email === "divu" || decoded.email === "vinay" ? (
          <div
            className="bg-red-500 text-white p-6 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 text-center cursor-pointer"
            onClick={() => handleRoute("સાણથલી", "66baef22ca76caa6b46215f9")}
          >
            સાણથલી લાઇન
          </div>
        ) : null}
      </div>
    </div>
    <div className="w-full lg:w-1/3 mt-6 lg:mt-0 flex-shrink-0">
      <Vector />
    </div>
  </div>
  
  );
}

export default Route;
