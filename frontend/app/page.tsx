"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, FileText, Tag, Cpu, Image as ImageIcon, Sparkles, CheckCircle2,
  Calendar, Clock, User, Landmark, Coins, Hash, ShieldCheck, Phone, Mail,
  FolderOpen, PlusCircle
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Added Progress state
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Simulation logic for the progress bar
  useEffect(() => {
    let interval: any;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev; // Stay at 95 until finished
          const increment = prev < 40 ? 5 : prev < 70 ? 2 : 0.5; // Slow down as it goes
          return prev + increment;
        });
      }, 400);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const apiUrl = rawUrl.replace(/\/$/, ""); 
      
      console.log("🚀 Connecting to AI Brain at:", apiUrl);

      const response = await fetch(`${apiUrl}/api/v1/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      
      const data = await response.json();
      setResult(data);
      
      if (!data.error) {
        setHistory(prev => [{
          id: Date.now(),
          image: preview,
          category: data.category,
          entities: data.entities
        }, ...prev]);
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to API. Your AI Brain is likely waking up from its Free Tier sleep. Please wait 30 seconds and try again!");
    } finally {
      setLoading(false);
      setProgress(100); // Set to full when done
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const getEntityStyling = (key: string) => {
    switch(key.toLowerCase()) {
      case 'amount': return { icon: <Coins className="w-4 h-4 text-amber-500" />, label: 'Amount' };
      case 'date': return { icon: <Calendar className="w-4 h-4 text-blue-500" />, label: 'Date' };
      case 'time': return { icon: <Clock className="w-4 h-4 text-sky-500" />, label: 'Time' };
      case 'person': return { icon: <User className="w-4 h-4 text-purple-500" />, label: 'Person' };
      case 'bank': return { icon: <Landmark className="w-4 h-4 text-emerald-600" />, label: 'Bank' };
      case 'document_no': return { icon: <Hash className="w-4 h-4 text-slate-500" />, label: 'Document No.' };
      case 'tax_id': return { icon: <ShieldCheck className="w-4 h-4 text-rose-500" />, label: 'Tax ID' };
      case 'phone': return { icon: <Phone className="w-4 h-4 text-teal-500" />, label: 'Phone' };
      case 'email': return { icon: <Mail className="w-4 h-4 text-indigo-500" />, label: 'Email' };
      default: return { icon: <Tag className="w-4 h-4 text-gray-400" />, label: key };
    }
  };

  const groupedHistory: Record<string, any[]> = history.reduce((folders, item) => {
    const category = item.category || "Uncategorized";
    if (!folders[category]) folders[category] = [];
    folders[category].push(item);
    return folders;
  }, {} as Record<string, any[]>);

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[#f6f8fb] text-slate-800 font-sans selection:bg-blue-200 pb-24">
      
      {/* Abstract Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-10%] w-[400px] h-[400px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-12 space-y-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-4 pt-8"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/40 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 mb-2">
            <Sparkles className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Smart Screenshot Organizer
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto font-medium">
            Upload a Thai receipt, document, or chat. Our AI will extract, analyze, and categorize it instantly.
          </p>
        </motion.div>

        {/* Main Analyzer Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT: Upload Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 flex flex-col h-full"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
              <ImageIcon className="w-5 h-5 text-blue-500" /> 
              Input Image
            </h2>
            
            <label className="relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-blue-200/80 bg-blue-50/30 rounded-[1.5rem] cursor-pointer hover:bg-blue-50/50 hover:border-blue-400 transition-all duration-300 group overflow-hidden shadow-inner">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.img 
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    src={preview} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-full object-contain p-2 drop-shadow-md" 
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center pt-5 pb-6 text-blue-500 group-hover:scale-105 transition-transform duration-300"
                  >
                    <UploadCloud className="w-12 h-12 mb-3 text-blue-400" />
                    <p className="mb-2 text-sm font-semibold">Click to upload or drag and drop</p>
                    <p className="text-xs text-blue-400/80">PNG, JPG or WEBP</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={!file || loading}
              className={`mt-6 w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex justify-center items-center gap-2 ${
                !file || loading 
                  ? 'bg-slate-300 shadow-none cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-blue-500/25'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Cpu className="w-5 h-5" /> Analyze Screenshot
                </>
              )}
            </motion.button>
          </motion.div>

          {/* RIGHT: Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 min-h-[500px] flex flex-col relative"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
              <FileText className="w-5 h-5 text-indigo-500" /> 
              AI Analysis
            </h2>
            
            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60">
                <Tag className="w-16 h-16 mb-4 text-slate-300" />
                <p className="font-medium text-lg">Awaiting Image...</p>
              </div>
            )}

            {/* PROGRESS BAR UI - Added */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-indigo-500 w-full px-4">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
                <p className="font-bold text-lg mb-2 animate-pulse text-indigo-600">Extracting Thai Details...</p>
                
                {/* Visual Progress Bar */}
                <div className="w-full h-3 bg-slate-200/50 rounded-full overflow-hidden border border-white/50 shadow-inner">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </div>
                <p className="mt-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-tighter">
                  System Load: {Math.round(progress)}%
                </p>
                <p className="mt-8 text-center text-xs text-slate-400 max-w-[200px]">
                  Wait for {Math.round(progress)}%... The AI Brain is processing your image.
                </p>
              </div>
            )}

            {result && !result.error && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pb-16"
              >
                <div className="bg-white/50 rounded-2xl p-4 border border-white/80 shadow-sm flex items-center justify-between">
                  <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Category</span>
                  <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full font-bold shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    {result.category}
                  </div>
                </div>
                
                <div>
                  <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider ml-1">Extracted Data</span>
                  <div className="bg-white/50 rounded-2xl p-2 mt-2 border border-white/80 shadow-sm divide-y divide-slate-100/50">
                    {Object.entries(result?.entities || {}).length > 0 ? (
                      Object.entries(result?.entities || {}).map(([key, val]: any) => {
                        const style = getEntityStyling(key);
                        return (
                          <div key={key} className="flex justify-between items-center p-3 hover:bg-white/40 transition-colors rounded-xl">
                            <div className="flex items-center gap-2">
                              {style.icon}
                              <span className="font-bold text-slate-700">{style.label}</span>
                            </div>
                            <span className="bg-slate-100/80 px-3 py-1 rounded-lg text-slate-800 font-mono text-sm shadow-sm border border-slate-200/50 text-right max-w-[50%] break-words">
                              {val ? val.join(", ") : "-"}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-sm font-medium">No specific entities detected in this image.</div>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider ml-1">Raw OCR</span>
                  <div className="bg-[#1e293b]/90 backdrop-blur-md text-emerald-400 p-4 rounded-2xl mt-2 font-mono text-xs shadow-inner h-36 overflow-y-auto whitespace-pre-wrap border border-slate-700">
                    {result.raw_text}
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="w-full py-3 bg-white/80 hover:bg-white text-indigo-600 border border-indigo-100 rounded-xl font-bold shadow-sm transition-all duration-300 flex justify-center items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" /> Process Another Image
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* History Gallery */}
        {history.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="pt-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-white/50 backdrop-blur-md rounded-xl shadow-sm border border-white/60">
                <FolderOpen className="w-6 h-6 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800">Smart Folders</h2>
              <span className="ml-2 bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-bold shadow-sm">
                {history.length} Total
              </span>
            </div>

            <div className="space-y-8">
              {Object.keys(groupedHistory).map((categoryName) => {
                const items = groupedHistory[categoryName];
                return (
                  <div key={categoryName} className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[2rem] p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 ml-2">
                      <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-widest">{categoryName}</h3>
                      <span className="ml-2 bg-white/70 text-indigo-700 text-sm py-0.5 px-3 rounded-full font-bold shadow-sm">
                        {items.length} Items
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      <AnimatePresence>
                        {items.map((item: any) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl overflow-hidden flex flex-col group"
                          >
                            <div className="h-40 bg-slate-100/50 relative overflow-hidden border-b border-white/50 p-4 flex items-center justify-center">
                              <img src={item.image} alt="Categorized item" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" />
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                              <div className="text-sm font-semibold text-slate-600 truncate mt-1">
                                {item.entities?.amount ? `Amount: ${item.entities.amount[0]}` : "Data Extracted"}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}