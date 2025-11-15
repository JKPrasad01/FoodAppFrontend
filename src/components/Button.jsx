export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  iconOnly = false,
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const widthStyles = fullWidth ? "w-full" : "w-auto";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  }[size];

  const variantStyles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-gray-400 text-gray-700 hover:bg-gray-100",
    ghost:
      "text-gray-700 hover:bg-gray-100",
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyles} ${className}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {!iconOnly && "Loading..."}
        </div>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-5 h-5" />}
          {!iconOnly && children}
          {RightIcon && <RightIcon className="w-5 h-5" />}
        </>
      )}
    </button>
  );
}
