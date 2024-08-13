import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import Homepage from "./componet/homepage";
import BookinForm from "./componet/form";
import Adminlogin from "./componet/adminlogin";
import { jwtDecode } from "jwt-decode";
import PrivateRoute from "./PrivateRoute";
import RoutePage from "./componet/route";

function App() {
  const token = localStorage.getItem("authToken");
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (!decoded.exp || decoded.exp < currentTime) {
          // localStorage.removeItem("authToken");
          console.log("Token expired or invalid, removed from local storage");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("authToken");
      }
    } else {
      localStorage.removeItem("authToken");
      console.log("No token found");
    }
  }, [token]);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Adminlogin />} />
        </Routes>

        <Routes>
          <Route
            path="/route"
            element={
              <PrivateRoute>
                <RoutePage />
              </PrivateRoute>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/form"
            element={
              <PrivateRoute>
                <BookinForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
