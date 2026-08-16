function ScannerIcon() {
  // Pattern of filled (black) vs empty (white) cells - looks like a real QR fragment
  const pattern = [1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0];

  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      {/* White QR tile background */}
      <div className="absolute inset-2 bg-white rounded-sm grid grid-cols-4 grid-rows-4 gap-[1px] p-[2px]">
        {pattern.map((filled, i) => (
          <div
            key={i}
            className={filled ? "bg-black" : "bg-white"}
          />
        ))}
      </div>

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-[3px] border-l-[3px] border-white rounded-tl-md" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-[3px] border-r-[3px] border-white rounded-tr-md" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[3px] border-l-[3px] border-white rounded-bl-md" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[3px] border-r-[3px] border-white rounded-br-md" />

      {/* Scanning line */}
      <div className="absolute left-1 right-1 h-[2px] bg-mustard shadow-[0_0_8px_2px_rgba(255,193,69,0.9)] scanner-line" />
    </div>
  );
}

export default ScannerIcon;