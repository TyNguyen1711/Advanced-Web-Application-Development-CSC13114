import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, AlertCircle, User, Eye, EyeOff } from "lucide-react";

// Validation schema for login
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Validation schema for signup
const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// Button Component
const Button = ({ children, loading, variant = "primary", ...props }) => {
  const baseStyles =
    "w-full px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

// Input Component
const Input = ({ label, error, icon: Icon, register, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={isPasswordField ? (showPassword ? "text" : "password") : type}
          className={`w-full ${Icon ? "pl-10" : "pl-3"} ${
            isPasswordField ? "pr-10" : "pr-3"
          } py-2.5 text-sm rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
          {...register}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

// AuthForm Component (Shared cho cả Login và Signup)
const AuthForm = ({ mode, onSubmit, onGoogleSignIn }) => {
  const isLogin = mode === "login";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: isLogin ? { email: "", password: "" } : {},
  });

  const [generalError, setGeneralError] = useState("");

  const onFormSubmit = async (data) => {
    try {
      setGeneralError("");
      await onSubmit(data);
    } catch (err) {
      setGeneralError(err.message || "An error occurred. Please try again.");
    }
  };

  const handleGoogleClick = async () => {
    try {
      setGeneralError("");
      await onGoogleSignIn();
    } catch (err) {
      setGeneralError("Google sign-in failed. Please try again.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onFormSubmit)(e);
  };

  return (
    <div className="space-y-4">
      {generalError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-800">{generalError}</p>
        </div>
      )}

      {!isLogin && (
        <Input
          label="Username"
          type="text"
          placeholder="Enter your username"
          icon={User}
          register={register("username")}
          error={errors.username?.message}
          autoComplete="username"
        />
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        icon={Mail}
        register={register("email")}
        error={errors.email?.message}
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon={Lock}
        register={register("password")}
        error={errors.password?.message}
        autoComplete={isLogin ? "current-password" : "new-password"}
      />

      {!isLogin && (
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          icon={Lock}
          register={register("confirm_password")}
          error={errors.confirm_password?.message}
          autoComplete="new-password"
        />
      )}

      {isLogin && (
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot password?
          </button>
        </div>
      )}

      <Button
        onClick={handleFormSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isLogin ? "Sign In" : "Sign Up"}
      </Button>

      {isLogin && (
        <>
          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In */}
          <Button
            variant="secondary"
            onClick={handleGoogleClick}
            disabled={isSubmitting}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        </>
      )}
    </div>
  );
};
export default AuthForm;
