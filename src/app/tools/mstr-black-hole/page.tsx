"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// 1. Core Data Configuration (Dynamic API + Initial Fallback)
const INITIAL_MSTR_HOLDINGS = 762099;
const TOTAL_BTC = 21000000;
const CIRCULATING_BTC = 19600000;

export default function MSTRBitcoinBlackHole() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [mstrHoldings, setMstrHoldings] = useState<number>(INITIAL_MSTR_HOLDINGS);

  // 3. Live API Integration - Fetch live BTC price and MSTR Holdings
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch BTC Price
        const priceRes = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const priceData = await priceRes.json();
        if (priceData?.bitcoin?.usd) {
          setBtcPrice(priceData.bitcoin.usd);
        }

        // Fetch Dynamic MSTR Holdings (Proxied through backend to avoid CORS/429)
        const treasuryRes = await fetch("/api/mstr-holdings");
        const treasuryData = await treasuryRes.json();
        if (treasuryData?.companies) {
          // MSTR is listed as "Strategy" with symbol "MSTR.US" in CoinGecko API
          const mstr = treasuryData.companies.find((c: any) => c.symbol.includes("MSTR"));
          if (mstr && mstr.total_holdings) {
            setMstrHoldings(Math.floor(mstr.total_holdings));
          }
        }
      } catch (error) {
        console.error("Failed to fetch live data:", error);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 60000); // Poll every 60s to avoid rate limits
    return () => clearInterval(interval);
  }, []);

  const totalUsdValue = btcPrice ? mstrHoldings * btcPrice : null;
  const pctTotal = ((mstrHoldings / TOTAL_BTC) * 100).toFixed(4);
  const pctCirculating = ((mstrHoldings / CIRCULATING_BTC) * 100).toFixed(4);

  // 4. The Viral Mechanism - Prepare Twitter URL
  const tweetText = encodeURIComponent(
    `Visualizing the singularity. @MicroStrategy is bending the monetary space-time continuum. $MSTR now commands ${pctCirculating}% of all #Bitcoin that will ever exist. There is no second best. 🕳️🚀 @saylor @Excellion`
  );
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  // Helper for formatting big numbers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    // 1. Visual Vibe: Pitch black background (bg-black), font-mono for terminal feel
    <div className="relative min-h-screen bg-black text-white font-mono overflow-hidden flex flex-col items-center py-12 px-4 sm:px-8 selection:bg-[#F7931A] selection:text-black">
      
      {/* Back to Home Button */}
      <Link href="/tools" className="absolute top-6 left-6 z-50 flex items-center space-x-2 text-gray-500 hover:text-white transition-colors duration-300">
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm tracking-widest uppercase font-semibold">Back to Tools</span>
      </Link>

      {/* Background Cyberpunk Grid/Noise overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at center, #F7931A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* 1. Animated Black Hole (Absolute Center Background) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mt-20">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative flex items-center justify-center"
        >
          {/* Outer Accretion Disk (Bitcoin Orange Glow) */}
          <div className="absolute w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] rounded-full bg-[#F7931A] blur-[100px] opacity-20" />
          
          {/* Inner Event Horizon Glow (Laser Red / Orange mix) */}
          <div className="absolute w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] rounded-full bg-red-600 blur-[50px] opacity-40 mix-blend-screen" />
          
          {/* The Singularity (Pitch Black with Orange Ring) */}
          <div className="relative w-[160px] h-[160px] sm:w-[240px] sm:h-[240px] rounded-full bg-black shadow-[0_0_80px_20px_rgba(247,147,26,0.5)] border border-[#F7931A]/30 flex items-center justify-center">
             {/* Center void texture to make it feel deeply dark */}
             <div className="w-[90%] h-[90%] rounded-full bg-black shadow-[inset_0_0_50px_rgba(0,0,0,1)]" />
          </div>
        </motion.div>
      </div>

      {/* Content wrapper with z-index to sit above the black hole */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl flex-grow justify-between">
        
        {/* Top Header */}
        <div className="w-full text-center space-y-6 mt-12 sm:mt-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-500 text-xs sm:text-sm tracking-[0.5em] uppercase font-bold"
          >
            MICROSTRATEGY // 比特币引力特异点
          </motion.h2>

          {/* 2. Main Holdings Counter */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex items-baseline space-x-3">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-[#F7931A] drop-shadow-[0_0_20px_rgba(247,147,26,0.6)]">
                {mstrHoldings.toLocaleString()}
              </h1>
              <span className="text-2xl sm:text-4xl text-white/90 font-bold tracking-widest uppercase">
                BTC
              </span>
            </div>
          </motion.div>

          {/* Live USD Value */}
          <div className="flex items-center justify-center space-x-3 text-green-400 text-xl md:text-3xl font-semibold drop-shadow-[0_0_10px_rgba(74,222,128,0.3)] h-10 mt-4">
            {/* Live blinking dot */}
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)]"
            />
            <span>
              {totalUsdValue ? formatCurrency(totalUsdValue) : "引力质量计算中..."}
            </span>
          </div>
        </div>

        {/* 2. Metrics Grid Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-40 sm:mt-56 md:mt-64 backdrop-blur-md bg-black/50 border border-[#F7931A]/20 p-6 md:p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          
          {/* % of Total Supply */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-gray-400 uppercase text-xs sm:text-sm tracking-widest">
                占比特币总供应量 (21M)
              </span>
              <span className="text-[#F7931A] font-bold text-lg sm:text-xl">{pctTotal}%</span>
            </div>
            {/* Custom Glowing Progress Bar */}
            <div className="w-full h-3 sm:h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-800 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${pctTotal}%` }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 via-[#F7931A] to-[#F7931A] shadow-[0_0_15px_#F7931A]"
              />
            </div>
          </div>

          {/* % of Circulating Supply */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-gray-400 uppercase text-xs sm:text-sm tracking-widest">
                占当前市场流通量
              </span>
              <span className="text-[#F7931A] font-bold text-lg sm:text-xl">{pctCirculating}%</span>
            </div>
            {/* Custom Glowing Progress Bar */}
            <div className="w-full h-3 sm:h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-800 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${pctCirculating}%` }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 via-[#F7931A] to-[#F7931A] shadow-[0_0_15px_#F7931A]"
              />
            </div>
          </div>

        </div>

        {/* 4. Bottom Viral Action - Deploy to X */}
        <div className="w-full max-w-sm mt-16 sm:mt-24 mb-6">
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full flex items-center justify-center space-x-3 py-4 md:py-5 px-6 bg-black border border-[#F7931A] text-[#F7931A] rounded-xl overflow-hidden transition-all duration-300 hover:bg-[#F7931A] hover:text-black hover:shadow-[0_0_40px_rgba(247,147,26,0.6)] hover:scale-105 active:scale-95"
          >
            {/* Sweep effect on hover */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.974H5.078z" />
            </svg>
            <span className="font-bold uppercase tracking-widest text-sm sm:text-base md:text-lg">
              向 X 广播引力异动
            </span>
          </a>
        </div>
      </div>

    </div>
  );
}
