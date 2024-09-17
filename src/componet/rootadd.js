import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Back } from "../svg/back.svg";

// List of villages
const villages = Array.from({ length: 50 }, (_, i) => `Village ${i + 1}`);

const Rootadd = () => {
  const [formData, setFormData] = useState({
    date: "",
    route: "",
    from: [],
    to: [],
    price: "",
  });
  const [data, setData] = useState([]);
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const api = "https://shaktidham-backend.vercel.app/route/create";
  const apishowroute =
    "https://shaktidham-backend.vercel.app/route/searchbyvillage";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "date") setDate(value);
  };

  const handleVillageChange = (e, type) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updated = checked
        ? [...prevData[type], value]
        : prevData[type].filter((village) => village !== value);
      return { ...prevData, [type]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Booking successful!");
        setFormData({
          date: "",
          route: "",
          from: [],
          to: [],
          price: "",
        });
        navigate("/route");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please check your connection.");
    }
  };

  const showroute = useCallback(async () => {
    try {
      const response = await fetch(`${apishowroute}?Date=${date}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Fetch operation error:", error);
    }
  }, [apishowroute, date]);

  useEffect(() => {
    if (date) {
      showroute();
    }
  }, [date, showroute]);

  return (
    <div className="max-w-md mx-auto my-8 p-6 border border-gray-200 rounded-lg shadow-lg bg-white lg:w-3/4">
      <Link to="/route">
        <div className="flex items-center">
          <Back />
        </div>
      </Link>
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
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">
              From
            </legend>
            <div className="mt-2 h-48 overflow-y-auto space-y-2">
              {villages.map((village) => (
                <div key={village} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`from-${village}`}
                    value={village}
                    checked={formData.from.includes(village)}
                    onChange={(e) => handleVillageChange(e, "from")}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`from-${village}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    {village}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
        <div>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">
              To
            </legend>
            <div className="mt-2 h-48 overflow-y-auto space-y-2">
              {villages.map((village) => (
                <div key={village} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`to-${village}`}
                    value={village}
                    checked={formData.to.includes(village)}
                    onChange={(e) => handleVillageChange(e, "to")}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`to-${village}`}
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
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Route Details</h3>
        {date && data.length > 0 && (
          <div className="space-y-6">
            {data.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg shadow-md p-4"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Village
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.from?.join(", ") || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        To
                      </th>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.to?.join(", ") || "N/A"}
                      </td>
                    </tr>
                    <tr>
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
    </div>
  );
};

export default Rootadd;
