import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function StaffLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (password === "dinex123") {
      localStorage.setItem("staffLoggedIn", "true");
      toast.success("Logged in!");
      navigate("/staff/dashboard");
    } else {
      toast.error("Wrong password");
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8"
      >
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-extrabold text-ink">
            Dine<span className="text-flame">X</span>
          </h1>
          <p className="text-ink/50 text-sm mt-1">Staff Portal</p>
        </div>

        <label className="block text-xs font-semibold text-ink/60 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter staff password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-flame/50"
        />

        <button
          type="submit"
          className="w-full bg-flame text-white font-display font-bold text-lg py-3 rounded-xl hover:bg-flame-dark transition shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default StaffLogin;