import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScannerIcon from "../components/ScannerIcon";

function LandingPage() {
  const [showTableInput, setShowTableInput] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const navigate = useNavigate();

  const handleGoToMenu = () => {
    if (!tableNumber) {
      alert("Please enter a table number");
      return;
    }
    navigate(`/menu/${tableNumber}`);
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="font-display text-5xl font-extrabold text-mustard tracking-wide">
          DineX
        </h1>
        <ScannerIcon />
      </div>
      <p className="text-cream/60 mb-10">Scan. Order. Enjoy.</p>

      <div className="w-full max-w-sm space-y-4">
        {/* Customer button - reveals table input when clicked */}
        {!showTableInput ? (
          <button
            onClick={() => setShowTableInput(true)}
            className="block w-full bg-flame text-white text-center font-display font-bold text-lg py-4 rounded-2xl shadow-md hover:bg-flame-dark transition"
          >
            I'm a Customer
          </button>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <label className="block text-xs font-semibold text-ink/50 mb-2">
              Enter your table number
            </label>
            <input
              type="number"
              placeholder="e.g. 5"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              autoFocus
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-flame/50"
            />
            <button
              onClick={handleGoToMenu}
              className="w-full bg-flame text-white font-display font-bold py-3 rounded-xl hover:bg-flame-dark transition"
            >
              View Menu
            </button>
          </div>
        )}

        <Link
          to="/staff/login"
          className="block bg-white text-ink text-center font-display font-bold text-lg py-4 rounded-2xl shadow-md hover:bg-cream transition"
        >
          Staff Login
        </Link>

        <Link
          to="/admin/menu"
          className="block bg-mustard text-ink text-center font-display font-bold text-lg py-4 rounded-2xl shadow-md hover:brightness-95 transition"
        >
          Admin Panel
        </Link>
      </div>

      <p className="text-cream/30 text-xs mt-10">
        Normally, customers reach the menu by scanning their table's QR code — this button is just a fallback.
      </p>
    </div>
  );
}

export default LandingPage;