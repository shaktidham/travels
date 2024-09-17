import React, { useState } from "react";

// List of villages
const villages = Array.from({ length: 50 }, (_, i) => `Village ${i + 1}`);

const Rootadd = () => {
  const [formData, setFormData] = useState({
    date: "",
    route: "",
    village: [], // Corrected to match the initial state key
  });

  const api = "https://shaktidham-backend.vercel.app/route/create";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleVillageChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const village = checked
        ? [...prevData.village, value]
        : prevData.village.filter((village) => village !== value);
      return { ...prevData, village }; // Updated to use `village`
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send data to API
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful response
        alert("Booking successful!");
        // Clear the form or handle success state
        setFormData({
          date: "",
          route: "",
          village: [], // Updated to use `village`
        });
      } else {
        // Handle server error
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      // Handle network error
      alert("Network error. Please check your connection.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 border border-gray-200 rounded-lg shadow-lg bg-white lg:w-1/2">
      <h2 className="text-2xl font-bold mb-4">Bus Booking Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <label
            htmlFor="route"
            className="block text-sm font-medium text-gray-700"
          >
            Route Name
          </label>
          <input
            type="text"
            id="route"
            name="route"
            value={formData.route}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">
              Village
            </legend>
            <div className="mt-2 h-48 overflow-y-auto space-y-2">
              {villages.map((village) => (
                <div key={village} className="flex items-center">
                  <input
                    type="checkbox"
                    id={village}
                    value={village}
                    checked={formData.village.includes(village)} // Updated to use `village`
                    onChange={handleVillageChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={village}
                    className="text-sm font-medium text-gray-700"
                  >
                    {village}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Rootadd;
