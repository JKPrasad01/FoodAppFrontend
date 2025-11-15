import { FiEye, FiEyeOff } from "react-icons/fi";

export default function InputBox({
  label,
  type = "text",
  icon: Icon,
  value,
  onChange,
  error,
  showPassword,
  togglePassword,
  disabled,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">

        {/* LEFT ICON */}
        {Icon && (
          <Icon className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
        )}

        <input
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none focus:ring-1 focus:ring-indigo-200 
            focus:border-indigo-100 disabled:bg-gray-100
            ${Icon ? "pl-10" : "pl-3"} 
            ${togglePassword ? "pr-10" : "pr-3"}
          `}
        />

        {/* PASSWORD TOGGLE ICON */}
        {type === "password" && togglePassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {error && <p className="text-sm mt-1 text-red-600">{error}</p>}
    </div>
  );
}
