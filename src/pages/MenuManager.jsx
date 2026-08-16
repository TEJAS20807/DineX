import { useEffect, useState } from "react";
import { getMenu, addMenuItem, deleteMenuItem } from "../firebase";
import Navbar from "../components/Navbar";
import Papa from "papaparse";
import toast from "react-hot-toast";

function MenuManager() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Veg");

  const fetchMenu = async () => {
    const items = await getMenu();
    setMenu(items);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Add a single dish using the form
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !category || !price) {
      toast.error("Fill all fields");
      return;
    }
    await addMenuItem({ name, category, price: Number(price), type });
    toast.success("Item added!");
    setName("");
    setCategory("");
    setPrice("");
    fetchMenu();
  };

  // Reads a CSV file (Name, Category, Price, Type columns)
  // and adds every row as a menu item — used for adding
  // a full menu at once instead of typing one by one.
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let successCount = 0;

        for (const row of results.data) {
          const itemName = row.Name;
          const itemCategory = row.Category;
          const itemPrice = row.Price;
          const itemType = row.Type || "Veg";

          if (!itemName || !itemCategory || isNaN(Number(itemPrice))) continue;

          await addMenuItem({
            name: itemName.trim(),
            category: itemCategory.trim(),
            price: Number(itemPrice),
            type: itemType.trim(),
          });
          successCount++;
        }

        toast.success(`${successCount} items imported from CSV!`);
        fetchMenu();
        e.target.value = "";
      },
      error: () => {
        toast.error("Couldn't read that file");
      },
    });
  };

  const handleDelete = async (id) => {
    await deleteMenuItem(id);
    toast.success("Item deleted");
    fetchMenu();
  };

  // Deletes every item in the menu, one by one (with a confirmation popup)
  const handleClearAll = async () => {
    const confirmClear = window.confirm(
      "This will delete ALL menu items. Are you sure?"
    );
    if (!confirmClear) return;

    for (const item of menu) {
      await deleteMenuItem(item.id);
    }
    toast.success("Menu cleared!");
    fetchMenu();
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mt-2 mb-6">
          <h1 className="font-display text-2xl font-bold text-ink">
            Menu Manager
          </h1>
          {menu.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-flame hover:underline"
            >
              Clear All Items
            </button>
          )}
        </div>

        {/* CSV Upload - fastest way to add a full menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 mb-6">
          <h2 className="font-display font-bold text-ink mb-1">
            Upload Menu (CSV)
          </h2>
          <p className="text-xs text-ink/50 mb-3">
            CSV columns needed: Name, Category, Price, Type
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="w-full text-sm border border-black/10 rounded-xl px-3 py-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-flame file:text-white file:font-semibold file:text-sm"
          />
        </div>

        {/* Single item form - useful for quick edits */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 mb-6">
          <h2 className="font-display font-bold text-ink mb-3">
            Add a Single Dish
          </h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              type="text"
              placeholder="Dish name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-flame/50"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-flame/50"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-flame/50"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-flame/50"
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
            <button
              type="submit"
              className="w-full bg-flame text-white font-display font-bold py-3 rounded-xl hover:bg-flame-dark transition"
            >
              Add Item
            </button>
          </form>
        </div>

        {/* Current menu list */}
        <div className="space-y-2">
          {menu.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white rounded-xl border border-black/5 p-4 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 border-2 flex items-center justify-center ${
                    item.type === "Non-Veg" ? "border-red-600" : "border-green-600"
                  }`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${
                      item.type === "Non-Veg" ? "bg-red-600" : "bg-green-600"
                    }`}
                  />
                </span>
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-ink/50">
                    {item.category} &middot; ₹{item.price}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-flame text-sm font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuManager;