"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Package,
  Trash2,
  ArrowLeft,
  Loader2,
  FileText,
  Sparkles,
  Database,
  Layers,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState<{
    type: "success" | "error";
    text: string;
    inserted?: number;
    errors?: any[];
  } | null>(null);

  // Sample CSV Template Generator
  const downloadSampleCSV = () => {
    const csvContent =
      "name,category,price,unit,stock,image,description,sourcing,storage,variations\n" +
      "\"Fresh Desi Tomato (Tamatar)\",\"Vegetables\",35,\"1 kg\",100,\"https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=600&q=80\",\"Rich juicy red tomatoes for daily cooking\",\"Raisen Local Farm\",\"Store at room temp\",\"[{\\\"weight\\\":\\\"250g\\\",\\\"price\\\":10,\\\"stock\\\":40},{\\\"weight\\\":\\\"500g\\\",\\\"price\\\":18,\\\"stock\\\":50},{\\\"weight\\\":\\\"1 kg\\\",\\\"price\\\":35,\\\"stock\\\":60}]\"\n" +
      "\"Organic Spinach (Palak)\",\"Vegetables\",25,\"1 kg\",80,\"https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80\",\"Crisp iron-rich fresh green spinach\",\"Sehore Organic Valley\",\"Keep refrigerated\",\"[{\\\"weight\\\":\\\"250g\\\",\\\"price\\\":10,\\\"stock\\\":40},{\\\"weight\\\":\\\"500g\\\",\\\"price\\\":15,\\\"stock\\\":50},{\\\"weight\\\":\\\"1 kg\\\",\\\"price\\\":25,\\\"stock\\\":60}]\"\n" +
      "\"Daily Potato (Aloo)\",\"Vegetables\",30,\"1 kg\",200,\"https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80\",\"Everyday essential fresh potatoes\",\"Bhopal Krishi Mandi\",\"Store in dark cool space\",\"[{\\\"weight\\\":\\\"500g\\\",\\\"price\\\":16,\\\"stock\\\":50},{\\\"weight\\\":\\\"1 kg\\\",\\\"price\\\":30,\\\"stock\\\":100},{\\\"weight\\\":\\\"2 kg\\\",\\\"price\\\":58,\\\"stock\\\":50}]\"";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "mygreendelight_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Simple Parser
  const parseCSV = (text: string) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim() !== "");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const products: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) =>
        v.replace(/^"|"$/g, "").trim()
      );

      const obj: any = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || "";
      });

      if (obj.name && obj.price) {
        let variations = [];
        if (obj.variations) {
          try {
            variations = JSON.parse(obj.variations);
          } catch {
            variations = [];
          }
        }

        products.push({
          name: obj.name,
          category: obj.category || "Vegetables",
          price: Number(obj.price) || 0,
          unit: obj.unit || "1 kg",
          stock: Number(obj.stock) || 50,
          image: obj.image || "",
          description: obj.description || "",
          sourcing: obj.sourcing || "",
          storage: obj.storage || "",
          variations: variations,
        });
      }
    }
    return products;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResultMsg(null);

    const reader = new FileReader();

    if (selectedFile.name.endsWith(".json")) {
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setParsedProducts(parsed);
          } else {
            alert("JSON file must contain an array of products.");
          }
        } catch (err) {
          alert("Invalid JSON format.");
        }
      };
      reader.readAsText(selectedFile);
    } else {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const products = parseCSV(text);
        if (products.length === 0) {
          alert("Could not parse any valid product rows from CSV. Please check the template format.");
        }
        setParsedProducts(products);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleBulkUploadSubmit = async () => {
    if (parsedProducts.length === 0) {
      alert("No valid products to upload. Please select a CSV or JSON file first.");
      return;
    }

    try {
      setLoading(true);
      setResultMsg(null);

      const res = await axios.post("/api/admin/bulk-upload", {
        products: parsedProducts,
      });

      if (res.data.success) {
        setResultMsg({
          type: "success",
          text: res.data.message,
          inserted: res.data.insertedCount,
          errors: res.data.errors,
        });
        setParsedProducts([]);
        setFile(null);
      } else {
        setResultMsg({
          type: "error",
          text: res.data.message || "Failed to bulk upload products.",
        });
      }
    } catch (error: any) {
      console.error(error);
      setResultMsg({
        type: "error",
        text: error.response?.data?.message || "Internal server error during bulk upload.",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeRow = (index: number) => {
    setParsedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-[#f8faf9] min-h-screen font-sans flex">
      <AdminSidebar />

      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
              <FileSpreadsheet size={24} className="text-[#0f8646]" />
              <span>Bulk Produce Import & CSV Center</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Download live Bhopal mandi datasets or upload custom CSV/JSON produce batches
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadSampleCSV}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Blank CSV Template</span>
            </button>

            <Link
              href="/admin/viewgrocery"
              className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-4 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>View Live Inventory</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 max-w-6xl">
          {/* Ready-Made Datasets Banner Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Card 1: Master Merged Bhopal Dataset (115 Products) */}
            <div className="bg-gradient-to-br from-emerald-900 to-green-950 text-white rounded-3xl p-6 shadow-md border border-green-800 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>Master Catalog (Recommended)</span>
                  </span>
                  <span className="text-xs text-emerald-200 font-bold">115 Produce Items</span>
                </div>
                <h3 className="text-lg font-black text-white mb-1">
                  Complete Bhopal Mandi + EVegetableBazaar CSV
                </h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed mb-5">
                  Includes all 115 farm items (Vegetables, Fruits, Exotics, Dairy) with HD photos, pack sizes (250g–2kg) and verified Bhopal mandi pricing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-800/60">
                <a
                  href="/combined_bhopal_products.csv"
                  download="bhopal_mandi_master_115_products.csv"
                  className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-4 py-2.5 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Master CSV (115 Items)</span>
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/combined_bhopal_products.json");
                      const data = await res.json();
                      setParsedProducts(data);
                      setResultMsg(null);
                    } catch (e) {
                      alert("Failed to load Master dataset");
                    }
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers size={14} />
                  <span>Load Preview (115)</span>
                </button>
              </div>
            </div>

            {/* Card 2: Gramhat Dataset (63 Products) */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-amber-50 text-amber-800 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                    <Database size={12} />
                    <span>Gramhat Produce</span>
                  </span>
                  <span className="text-xs text-gray-500 font-bold">63 Produce Items</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Gramhat.in Extracted Bhopal CSV
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-5">
                  Original 63 produce items extracted directly from Gramhat Bhopal Mandi catalog with dual English/Hindi produce names.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                <a
                  href="/gramhat_products.csv"
                  download="gramhat_bhopal_63_products.csv"
                  className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2.5 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Gramhat CSV (63 Items)</span>
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/gramhat_products.json");
                      const data = await res.json();
                      setParsedProducts(data);
                      setResultMsg(null);
                    } catch (e) {
                      alert("Failed to load Gramhat dataset");
                    }
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers size={14} />
                  <span>Load Preview (63)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Result Alert */}
          {resultMsg && (
            <div
              className={`p-5 rounded-3xl text-xs sm:text-sm font-bold flex items-start gap-3 border shadow-xs ${
                resultMsg.type === "success"
                  ? "bg-green-50 border-green-200 text-green-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              {resultMsg.type === "success" ? (
                <CheckCircle2 size={20} className="text-[#0f8646] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-extrabold text-sm">{resultMsg.text}</p>
                {resultMsg.inserted ? (
                  <p className="text-xs text-green-700 mt-1 font-medium">
                    ✓ All {resultMsg.inserted} produce items have been added to your live store catalog!
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {/* Custom File Upload Dropzone Box */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs text-center">
            <div className="max-w-xl mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-3xl bg-green-50 text-[#0f8646] flex items-center justify-center mb-4 shadow-inner">
                <UploadCloud size={32} />
              </div>

              <h3 className="font-black text-lg text-gray-900 mb-1">
                Upload Any Custom CSV or JSON File
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Drag and drop your own custom sheet or choose a file from your computer
              </p>

              <input
                type="file"
                id="bulk-file"
                accept=".csv, application/json, text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="bulk-file"
                className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm cursor-pointer shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <FileSpreadsheet size={16} />
                <span>Select File from Computer</span>
              </label>

              {file && (
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                  <FileText size={14} className="text-[#0f8646]" />
                  <span>Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview Table */}
          {parsedProducts.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
                    <span>Parsed Dataset Preview</span>
                    <span className="bg-green-100 text-[#0f8646] text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {parsedProducts.length} items loaded
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Review produce data, images, categories, and pack sizes before inserting to database
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setParsedProducts([])}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold transition"
                  >
                    Clear Preview
                  </button>

                  <button
                    onClick={handleBulkUploadSubmit}
                    disabled={loading}
                    className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-7 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Importing {parsedProducts.length} Products...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Confirm & Import All ({parsedProducts.length})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-gray-100 max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50 text-gray-500 font-bold sticky top-0 border-b border-gray-200/80 z-10">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Produce Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Base Price</th>
                      <th className="py-3 px-4">Unit</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Pack Sizes</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedProducts.map((p, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="py-3 px-4 text-gray-400 font-medium">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-9 rounded-xl object-cover border border-gray-200 shrink-0"
                                onError={(e: any) => {
                                  e.target.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80";
                                }}
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                <Package size={16} />
                              </div>
                            )}
                            <div>
                              <p className="font-extrabold text-gray-900">{p.name}</p>
                              <p className="text-[10px] text-gray-400 line-clamp-1 max-w-xs">{p.description || "Farm produce"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-gray-900">₹{p.price}</td>
                        <td className="py-3 px-4 text-gray-500 font-medium">{p.unit || "kg"}</td>
                        <td className="py-3 px-4 font-bold text-gray-700">{p.stock || 50}</td>
                        <td className="py-3 px-4 text-gray-500 font-bold">
                          {p.variations && Array.isArray(p.variations) && p.variations.length > 0 ? (
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                              {p.variations.length} sizes (250g–2kg)
                            </span>
                          ) : (
                            <span className="text-gray-400">Standard</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => removeRow(idx)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition hover:bg-red-50 cursor-pointer"
                            title="Remove from batch"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
