function OrderCard({ order, onUpdateStatus }) {
  const nextStatus = {
    New: "Preparing",
    Preparing: "Served",
  };

  const statusStyles = {
    New: "bg-flame/10 text-flame",
    Preparing: "bg-mustard/20 text-mustard-dark",
    Served: "bg-success/10 text-success",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-display font-bold text-ink">
          Table {order.tableId}
        </h3>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            statusStyles[order.status] || "bg-ink/10 text-ink/60"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="text-sm mb-3 space-y-1">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-ink/80">
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-black/5">
        <span className="font-display font-bold text-flame">
          ₹{order.total}
        </span>
        {nextStatus[order.status] && (
          <button
            onClick={() => onUpdateStatus(order.id, nextStatus[order.status])}
            className="bg-ink text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-flame transition"
          >
            Mark as {nextStatus[order.status]}
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderCard;