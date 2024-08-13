import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Form() {
  const inputs = useSelector((state) => state.inputs);
  const location = useLocation();
  const navigate = useNavigate();
  const routeId = localStorage.getItem("routeId");

  // Get the item to edit from location state
  const itemToEdit = location.state?.itemToEdit || null;

  const formatDateForDisplay = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const formatDateForAPI = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const initialData = {
    name: "",
    vilage: "",
    mobile: "",
    seatNumber: "",
    date: "",
  };

  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (itemToEdit) {
      setData({
        name: itemToEdit.name || "",
        vilage: itemToEdit.vilage || "",
        mobile: itemToEdit.mobile || "",
        seatNumber: itemToEdit.seatNumber || "",
        date: formatDateForDisplay(itemToEdit.date) || "",
      });
    } else {
      setData({
        ...initialData,
        seatNumber: inputs.Tablemanuplation.seatnumber || "",
        date: formatDateForDisplay(inputs.Tablemanuplation.date) || "",
      });
    }
  }, [itemToEdit, inputs.Tablemanuplation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...data,
      date: formatDateForAPI(data.date),
    };

    try {
      const endpoint = itemToEdit
        ? `https://shaktidham-backend.vercel.app/seats/update/${itemToEdit._id}`
        : `https://shaktidham-backend.vercel.app/seats/create/${routeId}`;
      const method = itemToEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        await response.json();
        navigate("/home");
      } else {
        console.error("Submission failed");
      }
    } catch (error) {
      console.error("Fetch operation error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="main bg-gray-100 rounded-lg shadow-md p-10 w-96">
        <h1 className="text-green-500 text-3xl mb-6">
          {itemToEdit ? "Edit Booking" : "Add Booking"}
        </h1>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="name"
            className="text-left text-gray-700 font-bold block"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            value={data.name}
            placeholder="Enter your Name"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            required
          />

          <label
            htmlFor="vilage"
            className="text-left text-gray-700 font-bold block mt-4"
          >
            Village:
          </label>
          <input
            type="text"
            id="vilage"
            name="vilage"
            onChange={handleChange}
            value={data.vilage}
            placeholder="Enter your Village"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            required
          />

          <label
            htmlFor="mobile"
            className="text-left text-gray-700 font-bold block mt-4"
          >
            Mobile No:
          </label>
          <input
            type="number"
            id="mobile"
            name="mobile"
            onChange={handleChange}
            value={data.mobile}
            placeholder="Enter your Mobile Number"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />

          <label
            htmlFor="seatNumber"
            className="text-left text-gray-700 font-bold block mt-4"
          >
            Seat Number:
          </label>
          <input
            type="text"
            id="seatNumber"
            name="seatNumber"
            onChange={handleChange}
            value={data.seatNumber}
            placeholder="Enter your Seat Number"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 mt-1"
            required
          />

          <label
            htmlFor="date"
            className="text-left text-gray-700 font-bold block mt-4"
          >
            Date:
          </label>
          <input
            type="text"
            id="date"
            name="date"
            onChange={handleChange}
            value={data.date}
            placeholder="Enter your Date (dd/mm/yyyy)"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 mt-1"
            required
          />

          <div className="flex space-x-2 mt-3">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
            >
              {itemToEdit ? "Update" : "Submit"}
            </button>
            <Link to={"/"}>
              <button
                type="button"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
              >
                Back
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;
