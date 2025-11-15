import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout({ user, setUser }) {
  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <main className="pt-4">
        <Outlet />
      </main>
    </div>
  );
}
