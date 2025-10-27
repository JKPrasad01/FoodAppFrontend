import React, { useEffect, useState } from "react";

import UserDetails from "./UserDetails";
import { uniAPi } from "../api/uniAPi";

export default function UserPage({ userData, setUserData }) {
  const [user, setUser] = useState({
    userId: null,
    username: "",
    userProfile: "",
    userEmail: "",
    password: "hidden",
    contactNumber: null,
    address: "",
  });

  useEffect(() => {
    setUser(userData);
  }, [user]);

  const handleUpdate = (updatedUser) => {
    uniAPi
      .put(`/user/update/${updatedUser.userId}`, updatedUser)
      .then((res) => {
        alert("User updated!");
        setUser(res.data);
        setUserData(res.data);
      })
      .catch(() => alert("Failed to update user"));
  };

  return <UserDetails user={user} onUpdate={handleUpdate} />;
}
