import { Link } from "react-router-dom";
import ScannerIcon from "../components/ScannerIcon";

function LandingPage() {
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
        <Link
          to="/menu/1"
          className="block bg-flame text-white text-center font-display font-bold text-lg py-4 rounded-2xl shadow-md hover:bg-flame-dark transition"
        >
          I'm a Customer
        </Link>

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
        Customers normally reach the menu by scanning a table's QR code.
      </p>
    </div>
  );
}

export default LandingPage;