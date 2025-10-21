import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import your AuthContext

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Access the login function from context

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password); // ✅ Use context-based login

    if (result.success) {
      alert("✅ Login successful!");
      navigate("/"); // Go back to home
    } else {
      alert(result.message || "❌ Login failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
