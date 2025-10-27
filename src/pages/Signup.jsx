import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import axios from "axios"; // Added Axios import


export default function Signup({userData}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    // Validate email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidEmail(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    // Validate password length
    setValidPassword(password.length >= 6);
    // Check if passwords match
    setPasswordsMatch(password === confirm && password.length > 0);
  }, [password, confirm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check all validations
    if (!validEmail) {
      alert("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!validPassword) {
      alert("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Prepare data for API call
    const signupData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      // Make API POST request with Axios
      const response = await axios.post("http://localhost:8080/auth/user/register", signupData);

      // Handle successful response
      alert(`Successfully signed up with:\nUsername: ${username}\nEmail: ${email}`);
      navigate("/");
      // Reset form
      userData(response.data)
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (error) {
      // Handle error response
      if (error.response) {
        alert(`Signup failed: ${error.response.data.message || "An error occurred"}`);
      } else if (error.request) {
        alert("Signup failed: No response from server");
      } else {
        alert(`Signup failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-indigo-600 text-white p-3 rounded-full">
            <FiUser className="h-6 w-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 transition-all duration-300 hover:shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    email
                      ? validEmail
                        ? "border-green-300"
                        : "border-red-300"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:outline-none transition ${
                    email
                      ? validEmail
                        ? "focus:ring-green-500"
                        : "focus:ring-red-500"
                      : "focus:ring-indigo-500"
                  }`}
                  required
                  disabled={loading}
                />
                {email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {validEmail ? (
                      <FiCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <FiX className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {email && !validEmail && (
                <p className="mt-1 text-sm text-red-600">
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    password
                      ? validPassword
                        ? "border-green-300"
                        : "border-red-300"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:outline-none transition ${
                    password
                      ? validPassword
                        ? "focus:ring-green-500"
                        : "focus:ring-red-500"
                      : "focus:ring-indigo-500"
                  }`}
                  required
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {password && (
                <span
                  className={`mt-1 text-sm ${
                    validPassword ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {validPassword
                    ? "Password is valid"
                    : "Password must be at least 6 characters"}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border ${
                    confirm
                      ? passwordsMatch
                        ? "border-green-300"
                        : "border-red-300"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:outline-none transition ${
                    confirm
                      ? passwordsMatch
                        ? "focus:ring-green-500"
                        : "focus:ring-red-500"
                      : "focus:ring-indigo-500"
                  }`}
                  required
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirm ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {confirm && (
                <span
                  className={`mt-1 text-sm ${
                    passwordsMatch ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </span>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={!validEmail || !validPassword || !passwordsMatch || loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
                  !validEmail || !validPassword || !passwordsMatch || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  By signing up, you agree to our
                </span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>
              <span className="mx-2 text-gray-500">•</span>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}