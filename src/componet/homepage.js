import React, { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { TextField, InputAdornment } from "@mui/material";
import { ReactComponent as Action } from "../svg/action.svg";
import { ReactComponent as Celender } from "../svg/celender.svg";
import { ReactComponent as Upboxuparrow } from "../svg/uparrow.svg";
import { Link, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useDispatch, useSelector } from "react-redux";
import { setDate, setSeatNumber, setPopbox } from "../Slice/redux";
import Bus from "./../img/image 4.png";
import { ReactComponent as Vector } from "../svg/Vector.svg";
import { ReactComponent as Back } from "../svg/back.svg";

import Showbusnumber from "./showbusnumber";
import Msgbox from "./msgbox";

const Homepage = () => {
  const [display, setDisplay] = useState(false);
  const [tooltipId, setTooltipId] = useState(null);
  const [sortdata, setSortdata] = useState([]);
  const tooltipRef = useRef(null);
  const [msgbox, setMsgbox] = useState(false);
  const [isloading, setIsloading] = useState(false); // Updated default state
  const [isDateSelected, setIsDateSelected] = useState(false); // New state for date selection
  const buttonRefs = useRef([]);
  const [allbooksits, setAllbooksit] = useState("");
  const [busdetails, setBusDetails] = useState([]);
  const [msgmdata, setMsgmdata] = useState([]);
  const [allsitprice, setAllsitprice] = useState();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    pickup: msgmdata.vilage,
    time: "",
    sitnumber: allbooksits,
    price: allsitprice,
  });
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      sitnumber: allbooksits,
      price: allsitprice,
      pickup: msgmdata.vilage,
    }));
  }, [allsitprice, allbooksits]);
  const [totalsit, setTotalsit] = useState([]);
  const Route = localStorage.getItem("route");
  const routeId = localStorage.getItem("routeId");
  const navigate = useNavigate();
  const [popbox, setPopbox] = useState(false);
  const inputs = useSelector((state) => state.inputs);
  const deleteapi = "https://shaktidham-backend.vercel.app/seats/delete/";
  const searchapi = "https://shaktidham-backend.vercel.app/seats/search";
  const busnumbersearchapi = "https://shaktidham-backend.vercel.app/bus/search";
  const allsit = "https://shaktidham-backend.vercel.app/seats/searchbyallseat";

  const handleClickOutside = useCallback((event) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target) &&
      buttonRefs.current.every((ref) => ref && !ref.contains(event.target))
    ) {
      setDisplay(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    if (inputs.Tablemanuplation.date) {
      handleDateChange(inputs.Tablemanuplation.date);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, inputs.Tablemanuplation.date]);

  const handleClicktd = useCallback(
    (id) => {
      setDisplay(!display);
      setTooltipId(id);
      dispatch(setSeatNumber(id));
    },
    [display, dispatch]
  );

  const getLabel = (index) => {
    const alphabet = "ABCDEFGHIJKL";
    if (index < 12) {
      return alphabet[index];
    } else if (index < 24) {
      const pairIndex = index - 12;
      const firstNumber = pairIndex * 2 + 1;
      const secondNumber = firstNumber + 1;
      return `${firstNumber},${secondNumber}`;
    } else {
      const kabinIndex = index - 24 + 1; // starting from 1
      return `કેબિન-${kabinIndex}`;
    }
  };
  const handleEditClick = useCallback(
    (id) => {
      const itemToEdit = sortdata?.data?.find((item) => item._id === id);
      navigate("/form", {
        state: { itemToEdit },
      });
    },
    [navigate, sortdata]
  );

  const formatDateForDisplay = (date) => {
    return date ? date.toFormat("dd/MM/yyyy") : "";
  };

  const formatDateForAPI = (date) => {
    return date ? date.toFormat("yyyy/dd/MM") : "";
  };
  const formatDateForset = (date) => {
    return date ? date.toFormat("yyyy/MM/dd") : "";
  };

  const handleDateChange = useCallback(
    async (date) => {
      if (!date) {
        setIsDateSelected(false);
        return;
      }
      setIsDateSelected(true);
      setIsloading(true);
      dispatch(setDate(date));
      const formattedDate = formatDateForset(date);
      const formattedDatebus = formatDateForAPI(date);
      try {
        const response = await fetch(
          `${searchapi}?Date=${formattedDate}&route=${Route}`
        );
        const busnumber = await fetch(
          `${busnumbersearchapi}?Date=${formattedDate}&route=${Route}`
        );
        const allsits = await fetch(
          `${allsit}?Date=${formattedDate}&route=${Route}`
        );
        if (!response.ok && !busnumber.ok && !allsits.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const busdetailas = await busnumber.json();

        setSortdata(result);
        setBusDetails(busdetailas);
        const allsitdata = await allsits.json();
        setTotalsit(allsitdata);
      } catch (error) {
        console.error("Fetch operation error:", error);
      } finally {
        setIsloading(false);
      }
    },
    [dispatch]
  );
  const hasRun = useRef(false);

  useEffect(() => {
    // Check if the effect has not run before
    if (inputs.Tablemanuplation.date && !hasRun.current) {
      handleDateChange(inputs.Tablemanuplation.date);
      hasRun.current = true; // Mark that the effect has run
    }
  }, [inputs.Tablemanuplation.date, handleDateChange]);
  const handleDelete = useCallback(
    async (id) => {
      try {
        const response = await fetch(`${deleteapi}${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        await response.json();
        handleDateChange(inputs.Tablemanuplation.date);
        setDisplay(false); // Explicitly set display to false to hide the tooltip
      } catch (error) {
        console.error("Fetch operation error:", error);
      }
    },
    [handleDateChange, inputs.Tablemanuplation.date, deleteapi]
  );

  const handleDownload = () => {
    // Data for table labels and numbers
    const labels = [
      ["B", "A"],
      ["D", "C"],
      ["F", "E"],
      ["H", "G"],
      ["J", "I"],
      ["L", "K"],
    ];

    const number = [
      ["1,2", "3,4"],
      ["5,6", "7,8"],
      ["9,10", "11,12"],
      ["13,14", "15,16"],
      ["17,18", "19,20"],
      ["21,22", "23,24"],
    ];
    const kabin = [
      ["કેબિન-1"],
      ["કેબિન-2"],
      ["કેબિન-3"],
      ["કેબિન-4"],
      ["કેબિન-5"],
    ];
    const kabin2 = [
      ["કેબિન-6"],
      ["કેબિન-7"],
      ["કેબિન-8"],
      ["કેબિન-9"],
      ["કેબિન-10"],
    ];

    // Function to generate table rows from labels or numbers
    const generateTableRows = (dataList) => {
      return dataList
        .map((pair) => {
          const items = pair.map((seatNumber) => {
            return sortdata.data.find((item) => item.seatNumber === seatNumber);
          });

          return `
            <tr>
              ${pair
                .map((seatNumber, index) => {
                  const item = items[index];
                  return `
                    <td class="border border-black text-center" style="height: 120px; width: 112px;">
                      ${
                        item
                          ? `
                        <div class="font-bold text-lg text-red-500">${
                          item.seatNumber
                        }</div>
                        <div class="font-bold ">${item.vilage || ""}</div>
                        <div class="font-bold ">${item.name || ""}</div>
                        <div class="font-bold ">${item.mobile || ""}</div>
                      `
                          : `
                        <div class="font-bold text-lg text-red-500">${seatNumber}</div>
                        <div></div>
                        <div></div>
                        <div></div>
                      `
                      }
                    </td>
                  `;
                })
                .join("")}
            </tr>
          `;
        })
        .join("");
    };
    const generatesTableRows = (dataList) => {
      return dataList
        .map((pair) => {
          const items = pair.map((seatNumber) => {
            return sortdata.data.find((item) => item.seatNumber === seatNumber);
          });

          return `
            <tr class="border border-black">
              ${pair
                .map((seatNumber, index) => {
                  const item = items[index];
                  return item
                    ? `
                
                    <div>
                      <td class="border border-black p-2 text-center w-1/6 ">${
                        item.seatNumber
                      }</td>
                      <td class="border border-black p-2 text-left font-bold ">${
                        item.vilage
                      }--${item.name} </td>
                      <td class="border border-black p-2 text-left font-bold ">${
                        item?.mobile || ""
                      }</td>
                    </div>
                    `
                    : `
                      <td class="border border-black p-2 text-center w-1/6 ">${seatNumber}</td>
                      <td class="border border-black p-2 text-center "></td>
                      </div>
                      `;
                })
                .join("")}
            </tr>
          `;
        })
        .join("");
    };

    // Generate table rows for both tables
    const firstTableRows = generateTableRows(labels);
    const secondTableRows = generateTableRows(number);
    const thiredTableRows = generatesTableRows(kabin);
    const fourthTableRows = generatesTableRows(kabin2);

    // Create the HTML content for the PDF
    const element = document.createElement("div");

    element.innerHTML = `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bus Seating Plan</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="font-sans m-0 p-0">
        <div class="container mx-auto max-w-4xl px-4">
        <div class="text-3xl text-red-500 flex justify-center font-extrabold mb-5">શક્તિધામ ટ્રાવેલ્સ</div>
    <table class="min-w-full mb-3">
  <thead>
    <tr class="flex justify-between">
      <th class="text-right pr-2">તારીખ:- ${formattedDate}</th>
      <th class="text-right pr-2">ડ્રાઇવર:-${busdetails?.data[0]?.driver}</th>
    </tr>
    <tr class="flex justify-between">
      <th class="text-right pr-2">ઉપડવાનો સમય:-${
        busdetails?.data[0]?.bustime
      }</th>
      <th class="text-right pr-2">બસ નંબર:-${
        busdetails?.data[0]?.busNumber
      }</th>
    </tr>
  </thead>
</table>

          <div class="flex justify-between mb-4">
            <div class="w-1/2 pr-2">
             
              <table class="min-w-full border-collapse border border-black">
                <thead>
                  <tr>
                    <th class="bg-red-500 text-white p-2">ઉપર  </th>
                    <th class="bg-red-500 text-white p-2">નીચે</th>
                  </tr>
                </thead>
                <tbody>
                  ${firstTableRows}
                </tbody>
              </table>
            </div>
            <div class="w-1/2 pl-2">
              <table class="min-w-full border-collapse border border-black">
                <thead>
                  <tr>
                    <th class="bg-red-500 text-white p-2">નીચે</th>
                    <th class="bg-red-500 text-white p-2">ઉપર</th>
                  </tr>
                </thead>
                <tbody>
                  ${secondTableRows}
                </tbody>
              </table>
            </div>
          </div>
          <div class="flex justify-between">
          <table class="border-collapse border border-black w-full">
            <tbody>
              ${thiredTableRows}
            </tbody>
          </table>
           <table class="border-collapse border border-black w-full">
            <tbody>
              ${fourthTableRows}
            </tbody>
          </table>
          </div>
        </div>
        <div class="p-4">
        <div class="flex justify-between mb-5">
         <div class="text-3xl text-red-500 font-extrabold flex items-center mb-5">શક્તિધામ ટ્રાવેલ્સ</div>
         <div>
         <ul class="list-none text-black font-bold">
         <li >તારીખ :- ${formattedDate}</li>
          <li>ડ્રાઇવર :- ${busdetails?.data[0]?.driver}</li>
           <li>બસ નંબર :- ${busdetails?.data[0]?.busNumber}</li>
            <li>ઉપડવાનો સમય :- ${busdetails?.data[0]?.bustime}</li>
         </ui>
         </div>
        </div>
          <table class="border-2 border-red-500 w-full text-sm">
            <thead>
              <tr>
                <th class="border-2 border-red-500 bg-red-400 p-2 text-center text-white">નંબર</th>
                <th class="border-2 border-red-500 bg-red-400 p-2 text-center text-white">રૂપિયા</th>
                <th class="border-2 border-red-500 bg-red-400 p-2 text-center text-white" >નામ</th>
                <th class="border-2 border-red-500 bg-red-400 p-2 text-center text-white">કુલ સીટ</th>
              </tr>
            </thead>
            <tbody>
            ${Array.from({ length: 25 }, (_, index) => {
              const item = totalsit?.data[index];
              return `
                <tr class="h-6">
                  <td class="border-2 border-red-500 p-2 w-fit text-center font-bold">${
                    index + 1
                  }</td>
                  <td class="border-2 border-red-500 p-2 w-1/4 font-bold"></td>
<td class="border-2 border-red-500 p-2 font-bold">
<div class=" flex justify-between">
  <span>${item?.village ? item.village : ""}</span>
  <span>${item?.name ? item.name : ""}</span></div>
</td>



                  <td class="border-2 border-red-500 p-2 text-center font-bold">
                    ${item?.seatCount ? item.seatCount : ""}  ${
                item?.seatCount && item?.cabinCount ? "+" : ""
              } ${item?.cabinCount ? +item.cabinCount + "k" : ""}
                  </td>
                </tr>
              `;
            }).join("")}
           
             
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    // Use html2pdf to convert the HTML to a PDF
    html2pdf()
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        pdf.autoPrint(); // Optional: automatically open the print dialog
        pdf.save(
          `${formatDateForDisplay(
            inputs.Tablemanuplation.date
          )}શક્તિધામ ટ્રાવેલ્સ.pdf`
        ); // Save the PDF
      });
  };
  const formattedDate = formatDateForDisplay(inputs.Tablemanuplation.date);
  const handleSendWhatsApp = (e) => {
    // Format date using the formatDateForDisplay function
    e.preventDefault();
    // Message to send
    const message = `
    ---શક્તિ ધામ---
    
    બુકિંગ તારીખ    : ${formattedDate}
    ટાઇમ              : ${data?.time}
    ક્યા થી ક્યા       : ${msgmdata?.vilage} થી સુરત
    ક્યાંથી બેસવાનું  : ${data?.pickup}
    બસ નંબર        : ${busdetails?.data[0]?.busNumber}
    સીટ નંબર        : ${data?.sitnumber}
    રકમ               : ${data?.price}
    
    પેસેર્જર મોબાઈલ નંબર : ${msgmdata?.mobile}
    
    લોકેશન : ${busdetails.data[0]?.location}
    
    સુરત ઓફિસ મોબાઇલ નંબર :
    98254507000
    9825805971
    
    જસદણ ઓફિસ મોબાઇલ નંબર :
    9909134545
    9879584545
    
    મોટા દેવળીયા ઓફિસ મોબાઇલ નંબર:
    9825864672
    9586653535
    
    હેલ્પલાઇન નંબર: 8141814190
    `;

    // List of mobile numbers to send the message
    const mobileNumbers = [msgmdata?.mobile];

    // Loop through each mobile number and open WhatsApp for each
    mobileNumbers.forEach((number) => {
      const url = `https://wa.me/+91${number}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    });
    setMsgbox(!msgbox);
  };

  const showQuestion = useCallback(() => {
    setPopbox(!popbox);
  });
  const showQuestionsss = useCallback((mobile, vilage, name) => {
    setMsgbox(!msgbox);
    setMsgmdata({
      vilage: vilage,
      mobile: mobile,
      name: name,
    });
    setDisplay(false);
  });

  return (
    <div>
      <div
        className={`flex flex-col lg:flex-row items-center justify-between ${
          !isDateSelected ? "h-screen" : ""
        }`}
      >
        {/* Conditionally render image based on date selection */}
        {!isDateSelected && (
          <div className="w-full lg:w-1/3 flex justify-center lg:justify-start lg:mb-0">
            <img src={Bus} alt="Bus" className="w-full h-auto object-cover" />
          </div>
        )}
        <div className="w-full lg:w-1/3 flex flex-col pt-2 mb-6 lg:mb-0">
          <div className="flex justify-between items-center mb-5">
            {/* Back button */}
            <Link to="/route">
              <div className="flex items-center">
                <Back />
              </div>
            </Link>

            {/* DatePicker */}
            <LocalizationProvider
              dateAdapter={AdapterLuxon}
              adapterLocale="en-gb"
            >
              <DatePicker
                value={inputs.Tablemanuplation.date}
                disabled
                onChange={(date) => handleDateChange(date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="w-full"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Celender className="w-6 h-6 text-red-500" />
                        </InputAdornment>
                      ),
                    }}
                    helperText={null}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>

        {/* Conditionally render vector based on date selection */}
        {!isDateSelected && (
          <div className="w-full lg:w-1/3 flex justify-center lg:justify-end lg:mt-0">
            <Vector />
          </div>
        )}
      </div>

      <div className="App p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-4">
        {!isDateSelected && !isloading ? (
          <div className="text-center py-4">Select Date</div>
        ) : isloading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div>
            <div className="flex justify-between mb-3">
              <button
                className="bg-[#8A6FDF] text-white px-4 py-2 rounded hover:bg-[#7451f2] mt-2"
                onClick={handleDownload}
              >
                Download
              </button>
              <h1 className="text-red-600 font-bold text-xl">{Route} લાઇન</h1>
              <button
                className="bg-[#8A6FDF] text-white px-4 py-2 rounded hover:bg-[#7451f2] mt-2"
                onClick={showQuestion}
              >
                Add
              </button>
            </div>

            <div className="flex-1 overflow-x-auto" id="table-container">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border-b">Number</th>
                    <th className="p-2 border-b">Village</th>
                    <th className="p-2 border-b">Name</th>
                    <th className="p-2 border-b">Phone No.</th>
                    <th className="p-2 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(34).keys()].map((i) => {
                    const currentLabel = getLabel(i).toString();
                    const item = sortdata.data?.find(
                      (item) => item.seatNumber === currentLabel
                    );
                    return (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="text-center py-5 border">
                          {currentLabel}
                        </td>
                        <td className="p-2 border">
                          {item ? item.vilage : ""}
                        </td>
                        <td className="p-2 border">{item ? item.name : ""}</td>
                        <td className="p-2 border">
                          {item ? item.mobile : ""}
                        </td>
                        <td className="relative border">
                          <button
                            className="ml-4 hover:text-blue-900"
                            onClick={() => handleClicktd(currentLabel)}
                            ref={(el) => (buttonRefs.current[i] = el)}
                          >
                            <div className="flex justify-center">
                              <Action className="w-6 h-6 text-blue-500" />
                            </div>
                          </button>
                          {display && tooltipId === currentLabel && (
                            <div
                              role="tooltip"
                              className="absolute shadow-lg bg-blue-400 z-10 border rounded p-2 w-fit"
                              style={{
                                top: "100%",
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                              ref={tooltipRef}
                            >
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Upboxuparrow className="w-4 h-4 text-blue-400" />
                              </div>
                              <div className="flex flex-col">
                                <ul className="space-y-2">
                                  <li
                                    className="cursor-pointer hover:bg-blue-300 p-1 rounded text-black font-bold border-2 border-white"
                                    onClick={() => handleEditClick(item?._id)}
                                  >
                                    {item?.vilage
                                      ? "સુધારો કરો"
                                      : "સોફો બુક કરો"}
                                  </li>
                                  <li
                                    className="cursor-pointer hover:bg-blue-300 p-1 rounded text-black font-bold border-2 border-white"
                                    onClick={() => handleDelete(item?._id)}
                                  >
                                    સોફો કેન્સલ કરો
                                  </li>
                                  <li
                                    className="cursor-pointer hover:bg-blue-300 p-1 rounded text-black font-bold border-2 border-white"
                                    onClick={() =>
                                      showQuestionsss(
                                        item?.mobile,
                                        item?.vilage,
                                        item?.name
                                      )
                                    }
                                  >
                                    મેસેજ મોકલો
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Showbusnumber
          showQuestion={showQuestion}
          popbox={popbox}
          busdetails={busdetails}
          handleDateChange={handleDateChange}
        />
        <Msgbox
          showQuestionsss={showQuestionsss}
          msgbox={msgbox}
          handleSendWhatsApp={handleSendWhatsApp}
          data={data}
          setData={setData}
          totalsit={totalsit}
          msgmdata={msgmdata}
          busdetails={busdetails}
          setAllbooksit={setAllbooksit}
          allbooksits={allbooksits}
          setAllsitprice={setAllsitprice}
        />
      </div>
    </div>
  );
};

export default Homepage;
