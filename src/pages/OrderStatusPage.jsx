import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function OrderStatusPage() {
  const { orderId } = useParams(); // which order to track, from the URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // onSnapshot "listens" to this one order in the database.
    // Whenever staff updates its status, this runs again automatically
    // and updates the screen - no page refresh needed.
    const unsubscribe = onSnapshot(doc(db, "orders", orderId), (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      }
    });

    // stop listening when the customer leaves this page
    return () => unsubscribe();
  }, [orderId]);

  if (!order)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-display text-xl text-flame">Loading order...</p>
      </div>
    );

  const steps = ["New", "Preparing", "Served"];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-cream pb-10">
      <div className="bg-flame text-white px-6 py-8 text-center rounded-b-3xl shadow-md">
        <h1 className="font-display text-3xl font-extrabold tracking-wide">
          Order Status
        </h1>
        <p className="mt-2 inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
          Table {order.tableId}
        </p>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Progress tracker: New -> Preparing -> Served */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 mt-2 mb-4">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      index <= currentStepIndex
                        ? "bg-flame text-white shadow-md"
                        : "bg-ink/10 text-ink/40"
                    } ${index === currentStepIndex ? "animate-pulse" : ""}`}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={`text-xs mt-2 font-semibold ${
                      index <= currentStepIndex ? "text-flame" : "text-ink/40"
                    }`}
                  >
                    {step}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      index < currentStepIndex ? "bg-flame" : "bg-ink/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order items summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4">
          <h2 className="font-display font-bold text-ink mb-3">Order Items</h2>
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm py-2 border-b border-black/5 last:border-b-0"
            >
              <span className="text-ink">{item.name}</span>
              <span className="font-semibold text-flame">₹{item.price}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-3 pt-3 border-t-2 border-ink/10">
            <span className="text-ink">Total</span>
            <span className="text-flame">₹{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderStatusPage;