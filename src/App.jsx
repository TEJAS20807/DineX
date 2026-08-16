import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/StaffDashboard";
import MenuManager from "./pages/MenuManager";
import QRGenerator from "./pages/QRGenerator";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Customer routes */}
        <Route path="/menu/:tableId" element={<MenuPage />} />
        <Route path="/cart/:tableId" element={<CartPage />} />
        <Route path="/order-status/:orderId" element={<OrderStatusPage />} />

        {/* Staff routes */}
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />

        {/* Admin route */}
        <Route path="/admin/menu" element={<MenuManager />} />
        <Route path="/admin/qr" element={<QRGenerator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;