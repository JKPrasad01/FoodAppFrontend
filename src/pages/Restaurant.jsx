import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uniAPi } from "../api/uniAPi";

export default function Restaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await uniAPi.get("/restaurants/all-restaurants");
      if (res.data) {
        setRestaurants(res.data);
        console.log("restaurants ", res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((r) => (
          <div
            key={r.restaurantId}
            onClick={() => navigate(`/restaurant/${r.restaurantId}`)}
            className="cursor-pointer border rounded-lg shadow hover:shadow-lg transition p-4"
          >
            <img
              src={`${r.restaurantProfile}`}
              alt={r.restaurantName}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="mt-3 font-bold text-lg">{r.restaurantName}</h3>
            <p className="text-gray-600">Cuisine: {r.cuisineType}</p>
            <p className="text-gray-600">Address: {r.restaurantAddress}</p>
            <p className="text-yellow-600 font-semibold">⭐ {r.rating}</p>
            <p
              className={
                r.openOrClosed
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {r.openOrClosed ? "Open" : "Closed"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
