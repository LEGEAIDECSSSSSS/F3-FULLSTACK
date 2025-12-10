import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Instagram, Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [notification, setNotification] = useState(null); // {type, message}

  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const triggerNotification = (type, message) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification(null);
    }, 3000); // fades out after 3 secs
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      triggerNotification("success", "Login successful!");
      navigate("/");
    } else {
      triggerNotification("error", result.message || "Login failed. Try again.");
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await googleLogin();
      triggerNotification("success", "Logged in with Google!");
      navigate("/");
    } catch (err) {
      triggerNotification("error", "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">

      {/* 🔔 MODERN NOTIFICATIONS */}
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
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Welcome Back
        </h2>

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD + TOGGLE */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* EYE ICON */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-600 dark:text-gray-300"
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-70 flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Login"}
        </button>

        {/* CONTINUE WITH GOOGLE */}
        <div className="my-6 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-300">OR</span>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition dark:border-gray-600"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 dark:text-gray-200">Continue with Google</span>
        </button>

        {/* SIGN UP BUTTON */}
        <p className="text-center mt-6 text-gray-700 dark:text-gray-300">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-emerald-600 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>

        {/* CONTACT SECTION */}
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

      {/* Fade animation */}
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
