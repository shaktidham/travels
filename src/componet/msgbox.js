import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setMsgdata } from "../Slice/redux";
// import { ReactComponent as Edit } from "../svg/edit.svg";

function Msgbox({
  handleSendWhatsApp,
  msgbox,
  showQuestionsss,
  data,
  setData,
  totalsit,
  msgmdata,
  busdetails,
  setAllsitprice,
  setAllbooksit,
}) {
  const dispatch = useDispatch();
  const [price, setPrice] = useState();
  const [cabinprice, setCabinprice] = useState();
  const [sit, setSit] = useState();
  const [cabin, setCabin] = useState();
  const convertTo12HourFormat = (time24) => {
    const [hours, minutes] = time24.split(":").map(Number);
    let period = "AM";
    let hours12 = hours;

    if (hours >= 12) {
      period = "PM";
      if (hours > 12) {
        hours12 = hours - 12;
      }
    } else if (hours === 0) {
      hours12 = 12;
    }

    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "time") {
      // Convert time to 12-hour format before updating state
      const convertedTime = convertTo12HourFormat(value);
      setData((prevData) => ({
        ...prevData,
        [name]: convertedTime,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (totalsit?.data) {
      totalsit.data.forEach((item) => {
        if (msgmdata.vilage === item.village && msgmdata.name === item.name) {
          const uniqueSeats = Array.from(
            new Set(item.seatNumbersArray?.join("/").split("/"))
          );
          setAllbooksit(uniqueSeats.join("/"));
          setSit(item.seatCount);
          setCabin(item?.cabinCount);
        }
      });
    }
    setPrice(0);
    if (busdetails?.data) {
      busdetails.data.forEach((item) => {
        setPrice(item.price);
        setCabinprice(item.kabinprice ? item.kabinprice : 0);
      });
    }
  }, [msgmdata, totalsit, busdetails]);

  return (
    <div>
      {msgbox && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50 z-100">
          <div className="bg-white w-3/4 md:w-1/2 xl:w-1/3 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between">
              <div className="font-bold text-xl"></div>
              <div className="cursor-pointer" onClick={showQuestionsss}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  height="35px"
                  width="35px"
                >
                  <path
                    fill="#64748B"
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
                  />
                </svg>
              </div>
            </div>
            <form onSubmit={handleSendWhatsApp}>
              <label
                htmlFor="pickup"
                className="text-left text-gray-700 font-bold block"
              >
                ક્યાંથી બેસવાનું:
              </label>
              <input
                type="text"
                id="pickup"
                name="pickup"
                onChange={handleChange}
                value={data.pickup}
                placeholder="Enter your pickup point"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <label
                htmlFor="sitnumber"
                className="text-left text-gray-700 font-bold block mt-4"
              >
                સીટ નંબર
              </label>
              <input
                type="text"
                id="sitnumber"
                name="sitnumber"
                onChange={handleChange}
                value={data.sitnumber}
                placeholder="Enter sitnumber"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <label
                htmlFor="location"
                className="text-left text-gray-700 font-bold block mt-4"
              >
                રકમ
              </label>
              <input
                type="number"
                id="price"
                name="price"
                onChange={handleChange}
                value={data.price}
                placeholder="Enter price"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <label
                htmlFor="date"
                className="text-left text-gray-700 font-bold block mt-4"
              >
                સમય
              </label>
              <input
                type="time"
                id="time"
                name="time"
                onChange={handleChange}
                placeholder="Enter time"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 mt-1"
                // required
              />
              <div className="flex space-x-2 mt-3">
                <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Msgbox;
