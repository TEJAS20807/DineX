import { Link } from "react-router-dom";
import ScannerIcon from "./ScannerIcon";

function Navbar() {
  return (
    <nav className="bg-ink text-cream px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="font-display text-2xl font-extrabold tracking-wide text-mustard">
          DineX
        </span>
        <ScannerIcon />
      </div>
      <div className="flex gap-6 text-sm font-semibold">
        <Link to="/staff/dashboard" className="hover:text-flame transition">
          Dashboard
        </Link>
        <Link to="/admin/menu" className="hover:text-flame transition">
          Menu Manager
        </Link>
        <Link to="/admin/qr" className="hover:text-flame transition">
          QR Generator
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;