import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listenToOrders, updateOrderStatus } from "../firebase";
import OrderCard from "../components/OrderCard";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function StaffDashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Protect this page: if staff isn't logged in, send them to login
    const isLoggedIn = localStorage.getItem("staffLoggedIn");
    if (!isLoggedIn) {
      navigate("/staff/login");
      return;
    }

    // listenToOrders watches ALL orders in real time.
    // Every time a customer places an order, or a status changes,
    // this callback runs again automatically.
    const unsubscribe = listenToOrders((liveOrders) => {
      setOrders(liveOrders);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    toast.success(`Order marked as ${newStatus}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("staffLoggedIn");
    navigate("/staff/login");
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="p-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 mt-2">
          <h1 className="font-display text-2xl font-bold text-ink">
            Live Orders
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-flame hover:underline"
          >
            Logout
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-10 text-center">
            <p className="text-ink/50">No orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffDashboard;