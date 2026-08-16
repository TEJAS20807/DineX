import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenu } from "../firebase";
import MenuItemCard from "../components/MenuItemCard";
import ScannerIcon from "../components/ScannerIcon";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function MenuPage() {
  const { tableId } = useParams(); // reads table number from the URL
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]); // all dishes from Firebase
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]); // items customer has added
  const [search, setSearch] = useState(""); // search box text
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch the menu once when the page loads
  useEffect(() => {
    const fetchMenu = async () => {
      const items = await getMenu();
      setMenu(items);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const handleAdd = (item) => {
    setCart((prevCart) => [...prevCart, item]);
    toast.success(`${item.name} added to cart`);
  };

  const goToCart = () => {
    navigate(`/cart/${tableId}`, { state: { cart, tableId } });
  };

  // Groups dishes by category, and applies the search filter.
  // Used for BOTH the on-screen menu AND the PDF download,
  // so we only write this logic once.
  const getGroupedMenu = (searchText) => {
    const filtered = menu.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const grouped = {};
    filtered.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    // sort dishes alphabetically inside each category
    Object.keys(grouped).forEach((cat) => {
      grouped[cat].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  };

  // Creates and downloads a PDF version of the full menu
  const downloadMenuPDF = () => {
    const doc = new jsPDF();
    const grouped = getGroupedMenu(""); // full menu, no search filter

    doc.setFontSize(20);
    doc.setTextColor(228, 87, 46); // flame orange
    doc.text("DineX Menu", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Table ${tableId}`, 14, 27);

    let startY = 35;

    Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .forEach((category) => {
        doc.setFontSize(13);
        doc.setTextColor(30, 20, 10);
        doc.text(category, 14, startY);

        autoTable(doc, {
          startY: startY + 3,
          head: [["Dish", "Type", "Price"]],
          body: grouped[category].map((item) => [
            item.name,
            item.type === "Non-Veg" ? "Non-Veg" : "Veg",
            `Rs ${item.price}`,
          ]),
          theme: "grid",
          headStyles: { fillColor: [228, 87, 46] },
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 },
        });

        startY = doc.lastAutoTable.finalY + 10;

        // start a new page if we're running out of space
        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }
      });

    doc.save("DineX-Menu.pdf");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-display text-xl text-flame">Loading menu...</p>
      </div>
    );

  // List of category names for the filter pills, "All" first
  const categories = [
    "All",
    ...new Set(menu.map((item) => item.category)),
  ].sort((a, b) => (a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)));

  // Menu grouped according to current search text
  const groupedMenu = getGroupedMenu(search);

  // Which category sections to actually display right now
  const categoriesToShow =
    selectedCategory === "All"
      ? Object.keys(groupedMenu).sort((a, b) => a.localeCompare(b))
      : groupedMenu[selectedCategory]
      ? [selectedCategory]
      : [];

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header banner */}
      <div className="bg-flame text-white px-6 py-10 text-center rounded-b-3xl shadow-md">
        <div className="flex items-center justify-center gap-2">
          <h1 className="font-display text-4xl font-extrabold tracking-wide">
            DineX
          </h1>
          <ScannerIcon />
        </div>
        <p className="mt-2 inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-semibold">
          Table {tableId}
        </p>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-black/10 rounded-full px-5 py-3 mt-4 mb-4 focus:outline-none focus:ring-2 focus:ring-flame/50 shadow-sm"
        />

        {/* Download PDF button */}
        <div className="flex justify-end mb-3">
          <button
            onClick={downloadMenuPDF}
            className="text-sm font-semibold text-flame border border-flame px-4 py-2 rounded-full hover:bg-flame hover:text-white transition"
          >
            ⬇ Download Menu PDF
          </button>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition ${
                selectedCategory === cat
                  ? "bg-flame text-white shadow-md"
                  : "bg-white text-ink/70 border border-black/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu sections, grouped by category */}
        {categoriesToShow.length === 0 ? (
          <p className="text-center text-ink/50 mt-10">
            No dishes match your search.
          </p>
        ) : (
          categoriesToShow.map((cat) => (
            <div key={cat} className="mb-8">
              <h2 className="font-display text-xl font-bold text-ink mb-3 border-l-4 border-flame pl-3">
                {cat}{" "}
                <span className="text-sm font-normal text-ink/40">
                  ({groupedMenu[cat].length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {groupedMenu[cat].map((item) => (
                  <MenuItemCard key={item.id} item={item} onAdd={handleAdd} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating cart button, only shows once cart has items */}
      {cart.length > 0 && (
        <button
          onClick={goToCart}
          className="fixed bottom-4 right-4 bg-mustard text-ink font-bold px-6 py-3 rounded-full shadow-lg hover:brightness-95 transition"
        >
          View Cart ({cart.length})
        </button>
      )}
    </div>
  );
}

export default MenuPage;