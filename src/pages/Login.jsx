import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiX } from "react-icons/fi";
import InputField from "../components/InputField";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const API_URL = "http://localhost:8080";

  useEffect(() => {
    setValidUsername(username.trim().length >= 3);
  }, [username]);

  useEffect(() => {
    setValidPassword(password.length >= 6);
  }, [password]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        navigate(from, { replace: true });
      } catch (err) {
        console.error("Invalid user in localStorage:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/user/login-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid credentials");
      }

      const userData = await response.json();

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 text-white p-3 rounded-full">
            <FiLock className="h-6 w-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 transition-all duration-300 hover:shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={FiMail}
              label="Username"
              isValid={validUsername}
              errorMessage="Username must be at least 3 characters"
              disabled={loading}
            />

            <InputField
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={FiLock}
              label="Password"
              isValid={validPassword}
              errorMessage="Password must be at least 6 characters"
              showToggle
              toggleVisibility={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
              disabled={loading}
            />

            {error && (
              <div className="rounded-md bg-red-50 p-4 flex items-center">
                <FiX className="h-5 w-5 text-red-400" />
                <span className="ml-2 text-sm font-medium text-red-800">
                  {error}
                </span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={!validUsername || !validPassword || loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
                  !validUsername || !validPassword || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                }`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-500">Don't have an account?</span>
            <Link
              to="/signup"
              className="ml-2 text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Create new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
