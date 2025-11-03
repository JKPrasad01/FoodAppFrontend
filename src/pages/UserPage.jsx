import { useEffect, useState } from "react";
import UserDetails from "./UserDetails";
import { uniAPi } from "../api/uniAPi";

export default function UserPage({ userData, setUserData }) {
  const [user, setUser] = useState(userData);

  useEffect(() => {
    if (!userData?.username) return;
    uniAPi
      .get(`/user/fetch-user/${userData.username}`)
      .then((res) => setUser(res.data))
      .catch(() => console.error("Failed to fetch user details"));
  }, [userData.username]);

  const handleUpdate = (updatedUser) => {
    uniAPi
      .put(`/user/update/${updatedUser.username}`, updatedUser)
      .then((res) => {
        alert("User updated!");
        setUser(res.data);
        setUserData(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => alert("Failed to update user"));
  };

  return <UserDetails user={user} onUpdate={handleUpdate} />;
}
