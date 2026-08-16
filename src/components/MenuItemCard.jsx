function MenuItemCard({ item, onAdd }) {
  const isVeg = item.type !== "Non-Veg";

  return (
    <div className="border rounded-xl p-4 shadow-sm flex flex-col justify-between bg-white">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`w-3.5 h-3.5 border-2 flex items-center justify-center ${
              isVeg ? "border-green-600" : "border-red-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isVeg ? "bg-green-600" : "bg-red-600"
              }`}
            />
          </span>
          <span className="text-xs font-bold text-flame bg-flame/10 px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>
        <h3 className="font-display text-lg font-bold text-ink">{item.name}</h3>
        <p className="text-ink/60 font-semibold mt-1">₹{item.price}</p>
      </div>
      <button
        onClick={() => onAdd(item)}
        className="mt-3 bg-flame text-white py-2 rounded-lg hover:bg-flame-dark transition"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default MenuItemCard;