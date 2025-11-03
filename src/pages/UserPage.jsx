import { useEffect, useState } from "react";
import UserDetails from "./UserDetails";
import { uniAPi } from "../api/uniAPi";

export default function UserPage({ userData, setUserData }) {
  const [user, setUser] = useState(userData || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no username, stop early
    if (!userData || !userData.username) {
      setLoading(false);
      return;
    }

    let isMounted = true; // ✅ Prevent state update if unmounted

    const fetchUser = async () => {
      try {
        const res = await uniAPi.get(`/user/by-username/${userData.username}`);
        if (isMounted) setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user details", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [userData?.username]); // ✅ only run when username actually changes

  const handleUpdate = async (updatedUser) => {
    try {
      const res = await uniAPi.put(`/user/update/${userData.username}`, updatedUser);
      alert("User updated!");
      setUser(res.data);
      setUserData(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Failed to update user");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data available.</div>;

  return <UserDetails user={user} onUpdate={handleUpdate} />;
}
