import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLock, FiX } from "react-icons/fi";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <form className="flex flex-col space-y-6 bg-white shadow-md p-10 rounded-lg" onSubmit={handleSubmit}>
        
        <InputBox
          label="Username"
          icon={FiUser}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <InputBox
          label="Password"
          type="password"
          icon={FiLock}
          value={password}
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {error && (
          <div className="flex items-center bg-red-50 p-3 rounded-lg">
            <FiX className="text-red-500 mr-2" />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        <Button type="submit" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?
        <Link to="/signup" className="ml-1 text-indigo-600 font-medium">Create one</Link>
      </p>
    </div>
  );
}
