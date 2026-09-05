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
import * as XLSX from "xlsx";
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

  // Wipe State
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [wipeConfirmText, setWipeConfirmText] = useState("");
  const [wipeLoading, setWipeLoading] = useState(false);

  const handleExecuteWipe = async () => {
    if (wipeConfirmText.trim().toUpperCase() !== "DELETE") {
      alert('Please type "DELETE" to confirm wiping produce from database.');
      return;
    }

    try {
      setWipeLoading(true);
      const res = await axios.post("/api/admin/bulk-update", {
        action: "wipe_all",
      });

      if (res.data.success) {
        alert(`✓ ${res.data.message}`);
        setShowWipeModal(false);
        setWipeConfirmText("");
      } else {
        alert(res.data.message || "Wipe failed");
      }
    } catch (err: any) {
      console.error("Wipe error:", err);
      alert(err.response?.data?.message || "Failed to wipe produce from database.");
    } finally {
      setWipeLoading(false);
    }
  };

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
    link.setAttribute("download", "subziquick_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Robust Parser with RFC 4180 unescaping
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
        let variations: any[] = [];
        if (obj.variations) {
          try {
            let cleanStr = obj.variations;
            if (typeof cleanStr === "string") {
              cleanStr = cleanStr.replace(/""/g, '"').trim();
              if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
                cleanStr = cleanStr.slice(1, -1).replace(/""/g, '"').trim();
              }
            }
            variations = JSON.parse(cleanStr);
          } catch {
            variations = [];
          }
        }

        const basePrice = Number(obj.price) || 40;
        const defaultUnit = obj.unit || "1 kg";
        const unitLow = defaultUnit.toLowerCase();

        // Fallback: If variations array is empty, auto-generate standard multi-tier pack variations
        if (!Array.isArray(variations) || variations.length === 0) {
          if (unitLow.includes("pc") || unitLow.includes("piece") || unitLow.includes("dozen")) {
            variations = [
              { weight: "1 Pc", price: basePrice, stock: 50 },
              { weight: "2 Pcs Pack", price: Math.round(basePrice * 1.9), stock: 40 },
              { weight: "4 Pcs Family Pack", price: Math.round(basePrice * 3.7), stock: 30 },
            ];
          } else if (unitLow.includes("box") || unitLow.includes("tray")) {
            variations = [
              { weight: "1 Box", price: basePrice, stock: 40 },
              { weight: "2 Boxes (Duo)", price: Math.round(basePrice * 1.9), stock: 30 },
            ];
          } else if (unitLow.includes("bundle") || unitLow.includes("bunch")) {
            variations = [
              { weight: "1 Bundle", price: basePrice, stock: 50 },
              { weight: "2 Bundles (Saver)", price: Math.round(basePrice * 1.9), stock: 40 },
            ];
          } else if (unitLow.includes("250g")) {
            variations = [
              { weight: "250g Pack", price: basePrice, stock: 50 },
              { weight: "500g (Twin Pack)", price: Math.round(basePrice * 1.9), stock: 40 },
              { weight: "1 kg (Family Pack)", price: Math.round(basePrice * 3.7), stock: 30 },
            ];
          } else {
            variations = [
              { weight: "250g", price: Math.max(10, Math.round(basePrice * 0.3)), stock: 50 },
              { weight: "500g", price: Math.max(15, Math.round(basePrice * 0.55)), stock: 60 },
              { weight: "1 kg", price: basePrice, stock: 80 },
              { weight: "2 kg (Bulk Saver)", price: Math.round(basePrice * 1.9), stock: 40 },
              { weight: "5 kg (Society Sack)", price: Math.round(basePrice * 4.6), stock: 25 },
            ];
          }
        }

        const calculatedMrp = Number(obj.mrp) || Math.round(basePrice * 1.28);

        products.push({
          name: obj.name,
          category: obj.category || "Vegetables",
          price: basePrice,
          mrp: calculatedMrp,
          unit: defaultUnit,
          stock: Number(obj.stock) || 100,
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

  const scrollToPreview = () => {
    setTimeout(() => {
      document.getElementById("dataset-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResultMsg(null);

    const fileName = selectedFile.name.toLowerCase();

    // 1. Handle JSON
    if (fileName.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setParsedProducts(parsed);
            scrollToPreview();
          } else {
            alert("JSON file must contain a non-empty array of products.");
          }
        } catch (err) {
          alert("Invalid JSON format.");
        }
      };
      reader.readAsText(selectedFile);
    } 
    // 2. Handle Excel (.xlsx, .xls)
    else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer;
          const workbook = XLSX.read(buffer, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const rawRows: any[] = XLSX.utils.sheet_to_json(sheet);

          if (rawRows.length === 0) {
            alert("The uploaded Excel sheet contains no rows.");
            return;
          }

          const products = rawRows.map((r) => {
            const getVal = (keys: string[]) => {
              for (const k of keys) {
                const foundKey = Object.keys(r).find((ok) => ok.trim().toLowerCase() === k.toLowerCase());
                if (foundKey && r[foundKey] !== undefined) return r[foundKey];
              }
              return "";
            };

            const name = String(getVal(["name", "produce name", "product name", "item"])).trim();
            const category = String(getVal(["category", "cat"])).trim() || "Vegetables";
            const price = Number(getVal(["price", "rate", "base price", "selling price"])) || 40;
            const mrp = Number(getVal(["mrp", "original price"])) || Math.round(price * 1.28);
            const unit = String(getVal(["unit", "pack", "size"])).trim() || "1 kg";
            const stock = Number(getVal(["stock", "qty", "quantity"])) || 100;
            const image = String(getVal(["image", "img", "photo", "image url"])).trim();
            const description = String(getVal(["description", "desc"])).trim();
            const sourcing = String(getVal(["sourcing", "source", "origin"])).trim();
            const storage = String(getVal(["storage", "shelf life"])).trim();

            let variations: any[] = [];
            const rawVars = getVal(["variations", "variants", "pack sizes"]);
            if (rawVars) {
              try {
                variations = typeof rawVars === "string" ? JSON.parse(rawVars) : rawVars;
              } catch {
                variations = [];
              }
            }

            return {
              name,
              category,
              price,
              mrp,
              unit,
              stock,
              image,
              description,
              sourcing,
              storage,
              variations,
            };
          }).filter((p) => p.name && p.price > 0);

          if (products.length === 0) {
            alert("Could not find valid produce columns (Name, Price) in Excel sheet.");
            return;
          }

          setParsedProducts(products);
          scrollToPreview();
        } catch (err: any) {
          console.error("Excel parse error:", err);
          alert("Failed to parse Excel file: " + (err.message || "Unknown error"));
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    } 
    // 3. Handle CSV
    else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const products = parseCSV(text);
        if (products.length === 0) {
          alert("Could not parse any valid product rows from CSV. Please check the template format.");
          return;
        }
        setParsedProducts(products);
        scrollToPreview();
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
    <div className="bg-[#f8faf9] min-h-screen font-sans flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <AdminSidebar />

      <div className="flex-1 min-w-0 pt-14 lg:pt-0 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
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

            <button
              onClick={() => {
                setWipeConfirmText("");
                setShowWipeModal(true);
              }}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3.5 py-2 rounded-xl text-xs font-black shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              title="Wipe Old Products Database"
            >
              <Trash2 size={14} />
              <span>Reset & Wipe Produce DB</span>
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
            {/* HERO CARD: Ultimate Consolidated Master Dataset (471 Products) */}
            <div className="bg-gradient-to-br from-[#0c5c30] via-[#0f8646] to-[#084824] text-white rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-emerald-400/40 flex flex-col justify-between relative overflow-hidden md:col-span-2">
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-300/15 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="bg-white text-[#0f8646] text-xs font-black uppercase tracking-wider px-3.5 py-1.2 rounded-full shadow-xs flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#0f8646]" />
                    <span>👑 Ultimate SubziQuick Master Catalog (100% Brand Clean)</span>
                  </span>
                  <span className="text-xs bg-emerald-950/60 border border-emerald-400/30 px-3 py-1 rounded-full font-black text-emerald-200">
                    471 Clean Unique Items • Zero Junk & Zero 3rd-Party Names
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                  Unified Master Produce & Grocery Catalog (471 Products)
                </h3>
                <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed mb-6 max-w-4xl">
                  Consolidated & deduplicated from all regional Bhopal mandis and contract farms. 100% filtered: all cold drinks, water bottles, soda, and cooked non-veg items have been removed. All 3rd-party store names are sanitized. Features Vegetables (217), Fruits (107), Dairy & Staples (78), Exotics (59), Ready-to-Cook (10) with multi-tier pack variations (250g, 500g, 1kg, 2kg, 5kg), realistic pricing & HD images.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-emerald-600/50">
                <a
                  href="/subziquick_fresh_produce_master.xlsx"
                  download="subziquick_fresh_produce_master.xlsx"
                  className="bg-white hover:bg-emerald-50 text-[#0c5c30] px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Download size={15} className="text-[#0f8646]" />
                  <span>Download Master Excel (.xlsx)</span>
                </a>

                <a
                  href="/subziquick_fresh_produce_master.csv"
                  download="subziquick_fresh_produce_master.csv"
                  className="bg-emerald-900/80 hover:bg-emerald-900 text-white border border-emerald-400/50 px-4 py-2.5 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet size={15} />
                  <span>Download Master CSV (471)</span>
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/subziquick_fresh_produce_master.json");
                      const data = await res.json();
                      setParsedProducts(data);
                      setResultMsg(null);
                      scrollToPreview();
                    } catch (e) {
                      alert("Failed to load Ultimate Master dataset");
                    }
                  }}
                  className="bg-emerald-300 hover:bg-emerald-200 text-emerald-950 px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Layers size={15} />
                  <span>Preview & 1-Click Upload (471 Items)</span>
                </button>
              </div>
            </div>

            {/* Card 1: Master Merged Bhopal Dataset (115 Products) */}
            <div className="bg-gradient-to-br from-emerald-900 to-green-950 text-white rounded-3xl p-6 shadow-md border border-green-800 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>Master Catalog (115 Items)</span>
                  </span>
                  <span className="text-xs text-emerald-200 font-bold">115 Produce Items</span>
                </div>
                <h3 className="text-lg font-black text-white mb-1">
                  Complete Bhopal Mandi + Farm Harvest CSV
                </h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed mb-5">
                  Includes 115 farm items (Vegetables, Fruits, Exotics, Dairy) with HD photos, pack sizes (250g–2kg) and verified Bhopal mandi pricing.
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
                      scrollToPreview();
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

            {/* Card 2: MVF Pune Master Extracted Dataset (52 Products) */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 shadow-xs border border-emerald-200/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>MVFPune.com Extracted</span>
                  </span>
                  <span className="text-xs text-emerald-800 font-bold">52 Products + Variations</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Maha Veggie Farm (MVF Pune) Master Dataset
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                  Extracted directly from mvfpune.com with all pack size variations (250g–2kg), HD farm images, pricing, and category breakdowns.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-200/60">
                <a
                  href="/mvfpune_products_master.xlsx"
                  download="mvfpune_products_master.xlsx"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Excel (.xlsx)</span>
                </a>

                <a
                  href="/mvfpune_products_master.csv"
                  download="mvfpune_products_master.csv"
                  className="bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-black shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet size={14} />
                  <span>Download CSV</span>
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/mvfpune_products_master.json");
                      const data = await res.json();
                      setParsedProducts(data);
                      setResultMsg(null);
                      scrollToPreview();
                    } catch (e) {
                      alert("Failed to load MVF Pune dataset");
                    }
                  }}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers size={14} />
                  <span>Preview & Upload (52)</span>
                </button>
              </div>
            </div>

            {/* Card 3: FPS Store Extracted Master Dataset (167 Products) */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-xs border border-amber-200/90 flex flex-col justify-between md:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-amber-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>FPSStore.in Master Catalog</span>
                  </span>
                  <span className="text-xs text-amber-900 font-bold">167 Products + Multi-Pack Sizes</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  FPS Store (fpsstore.in) Complete Sourced Dataset
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                  Full 167 organic & exotic products (Custard Apple, Berries, Hydroponic Greens, Avocado, Mushroom, Exotics) extracted with 1000x1000 HD images, weight variations (250g, 500g, 1kg, 2kg) and real pricing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60">
                <a
                  href="/fpsstore_products_master.xlsx"
                  download="fpsstore_products_master.xlsx"
                  className="bg-amber-700 hover:bg-amber-800 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Excel (.xlsx)</span>
                </a>

                <a
                  href="/fpsstore_products_master.csv"
                  download="fpsstore_products_master.csv"
                  className="bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-2 rounded-xl text-xs font-black shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet size={14} />
                  <span>Download CSV</span>
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/fpsstore_products_master.json");
                      const data = await res.json();
                      setParsedProducts(data);
                      setResultMsg(null);
                      scrollToPreview();
                    } catch (e) {
                      alert("Failed to load FPS Store dataset");
                    }
                  }}
                  className="bg-amber-200 hover:bg-amber-300 text-amber-950 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers size={14} />
                  <span>Preview & Upload (167)</span>
                </button>
              </div>
            </div>

            {/* Card 4: Wholesale Mandi Master Dataset (25 Products) */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-xs border border-blue-200/90 flex flex-col justify-between md:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>WholesaleMandi.com Catalog</span>
                  </span>
                  <span className="text-xs text-blue-900 font-bold">25 Fruits, Mangoes & Exotics</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Wholesale Mandi (wholesalemandi.com) Direct Sourced Dataset
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                  Bulk mandi rates for Mangoes (Imam Pasand, Banganapalli, Senthura), Bananas (Yelakki, Red, Nendram), Dragon Fruit, Blueberry, Thai Guava with bulk tier pack sizes (1kg, 2kg, 5kg).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-blue-200/60">
                <a
                  href="/wholesalemandi_products_master.xlsx"
                  download="wholesalemandi_products_master.xlsx"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Excel (.xlsx)</span>
                </a>

                <a
                  href="/wholesalemandi_products_master.csv"
                  download="wholesalemandi_products_master.csv"
                  className="bg-white hover:bg-blue-50 border border-blue-300 text-blue-900 px-3.5 py-2 rounded-xl text-xs font-black shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet size={14} />
                  <span>Download CSV</span>
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/wholesalemandi_products_master.json");
                      const data = await res.json();
                      setParsedProducts(data);
                      setResultMsg(null);
                      scrollToPreview();
                    } catch (e) {
                      alert("Failed to load Wholesale Mandi dataset");
                    }
                  }}
                  className="bg-blue-200 hover:bg-blue-300 text-blue-950 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers size={14} />
                  <span>Preview & Upload (25)</span>
                </button>
              </div>
            </div>

            {/* Card 5: Ram Bhaji Bhopal Master Dataset (39 Products) */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 shadow-xs border border-green-200/90 flex flex-col justify-between md:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-[#0f8646] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>RamBhaji.com Bhopal Catalog</span>
                  </span>
                  <span className="text-xs text-green-900 font-bold">39 Bhopal Mandi Produce Items</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Ram Bhaji Bhopal (rambhaji.com) Local Mandi Dataset
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                  Extracted directly from Bhopal online store Rambhaji with dual English & Hindi produce names (Beetroot चुकंदर, Bharta Brinjal बैगन, Bitter Gourd करेला, Bottle Gourd लौकी, Broccoli ब्रोकोली), authentic rates, and 250g–5kg pack sizes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-green-200/60">
                <a
                  href="/rambhaji_products_master.xlsx"
                  download="rambhaji_products_master.xlsx"
                  className="bg-[#0f8646] hover:bg-[#0c6a38] text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Excel (.xlsx)</span>
                </a>

                <a
                  href="/rambhaji_products_master.csv"
                  download="rambhaji_products_master.csv"
                  className="bg-white hover:bg-green-50 border border-green-300 text-green-900 px-3.5 py-2 rounded-xl text-xs font-black shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet size={14} />
                  <span>Download CSV</span>
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/rambhaji_products_master.json");
                      const data = await res.json();
                      setParsedProducts(data);
                      setResultMsg(null);
                      scrollToPreview();
                    } catch (e) {
                      alert("Failed to load Ram Bhaji dataset");
                    }
                  }}
                  className="bg-green-100 hover:bg-green-200 text-green-950 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers size={14} />
                  <span>Preview & Upload (39)</span>
                </button>
              </div>
            </div>

            {/* Card 6: VegSwift Bhopal Master Dataset (116 Products) */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-6 shadow-xs border border-teal-200/90 flex flex-col justify-between md:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-teal-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>VegSwift.in Bhopal Catalog</span>
                  </span>
                  <span className="text-xs text-teal-900 font-bold">116 Bhopal Produce & Dairy Items</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  VegSwift Bhopal (vegswift.in) Complete Sourced Dataset
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                  116 items extracted directly from Bhopal VegSwift platform with dual English/Hindi names (Pahadi Aalu, Nashik Pyaz, Garlic Lahsun, Mooli, Gajar, Arbi, Peanut, Desi Tomato), real mandi rates, and pack sizes (250g, 500g, 1kg, 2kg).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-teal-200/60">
                <a
                  href="/vegswift_products_master.xlsx"
                  download="vegswift_products_master.xlsx"
                  className="bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Excel (.xlsx)</span>
                </a>

                <a
                  href="/vegswift_products_master.csv"
                  download="vegswift_products_master.csv"
                  className="bg-white hover:bg-teal-50 border border-teal-300 text-teal-900 px-3.5 py-2 rounded-xl text-xs font-black shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet size={14} />
                  <span>Download CSV</span>
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/vegswift_products_master.json");
                      const data = await res.json();
                      setParsedProducts(data);
                      setResultMsg(null);
                      scrollToPreview();
                    } catch (e) {
                      alert("Failed to load VegSwift dataset");
                    }
                  }}
                  className="bg-teal-200 hover:bg-teal-300 text-teal-950 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers size={14} />
                  <span>Preview & Upload (116)</span>
                </button>
              </div>
            </div>

            {/* Card 7: KisaanRiksha Master Sourced Dataset (124 Products) */}
            <div className="bg-gradient-to-br from-lime-50 to-emerald-50 rounded-3xl p-6 shadow-xs border border-lime-200/90 flex flex-col justify-between md:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-lime-700 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>KisaanRiksha.com Catalog</span>
                  </span>
                  <span className="text-xs text-lime-900 font-bold">124 Products + Cut Veggies</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Kisaan Riksha (kisaanriksha.com) Farm to Doorstep Dataset
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                  Extracted 124 farm fresh & ready-to-cook chopped produce (Chopped Bhindi, Peeled Lauki, Cleaned Cauliflower Florets, Cut Carrot-Beans Mix, Mixed Veggie Packs) with pack size variations (250g, 500g, 1kg) and HD photos.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-lime-200/60">
                <a
                  href="/kisaanriksha_products_master.xlsx"
                  download="kisaanriksha_products_master.xlsx"
                  className="bg-lime-800 hover:bg-lime-900 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Excel (.xlsx)</span>
                </a>

                <a
                  href="/kisaanriksha_products_master.csv"
                  download="kisaanriksha_products_master.csv"
                  className="bg-white hover:bg-lime-50 border border-lime-300 text-lime-900 px-3.5 py-2 rounded-xl text-xs font-black shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet size={14} />
                  <span>Download CSV</span>
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/kisaanriksha_products_master.json");
                      const data = await res.json();
                      setParsedProducts(data);
                      setResultMsg(null);
                      scrollToPreview();
                    } catch (e) {
                      alert("Failed to load KisaanRiksha dataset");
                    }
                  }}
                  className="bg-lime-200 hover:bg-lime-300 text-lime-950 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers size={14} />
                  <span>Preview & Upload (124)</span>
                </button>
              </div>
            </div>

            {/* Card 8: Beybey Farms Bhopal Master Dataset (67 Products) */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-6 shadow-xs border border-amber-200/90 flex flex-col justify-between md:col-span-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-amber-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>BeyBeyFarms.com Bhopal Catalog</span>
                  </span>
                  <span className="text-xs text-amber-900 font-bold">67 Bhopal Farm Harvest Items</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Beybey Farms Bhopal (beybeyfarms.com) Pesticide-Free Dataset
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-5">
                  67 organic, ozone-washed Bhopal farm items (Oyster Mushrooms, Farm Palak, Desi Tamatar, Bhopal Veggies, Ghee & Dairy) with pack size variations (100g, 250g, 500g, 1kg) and HD photos.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60">
                <a
                  href="/beybeyfarms_products_master.xlsx"
                  download="beybeyfarms_products_master.xlsx"
                  className="bg-amber-800 hover:bg-amber-900 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download Excel (.xlsx)</span>
                </a>

                <a
                  href="/beybeyfarms_products_master.csv"
                  download="beybeyfarms_products_master.csv"
                  className="bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-2 rounded-xl text-xs font-black shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet size={14} />
                  <span>Download CSV</span>
                </a>

                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/beybeyfarms_products_master.json");
                      const data = await res.json();
                      setParsedProducts(data);
                      setResultMsg(null);
                      scrollToPreview();
                    } catch (e) {
                      alert("Failed to load Beybey Farms dataset");
                    }
                  }}
                  className="bg-amber-200 hover:bg-amber-300 text-amber-950 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers size={14} />
                  <span>Preview & Upload (67)</span>
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
                accept=".xlsx, .xls, .csv, application/json, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
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
            <div id="dataset-preview" className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs scroll-mt-6">
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
                        <td className="py-3 px-4">
                          {p.variations && Array.isArray(p.variations) && p.variations.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {p.variations.map((v: any, vi: number) => (
                                <span
                                  key={vi}
                                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                                >
                                  {v.weight}: ₹{v.price}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 font-medium">1 Standard Pack</span>
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
        {/* 🧹 BULK WIPE / RESET INVENTORY MODAL */}
        {showWipeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Reset & Wipe Produce Database
                  </h3>
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                    ⚠️ Danger Zone • Complete Inventory Reset
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                This will permanently delete <strong>all produce items</strong> uploaded from old CSV/JSON sheets from your
                MongoDB database. This allows you to start clean and upload a brand new catalog without duplicates.
              </p>

              <div className="space-y-3 mb-6">
                <label className="block text-xs font-black text-gray-700">
                  Type <span className="font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  placeholder="Type DELETE"
                  value={wipeConfirmText}
                  onChange={(e) => setWipeConfirmText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-red-200 focus:border-red-600 outline-none text-sm font-black text-red-700 tracking-wider font-mono bg-red-50/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowWipeModal(false);
                    setWipeConfirmText("");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={wipeLoading || wipeConfirmText.trim().toUpperCase() !== "DELETE"}
                  onClick={handleExecuteWipe}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>{wipeLoading ? "Wiping Database..." : "Permanently Wipe from Database"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  </div>
</div>
);
}
