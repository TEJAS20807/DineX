import { useLocation, useNavigate } from "react-router-dom";
import { placeOrder } from "../firebase";
import toast from "react-hot-toast";

function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { cart = [], tableId } = location.state || {};

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderData = {
      tableId,
      items: cart.map((item) => ({ name: item.name, price: item.price })),
      total,
    };

    const orderId = await placeOrder(orderData);
    toast.success("Order placed!");
    navigate(`/order-status/${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-ink mb-2">
            Your cart is empty
          </p>
          <p className="text-ink/60">Add something tasty from the menu first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-10">
      <div className="bg-flame text-white px-6 py-8 text-center rounded-b-3xl shadow-md">
        <h1 className="font-display text-3xl font-extrabold tracking-wide">
          Your Cart
        </h1>
        <p className="mt-2 inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
          Table {tableId}
        </p>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 mt-2">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-3 border-b border-black/5 last:border-b-0"
            >
              <span className="font-semibold text-ink">{item.name}</span>
              <span className="font-semibold text-flame">₹{item.price}</span>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4 pt-3 border-t-2 border-ink/10">
            <span className="font-display text-lg font-bold text-ink">
              Total
            </span>
            <span className="font-display text-lg font-bold text-flame">
              ₹{total}
            </span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-mustard text-ink font-display font-extrabold text-lg py-4 rounded-2xl shadow-md hover:brightness-95 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default CartPage;