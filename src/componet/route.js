import React from "react";
import { useNavigate } from "react-router-dom";

function Route() {
  const navigate = useNavigate();
  const handleRoute = (route, id) => {
    localStorage.setItem("route", route);
    localStorage.setItem("routeId", id);
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
        <div
          className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 text-center"
          onClick={() => handleRoute("દેવળીયા", "66baef03ca76caa6b46215f5")}
        >
          દેવળીયા
        </div>
        <div
          className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 text-center"
          onClick={() => handleRoute("ચીતલ", "66baef17ca76caa6b46215f7")}
        >
          ચીતલ
        </div>
        <div
          className="bg-red-500 text-white p-6 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 text-center"
          onClick={() => handleRoute("સાણથલી", "66baef22ca76caa6b46215f9")}
        >
          સાણથલી
        </div>
        <div
          className="bg-purple-500 text-white p-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 text-center"
          onClick={() => handleRoute("થોરખાણ", "66baef33ca76caa6b46215fb")}
        >
          થોરખાણ
        </div>
      </div>
    </div>
  );
}

export default Route;
