import React, { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { TextField, InputAdornment } from "@mui/material";
import { ReactComponent as Action } from "../svg/action.svg";
import { ReactComponent as Celender } from "../svg/celender.svg";
import { ReactComponent as Upboxuparrow } from "../svg/uparrow.svg";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useDispatch, useSelector } from "react-redux";
import { setDate, setSeatNumber, setPopbox } from "../Slice/redux";

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
  const [msgmdata, setMsgmdata] = useState([]);
  const [busdetails, setBusDetails] = useState([]);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    pickup: "",
    price: "",
    time: "",
    sitnumber: "",
  });
  const Route = localStorage.getItem("route");
  const routeId = localStorage.getItem("routeId");
  const navigate = useNavigate();
  const [popbox, setPopbox] = useState(false);
  const inputs = useSelector((state) => state.inputs);
  const deleteapi = "https://shaktidham-backend.vercel.app/seats/delete/";
  const searchapi = "https://shaktidham-backend.vercel.app/seats/search";
  const busnumbersearchapi = "https://shaktidham-backend.vercel.app/bus/search";

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
        if (!response.ok && !busnumber.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const busdetails = await busnumber.json();

        setSortdata(result);
        setBusDetails(busdetails);
      } catch (error) {
        console.error("Fetch operation error:", error);
      } finally {
        setIsloading(false);
      }
    },
    [dispatch]
  );

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
      ["કેબિન-6"],
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
                    <td class="border border-black p-2 text-center h-28 w-28  ">
                      ${
                        item
                          ? `
                        <div class="font-bold text-lg">${item.seatNumber}</div>
                        <div>${item.vilage || ""}</div>
                        <div>${item.name || ""}</div>
                        <div>${item.mobile || ""}</div>
                      `
                          : `
                        <div class="font-bold text-lg">${seatNumber}</div>
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
            <tr>
              ${pair
                .map((seatNumber, index) => {
                  const item = items[index];
                  return item
                    ? `
                      <td class="border border-black p-2 text-center w-1/6">${item.seatNumber}</td>
                      <td class="border border-black p-2 text-left ">${item.name} -- ${item.vilage}</td>`
                    : `
                      <td class="border border-black p-2 text-center w-1/6">${seatNumber}</td>
                      <td class="border border-black p-2 text-center "></td>`;
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
        <div class="container mx-auto max-w-4xl p-4">
      <table class="min-w-full     mb-3">
      <thead>
        <tr class=" ">
          <th class=" text-right pr-2  ">તારીખ:-</th>
          <th class=" text-left">${formattedDate}</th>
          <th class=" text-right pr-2 ">ડ્રાઇવર:-</th>
          <th class=" py-3 text-left  "> ${busdetails?.data[0]?.driver}</th>
          <th class=" text-right pr-2 ">બસ નંબર:-</th>
          <th class=" py-3 text-left  "> ${busdetails?.data[0]?.busNumber}</th>
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
          <table class="border-collapse border border-black w-full">
            <tbody>
            
              ${thiredTableRows}
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
          `${formatDateForDisplay(inputs.Tablemanuplation.date)}shaktidham.pdf`
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
  const showQuestionsss = useCallback((mobile, vilage) => {
    setMsgbox(!msgbox);
    setMsgmdata({
      vilage: vilage,
      mobile: mobile,
    });
  });
  console.log(msgmdata, "msgmdata");
  return (
    <div className="App p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-4">
      <div className="flex justify-center">
        <div>
          <LocalizationProvider
            dateAdapter={AdapterLuxon}
            adapterLocale="en-gb"
          >
            <DatePicker
              value={inputs.Tablemanuplation.date}
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
                  value={formatDateForDisplay(inputs.Tablemanuplation.date)}
                />
              )}
            />
          </LocalizationProvider>
        </div>{" "}
      </div>
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
                {[...Array(30).keys()].map((i) => {
                  const currentLabel = getLabel(i).toString();
                  const item = sortdata.data?.find(
                    (item) => item.seatNumber === currentLabel
                  );
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="text-center py-5 border">
                        {currentLabel}
                      </td>
                      <td className="p-2 border">{item ? item.vilage : ""}</td>
                      <td className="p-2 border">{item ? item.name : ""}</td>
                      <td className="p-2 border">{item ? item.mobile : ""}</td>
                      <td className="relative border">
                        <>
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
                              className="absolute shadow-lg bg-blue-400 z-10 border rounded p-2"
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
                                    className="cursor-pointer hover:bg-blue-300 p-1 rounded text-black font-bold"
                                    onClick={() => handleEditClick(item?._id)}
                                  >
                                    {item?.vilage ? "Edit" : "Add"}
                                  </li>
                                  <li
                                    className="cursor-pointer hover:bg-blue-300 p-1 rounded text-black font-bold"
                                    onClick={() => handleDelete(item?._id)}
                                  >
                                    Delete
                                  </li>
                                  <li
                                    className="cursor-pointer hover:bg-blue-300 p-1 rounded text-black font-bold"
                                    onClick={() =>
                                      showQuestionsss(
                                        item?.mobile,
                                        item?.vilage
                                      )
                                    }
                                  >
                                    Send
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </>
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
      />
    </div>
  );
};

export default Homepage;
