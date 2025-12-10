import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Instagram, Loader2, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const triggerNotification = (type, message) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      triggerNotification("error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerNotification("error", data.message || "Signup failed");
        return;
      }

      triggerNotification("success", "Signup successful! Please log in.");
      setTimeout(() => navigate("/login"), 800);
    } catch (error) {
      console.error("Signup error:", error);
      triggerNotification("error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">

      {/* 🔔 Notification */}
      {notification && (
        <div
          className={`fixed top-6 px-6 py-3 rounded-xl shadow-lg text-white z-50 transition-all duration-500 ${
            notification.type === "success" ? "bg-emerald-600" : "bg-red-600"
          } animate-fade`}
        >
          {notification.message}
        </div>
      )}

      <form
        onSubmit={handleSignup}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Create Account
        </h2>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-600 dark:text-gray-300"
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-600 dark:text-gray-300"
          >
            {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </span>
        </div>

        {/* SIGN UP */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-70 flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </button>

        {/* LOGIN instead */}
        <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-emerald-600 cursor-pointer hover:underline"
          >
            Log In
          </span>
        </p>

        {/* CONTACT */}
        <div className="mt-8">
          <h3 className="text-center text-gray-600 dark:text-gray-300 font-medium mb-3">
            Contact Us
          </h3>

          <div className="flex justify-center gap-6">
            <a
              href="mailto:support@example.com"
              className="text-gray-700 dark:text-gray-200 hover:text-emerald-500"
            >
              <Mail size={24} />
            </a>

            <a
              href="https://instagram.com/yourpage"
              target="_blank"
              className="text-gray-700 dark:text-gray-200 hover:text-emerald-500"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </form>

      {/* ANIMATION */}
      <style>{`
        .animate-fade {
          opacity: 1;
          animation: fadeOut 3s forwards;
        }
        @keyframes fadeOut {
          0% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
