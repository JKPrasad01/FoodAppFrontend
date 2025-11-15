import { useEffect, useState } from "react";
import UserDetails from "./UserDetails";
import { uniAPi } from "../api/uniAPi";
import { useAuth } from "../context/AuthContext";

export default function UserPage() {
  const { user: authUser, setUser: setAuthUser, loading } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!authUser?.username) {
      setProfileLoading(false);
      return;
    }

    let active = true;

    const fetchUser = async () => {
      try {
        const res = await uniAPi.get(`/user/by-username/${authUser.username}`);
        if (active) setProfileUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user details", err);
      } finally {
        if (active) setProfileLoading(false);
      }
    };

    fetchUser();

    return () => {
      active = false;
    };
  }, [authUser?.username]);

  const handleUpdate = async (updatedUser) => {
    try {
      const res = await uniAPi.put(
        `/user/update/${authUser.username}`,
        updatedUser
      );

      alert("User updated!");

      setProfileUser(res.data);
      setAuthUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

    } catch (err) {
      console.error("Failed to update user", err);
      alert("Failed to update user");
    }
  };

  if (loading || profileLoading) return <div>Loading...</div>;

  if (!profileUser) return <div>No user data available.</div>;

  return <UserDetails user={profileUser} onUpdate={handleUpdate} />;
}
