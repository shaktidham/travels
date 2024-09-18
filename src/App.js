// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import React, { useEffect } from "react";
// import Homepage from "./componet/homepage";
// import BookinForm from "./componet/form";
// import Adminlogin from "./componet/adminlogin";
// import { jwtDecode } from "jwt-decode";
// import PrivateRoute from "./PrivateRoute";
// import RoutePage from "./componet/route";
// import Rootadd from "./componet/rootadd";

// function App() {
//   const token = localStorage.getItem("authToken");
//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         const currentTime = Date.now() / 1000;

//         if (!decoded.exp || decoded.exp < currentTime) {
//           // localStorage.removeItem("authToken");
//           console.log("Token expired or invalid, removed from local storage");
//         }
//       } catch (error) {
//         console.error("Invalid token:", error);
//         localStorage.removeItem("authToken");
//       }
//     } else {
//       localStorage.removeItem("authToken");
//       console.log("No token found");
//     }
//   }, [token]);
//   return (
//     <div className="App">
//       <Router>
//         <Routes>
//           <Route path="/" element={<Adminlogin />} />
//         </Routes>

//         <Routes>
//           <Route
//             path="/route"
//             element={
//               <PrivateRoute>
//                 <RoutePage />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//         <Routes>
//           <Route
//             path="/rootadd"
//             element={
//               <PrivateRoute>
//                 <Rootadd />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//         <Routes>
//           <Route
//             path="/home"
//             element={
//               <PrivateRoute>
//                 <Homepage />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//         <Routes>
//           <Route
//             path="/form"
//             element={
//               <PrivateRoute>
//                 <BookinForm />
//               </PrivateRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;
import React from "react";

const SeatingPlan = () => {
  // Array structure adjusted to match the visual layout

  // Numbers for each seat structured correctly
  const numbers = [
    ["B", "D", "F", "H", "J", "L"],
    ["A", "C", "E", "G", "I", "K"],
    ["1.2", "5.6", "9.10", "13.14", "17.18", "21.22"],
    ["3.4", "7.8", "11.12", "15.16", "19.20", "23.24"],
  ];

  return (
    <div className="flex  ">
      <div className="flex  ">
        <div>
          <h1 className="text-center">LB</h1>
          {numbers[0].map((num, idx) => (
            <div
              key={idx}
              className="border border-gray-300 text-center p-5 rounded-md m-1"
            >
              {num}
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-center">LB</h1>
          {numbers[1].map((num, idx) => (
            <div
              key={idx}
              className="border border-gray-300 text-center p-5 rounded-md m-1"
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row">
        <div>
          <h1 className="text-center">LB</h1>
          {numbers[2].map((num, idx) => (
            <div
              key={idx}
              className="border border-gray-300 text-center p-5 rounded-md m-1"
            >
              {num}
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-center">LB</h1>
          {numbers[3].map((num, idx) => (
            <div
              key={idx}
              className="border border-gray-300 text-center p-5 rounded-md m-1"
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatingPlan;
