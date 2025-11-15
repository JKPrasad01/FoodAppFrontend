import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import InputBox from "../components/InputBox";
import Button from "../components/Button";

import { FiMail, FiLock, FiUser } from "react-icons/fi";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(password.length >= 6);
    setPasswordsMatch(password === confirm && password.length > 0);
  }, [password, confirm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/auth/user/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        {/* Header */}
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create Account
        </h2>
        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-500">
            Login
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 mt-6">

          <InputBox
            label="Username"
            icon={FiUser}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={username.length < 3 ? "Minimum 3 characters" : ""}
            disabled={loading}
          />

          <InputBox
            label="Email"
            icon={FiMail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email && !validEmail ? "Invalid email" : ""}
            disabled={loading}
          />

          <InputBox
            label="Password"
            type="password"
            icon={FiLock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
            error={password && !validPassword ? "Min 6 characters" : ""}
            disabled={loading}
          />

          <InputBox
            label="Confirm Password"
            type="password"
            icon={FiLock}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            showPassword={showConfirm}
            togglePassword={() => setShowConfirm(!showConfirm)}
            error={confirm && !passwordsMatch ? "Passwords do not match" : ""}
            disabled={loading}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={!validEmail || !validPassword || !passwordsMatch}
          >
            Sign Up
          </Button>
        </form>

      </div>
    </div>
  );
}
