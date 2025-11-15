import React, { useState } from "react";
import { uniAPi } from "../api/uniAPi";

const AddRestaurant = () => {
  const [restaurant, setRestaurant] = useState({
    restaurantName: "",
    cuisineType: "",
    restaurantAddress: "",
    rating: "",
    openOrClosed: false,
    menuList: [],
  });
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [menuItem, setMenuItem] = useState({
    menuName: "",
    rating: "",
    description: "",
    price: "",
    menuProfile: "",
  });
  const [menuImages, setMenuImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleRestaurantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRestaurantImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Restaurant image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRestaurantImage(reader.result);
      };
      reader.onerror = () => {
        setMessage("Error reading restaurant image");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuItemChange = (e) => {
    const { name, value } = e.target;
    setMenuItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleMenuImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Menu image size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuItem((prev) => ({ ...prev, menuProfile: reader.result }));
        setMenuImages((prev) => [...prev, reader.result]);
      };
      reader.onerror = () => {
        setMessage("Error reading menu image");
      };
      reader.readAsDataURL(file);
    }
  };

  const addMenuItem = () => {
    if (!menuItem.menuName || !menuItem.price || !menuItem.menuProfile) {
      setMessage("Please fill in menu name, price, and select an image.");
      return;
    }
    setRestaurant((prev) => {
      const newMenuList = [...prev.menuList, { ...menuItem }]; // Remove menuId
      console.log("Updated menuList:", newMenuList);
      return { ...prev, menuList: newMenuList };
    });
    setMenuItem({
      menuName: "",
      rating: "",
      description: "",
      price: "",
      menuProfile: "",
    });
    document.getElementById("menuProfile").value = null;
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !restaurant.restaurantName ||
      !restaurant.cuisineType ||
      !restaurant.restaurantAddress
    ) {
      setMessage("Please fill in all required restaurant fields.");
      return;
    }
    if (restaurant.menuList.length === 0) {
      setMessage("Please add at least one menu item.");
      return;
    }

    try {
      const restaurantDTO = {
        ...restaurant,
        restaurantProfile: restaurantImage,
        rating: restaurant.rating ? parseFloat(restaurant.rating) : null,
        menuList: restaurant.menuList.map((item) => ({
          menuName: item.menuName,
          menuProfile: item.menuProfile,
          rating: item.rating ? parseFloat(item.rating) : null,
          description: item.description,
          price: parseFloat(item.price),
        })),
      };

      console.log("Sending payload:", JSON.stringify(restaurantDTO, null, 2));
      const response = await uniAPi.post(`/restaurants/create`, restaurantDTO);

      setMessage("Restaurant created successfully!");
      setRestaurant({
        restaurantName: "",
        cuisineType: "",
        restaurantAddress: "",
        rating: "",
        openOrClosed: false,
        menuList: [],
      });
      setRestaurantImage(null);
      setMenuImages([]);
      document.getElementById("restaurantProfile").value = null;
      document.getElementById("menuProfile").value = null;
    } catch (error) {
      console.error("Axios error:", error.response || error);
      if (error.response) {
        setMessage(
          `Error: ${
            error.response.data ||
            `Request failed with status ${error.response.status}`
          }`
        );
      } else if (error.request) {
        setMessage(
          "Error: Unable to connect to the server. Check if the backend is running on http://localhost:8080."
        );
      } else {
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Restaurant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">
            Restaurant Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="restaurantName"
            value={restaurant.restaurantName}
            onChange={handleRestaurantChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block">
            Cuisine Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cuisineType"
            value={restaurant.cuisineType}
            onChange={handleRestaurantChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="restaurantAddress"
            value={restaurant.restaurantAddress}
            onChange={handleRestaurantChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block">Rating</label>
          <input
            type="number"
            name="rating"
            value={restaurant.rating}
            onChange={handleRestaurantChange}
            className="w-full p-2 border rounded"
            min="0"
            max="5"
            step="0.1"
          />
        </div>
        <div>
          <label className="block">
            <input
              type="checkbox"
              name="openOrClosed"
              checked={restaurant.openOrClosed}
              onChange={handleRestaurantChange}
              className="mr-2"
            />
            Open
          </label>
        </div>
        <div>
          <label className="block">Restaurant Profile Image</label>
          <input
            type="file"
            id="restaurantProfile"
            accept="image/*"
            onChange={handleRestaurantImage}
            className="w-full p-2 border rounded"
          />
          {restaurantImage && (
            <img
              src={restaurantImage}
              alt="Restaurant Preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
        </div>

        <h2 className="text-xl font-semibold mt-4">Add Menu Item</h2>
        <div className="space-y-2 border p-4 rounded">
          <div>
            <label className="block">
              Menu Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="menuName"
              value={menuItem.menuName}
              onChange={handleMenuItemChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Description</label>
            <input
              type="text"
              name="description"
              value={menuItem.description}
              onChange={handleMenuItemChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Rating</label>
            <input
              type="number"
              name="rating"
              value={menuItem.rating}
              onChange={handleMenuItemChange}
              className="w-full p-2 border rounded"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
          <div>
            <label className="block">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={menuItem.price}
              onChange={handleMenuItemChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block">
              Menu Profile Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="menuProfile"
              accept="image/*"
              onChange={handleMenuImage}
              className="w-full p-2 border rounded"
            />
            {menuItem.menuProfile && (
              <img
                src={menuItem.menuProfile}
                alt="Menu Preview"
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
          </div>
          <button
            type="button"
            onClick={addMenuItem}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Add Menu Item
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Menu Items</h3>
          <ul className="list-disc pl-5">
            {restaurant.menuList.map((item, index) => (
              <li key={index}>
                {item.menuName} - ${item.price}
                {item.menuProfile && (
                  <img
                    src={item.menuProfile}
                    alt={item.menuName}
                    className="inline ml-2 w-16 h-16 object-cover"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Restaurant
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 ${
            message.includes("successfully") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddRestaurant;
