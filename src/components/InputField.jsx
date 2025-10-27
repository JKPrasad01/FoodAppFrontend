import { FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";

export default function InputField({
  id,
  name,
  type,
  value,
  onChange,
  icon: Icon,
  label,
  isValid,
  errorMessage,
  showToggle,
  toggleVisibility,
  showPassword,
  disabled,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          name={name}
          type={showPassword && type === "password" ? "text" : type}
          autoComplete={name}
          value={value}
          onChange={onChange}
          className={`block w-full pl-10 pr-10 py-3 border ${
            value
              ? isValid
                ? "border-green-300"
                : "border-red-300"
              : "border-gray-300"
          } rounded-lg focus:ring-2 focus:outline-none transition ${
            value
              ? isValid
                ? "focus:ring-green-500"
                : "focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
          disabled={disabled}
        />
        {showToggle && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={toggleVisibility}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        )}
        {!showToggle && value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isValid ? (
              <FiCheck className="h-5 w-5 text-green-500" />
            ) : (
              <FiX className="h-5 w-5 text-red-500" />
            )}
          </div>
        )}
      </div>
      {value && !isValid && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}