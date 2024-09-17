// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Bus from "./../img/image 4.png";
// import { ReactComponent as Vector } from "./../svg/Vector.svg";
// import { setDate } from "../Slice/redux";
// import { useDispatch } from "react-redux";
// import { jwtDecode } from "jwt-decode";

// function Route() {
//   const navigate = useNavigate();
//   const dispatch=useDispatch();
//   const token = localStorage.getItem("authToken");
//   const decoded = jwtDecode(token);
//   console.log(decoded);
//   const handleRoute = (route, id) => {
//     localStorage.setItem("route", route);
//     localStorage.setItem("routeId", id);
//     navigate("/home");
//   };
// useEffect(()=>{
//   dispatch(setDate());
// }

// )
//   return (
//     <div className="flex flex-col lg:flex-row items-center justify-between  h-screen">
//     <div className="w-full lg:w-1/3 mb-6 lg:mb-0 flex-shrink-0">
//       <img src={Bus} alt="Bus" className="w-full h-auto" />
//     </div>
//     <div className="flex flex-col items-center justify-center w-full lg:w-1/3 flex-grow">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full">
//         {decoded.email === "devaliya" || decoded.email === "vinay" ? (
//           <>
//             <div
//               className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 text-center cursor-pointer"
//               onClick={() => handleRoute("દેવળીયા", "66baef03ca76caa6b46215f5")}
//             >
//               દેવળીયા લાઇન
//             </div>
//             <div
//               className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 text-center cursor-pointer"
//               onClick={() => handleRoute("ચીતલ", "66baef17ca76caa6b46215f7")}
//             >
//               ચીતલ લાઇન
//             </div>
//             <div
//               className="bg-purple-500 text-white p-6 rounded-lg shadow-lg hover:bg-purple-600 transition duration-300 text-center cursor-pointer"
//               onClick={() => handleRoute("થોરખાણ", "66baef33ca76caa6b46215fb")}
//             >
//               થોરખાણ લાઇન
//             </div>
//           </>
//         ) : null}
//         {decoded.email === "divu" || decoded.email === "vinay" ? (
//           <div
//             className="bg-red-500 text-white p-6 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 text-center cursor-pointer"
//             onClick={() => handleRoute("સાણથલી", "66baef22ca76caa6b46215f9")}
//           >
//             સાણથલી લાઇન
//           </div>
//         ) : null}
//       </div>
//     </div>
//     <div className="w-full lg:w-1/3 mt-6 lg:mt-0 flex-shrink-0">
//       <Vector />
//     </div>
//   </div>

//   );
// }

// export default Route;

import React, { useCallback, useEffect, useState } from "react";
import Bus from "./../img/image 4.png";
import { ReactComponent as Vector } from "./../svg/Vector.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDate, setRootId, setRootName } from "../Slice/redux";

function Route() {
  const [formData, setFormData] = useState({
    village: "",
    date: "",
  });
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const api = "https://shaktidham-backend.vercel.app/route/searchbyvillage";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      // dispatch(setDate(formData?.date));
      try {
        const response = await fetch(
          `${api}?Date=${formData.date}&village=${formData.village}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);

        // navigate("/home"); // Uncomment if you want to navigate
      } catch (error) {
        console.error("Fetch operation error:", error);
      }
    },
    [api, formData, navigate] // Include formData as dependency to ensure it's up-to-date
  );
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between h-screen bg-gray-50">
      <div className="w-full lg:w-1/3 mb-6 lg:mb-0 flex-shrink-0">
        <img
          src={Bus}
          alt="Bus"
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      </div>

      <div className="w-full lg:w-2/3 p-4">
        {!data ? (
          <div className="max-w-md mx-auto my-8 p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
            <Link to="/rootadd">
              <button className="w-full mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Admin Login
              </button>
            </Link>
            <h2 className="text-2xl font-bold mb-4">Bus Booking</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="village"
                  className="block text-sm font-medium text-gray-700"
                >
                  Destination City
                </label>
                <input
                  type="text"
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Travel Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Book Now
              </button>
            </form>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {data.map((item, index) => (
              <div>
                <table className="min-w-full divide-y divide-gray-200 bg-white border border-gray-200 rounded-lg mb-10 shadow-md">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bus Name
                      </th>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Shaktidham Travels
                      </td>
                    </tr>
                    <tr>
                      {" "}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bus Route
                      </th>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.route || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Departure Time
                      </th>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.departureTime || "5:00"}
                      </td>
                    </tr>
                    <tr>
                      {" "}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price || "600"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/3 mt-6 lg:mt-0 flex-shrink-0">
        <Vector />
      </div>
    </div>
  );
}

export default Route;
