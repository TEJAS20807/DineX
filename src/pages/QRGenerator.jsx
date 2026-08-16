import { useState } from "react";
import QRCode from "qrcode";
import Navbar from "../components/Navbar";

function QRGenerator() {
  const [qrList, setQrList] = useState([]);
  const [generating, setGenerating] = useState(false);

  const handleGenerateAll = async () => {
    setGenerating(true);
    const results = [];

    for (let i = 1; i <= 10; i++) {
      const url = `${window.location.origin}/menu/${i}`;
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        color: {
          dark: "#2B1B0E",
          light: "#FFFFFF",
        },
      });
      results.push({ table: i, qr: qrDataUrl, url });
    }

    setQrList(results);
    setGenerating(false);
  };

  const handleDownload = (table, qr) => {
    const link = document.createElement("a");
    link.href = qr;
    link.download = `table${table}-qr.png`;
    link.click();
  };

  const handleDownloadAll = () => {
    qrList.forEach(({ table, qr }) => {
      setTimeout(() => handleDownload(table, qr), table * 200);
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="p-4 max-w-5xl mx-auto">
        <h1 className="font-display text-2xl font-bold text-ink mt-2 mb-1">
          QR Code Generator
        </h1>
        <p className="text-ink/50 text-sm mb-6">
          Generates one scannable QR code per table, for tables 1 to 10. Print
          and place one on each table.
        </p>

        <div className="flex gap-3 mb-6">
          <button
            onClick={handleGenerateAll}
            disabled={generating}
            className="bg-flame text-white font-display font-bold px-6 py-3 rounded-xl hover:bg-flame-dark transition disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate QR Codes (Tables 1-10)"}
          </button>

          {qrList.length > 0 && (
            <button
              onClick={handleDownloadAll}
              className="bg-white text-ink font-display font-bold px-6 py-3 rounded-xl border border-black/10 hover:bg-cream transition"
            >
              Download All
            </button>
          )}
        </div>

        {qrList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {qrList.map(({ table, qr, url }) => (
              <div
                key={table}
                className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 text-center hover:shadow-md transition"
              >
                <div className="inline-block bg-flame text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  Table {table}
                </div>
                <img
                  src={qr}
                  alt={`Table ${table} QR`}
                  className="mx-auto mb-3 rounded-lg border border-black/5"
                />
                <p className="text-[10px] text-ink/40 mb-3 break-all leading-tight">
                  {url}
                </p>
                <button
                  onClick={() => handleDownload(table, qr)}
                  className="w-full bg-ink text-white text-xs font-bold py-2 rounded-lg hover:bg-flame transition"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}

        {qrList.length === 0 && !generating && (
          <div className="bg-white rounded-2xl border border-black/5 p-10 text-center">
            <p className="text-ink/40">
              Click "Generate QR Codes" to create QR codes for all 10 tables.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRGenerator;