/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Globe, ArrowLeft, ArrowRight, RotateCw, Shield, 
  ExternalLink, Sparkles, Check, CheckCircle2, RefreshCw, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  originalImage: string;
  defaultCatImage: string;
  description: string;
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Chasing the Perfect Sourdough Pizza in Naples",
    category: "Culinary Travel",
    date: "July 4, 2026",
    readTime: "5 min read",
    originalImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    defaultCatImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
    description: "Deep in the heart of Campania, we seek out the legendary wood-fired ovens that started a worldwide obsession. Here's what we found."
  },
  {
    id: "2",
    title: "Hiking the Dramatic Ridges of Switzerland",
    category: "Adventure",
    date: "June 28, 2026",
    readTime: "8 min read",
    originalImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80",
    defaultCatImage: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&auto=format&fit=crop&q=80",
    description: "A comprehensive guide to traversing the high mountain paths of the Bernese Oberland, where alpine meadows meet soaring icy peaks."
  },
  {
    id: "3",
    title: "Crafting the Ultimate Minimalist Workspace",
    category: "Design",
    date: "June 15, 2026",
    readTime: "4 min read",
    originalImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    defaultCatImage: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&auto=format&fit=crop&q=80",
    description: "How decluttering your desk and prioritizing warm, intentional lighting can dramatically elevate your cognitive focus and creative output."
  },
  {
    id: "4",
    title: "Unwinding on the Hidden Beaches of Okinawa",
    category: "Relaxation",
    date: "May 30, 2026",
    readTime: "6 min read",
    originalImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    defaultCatImage: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80",
    description: "Leaving behind the neon lights of Tokyo, we step onto powdery white sand and turquoise coral reefs on a remote island paradise."
  }
];

export default function SimulatedBrowser() {
  const [extensionActive, setExtensionActive] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [catsCount, setCatsCount] = useState(4);
  const [activeTab, setActiveTab] = useState<'original' | 'catified'>('catified');
  const [loadingCats, setLoadingCats] = useState(false);
  
  // Storage for currently displayed images
  const [displayImages, setDisplayImages] = useState<Record<string, string>>({});

  // Sync state between browser tab view and extension master switch
  useEffect(() => {
    setActiveTab(extensionActive ? 'catified' : 'original');
  }, [extensionActive]);

  // Fetch Cat API images to populate our mock blog posts
  const handleFetchCats = async () => {
    setLoadingCats(true);
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=4');
      if (response.ok) {
        const data = await response.json();
        const newImages: Record<string, string> = {};
        INITIAL_POSTS.forEach((post, idx) => {
          if (data[idx] && data[idx].url) {
            newImages[post.id] = data[idx].url;
          } else {
            newImages[post.id] = post.defaultCatImage;
          }
        });
        setDisplayImages(newImages);
        setCatsCount(prev => prev + 4);
      } else {
        throw new Error('API failed');
      }
    } catch (e) {
      // Fallback
      const newImages: Record<string, string> = {};
      INITIAL_POSTS.forEach((post) => {
        newImages[post.id] = post.defaultCatImage;
      });
      setDisplayImages(newImages);
    } finally {
      setTimeout(() => setLoadingCats(false), 500);
    }
  };

  // Run on mount to pre-fetch some cute cats
  useEffect(() => {
    handleFetchCats();
  }, []);

  const toggleExtension = (active: boolean) => {
    setExtensionActive(active);
    if (active) {
      setCatsCount(prev => prev + 4);
    }
  };

  return (
    <div id="simulated-browser-container" className="bg-slate-900/5 rounded-2xl border border-slate-200 overflow-hidden shadow-xl flex flex-col h-[740px]">
      {/* Chrome Browser Address Bar Header */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-4">
        {/* Navigation Dots & Icons */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400 block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400 block"></span>
            <span className="w-3 h-3 rounded-full bg-green-400 block"></span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400 ml-4">
            <button className="p-1 hover:bg-slate-200 rounded transition-colors" aria-label="Go Back"><ArrowLeft className="w-4 h-4" /></button>
            <button className="p-1 hover:bg-slate-200 rounded transition-colors" aria-label="Go Forward"><ArrowRight className="w-4 h-4" /></button>
            <button 
              onClick={handleFetchCats}
              className={`p-1 hover:bg-slate-200 rounded transition-colors ${loadingCats ? 'animate-spin text-orange-500' : ''}`}
              aria-label="Refresh Images"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Address Input */}
        <div className="flex-1 max-w-xl bg-white border border-slate-200 rounded-lg px-3 py-1 flex items-center gap-2 text-xs text-slate-500 shadow-inner">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-emerald-600 font-medium">https://</span>
          <span className="text-slate-700 font-medium">wanderlust-blog.example.com</span>
          <span className="text-slate-400 ml-auto">/posts</span>
        </div>

        {/* Chrome Extension Actions Bar */}
        <div className="flex items-center gap-2 relative">
          <span className="text-xs text-slate-400 font-mono hidden md:inline">Chrome Sandbox</span>
          
          {/* Extension Icon Puzzle Click */}
          <button 
            id="simulated-extension-icon-btn"
            onClick={() => setPopupOpen(!popupOpen)}
            className={`relative p-2 rounded-lg transition-all ${
              popupOpen 
                ? 'bg-amber-100 text-amber-600 border border-amber-300' 
                : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 shadow-sm'
            }`}
            title="Catify Web Extension"
          >
            <span className="text-base select-none">🐱</span>
            {extensionActive && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white animate-pulse"></span>
            )}
          </button>

          {/* Simulated Chrome Extension Popover Popup */}
          <AnimatePresence>
            {popupOpen && (
              <motion.div 
                id="simulated-extension-popup"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-20 font-sans text-left"
              >
                {/* Header of Popup */}
                <div className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🐱</span>
                    <span className="font-bold text-sm font-display tracking-wide">Catify Web</span>
                  </div>
                  <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">v1.0</span>
                </div>

                {/* Body of Popup */}
                <div className="p-4 space-y-4">
                  {/* Extension Master Toggle */}
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Enable Catify</div>
                      <div className="text-[10px] text-slate-500">Replace webpage images</div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button 
                      id="simulated-popup-toggle-switch"
                      onClick={() => toggleExtension(!extensionActive)}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                        extensionActive ? 'bg-rose-500' : 'bg-slate-300'
                      }`}
                    >
                      <span 
                        className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                          extensionActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Counter Statistic Panel */}
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Cats Loaded</div>
                      <div className="text-[10px] text-slate-500 font-mono">Real-time session total</div>
                    </div>
                    <div className="text-2xl font-black text-rose-500 tracking-tight font-display">
                      {catsCount}
                    </div>
                  </div>

                  {/* Settings Utilities */}
                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                    <button 
                      onClick={handleFetchCats}
                      disabled={loadingCats || !extensionActive}
                      className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium py-1.5 px-3 bg-rose-50 hover:bg-rose-100 disabled:bg-slate-100 disabled:text-slate-400 text-rose-600 rounded transition-colors"
                    >
                      <RefreshCw className={`w-3 h-3 ${loadingCats ? 'animate-spin' : ''}`} />
                      Fetch New Cats
                    </button>
                    <button 
                      onClick={() => setCatsCount(0)}
                      className="text-[11px] font-medium py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition-colors"
                    >
                      Reset Stat
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-4 py-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
                  Running on chrome://extensions in Developer Mode
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Control Panel in Sandbox */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs text-slate-500">
        <div className="flex gap-4 items-center">
          <span className="font-semibold text-slate-700">Displaying Page Images:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60">
            <button 
              onClick={() => toggleExtension(false)}
              className={`px-3 py-1 rounded-md transition-colors font-medium flex items-center gap-1.5 ${
                activeTab === 'original' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Original Images
            </button>
            <button 
              onClick={() => toggleExtension(true)}
              className={`px-3 py-1 rounded-md transition-colors font-medium flex items-center gap-1.5 ${
                activeTab === 'catified' 
                  ? 'bg-rose-500 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Catified Cats
            </button>
          </div>
        </div>

        {extensionActive && (
          <div className="flex items-center gap-2 text-rose-600 font-medium bg-rose-50 px-2.5 py-1 rounded-full animate-pulse border border-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Catify Active
          </div>
        )}
      </div>

      {/* Simulated Webpage Content Container */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6 sm:p-8 space-y-8 scrollbar-thin">
        {/* Simulated Website Header */}
        <div className="text-center space-y-3 max-w-lg mx-auto pb-6 border-b border-slate-200">
          <span className="text-[10px] tracking-widest font-black uppercase text-amber-500 font-display">Epicurean & Beyond</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-800 tracking-tight">The Wanderlust Gazette</h1>
          <p className="text-xs text-slate-500">Documenting human flavors, grand ridges, and creative workspaces around our shared solar orbit.</p>
        </div>

        {/* Simulated Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_POSTS.map((post) => {
            const isCatified = activeTab === 'catified';
            const displaySrc = isCatified 
              ? (displayImages[post.id] || post.defaultCatImage) 
              : post.originalImage;

            return (
              <article 
                key={post.id} 
                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow flex flex-col group"
              >
                {/* Simulated Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={displaySrc}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={displaySrc}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  </AnimatePresence>

                  {/* Indicator overlay */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900/75 backdrop-blur-sm text-[10px] font-medium text-white tracking-wide">
                      {post.category}
                    </span>
                    {isCatified && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm flex items-center gap-1 animate-bounce">
                        🐾 Catified
                      </span>
                    )}
                  </div>

                  {/* Dimensions overlay */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-900/60 text-[10px] font-mono text-white select-none">
                    600 × 338
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-4 flex-1 flex flex-col space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-amber-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-xs text-slate-500 line-clamp-2 flex-1">
                    {post.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Static Call To Action */}
        <div className="bg-slate-100 rounded-xl p-6 text-center space-y-3 border border-slate-200 max-w-md mx-auto">
          <h3 className="font-semibold text-slate-800 text-sm">Love what we're building?</h3>
          <p className="text-xs text-slate-500">Download the extension in the sections below, load it unpacked, and take catified surfing anywhere!</p>
        </div>
      </div>
    </div>
  );
}
