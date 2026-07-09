/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Sparkles, Shield, Heart, Zap, Terminal, Puzzle, Info, Download, ArrowRight,
  BookOpen, Eye, Play, FileCode, CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import SimulatedBrowser from './components/SimulatedBrowser';
import VideoTutorial from './components/VideoTutorial';
import CodeExporter from './components/CodeExporter';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'video' | 'code'>('sandbox');

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans antialiased selection:bg-rose-100 selection:text-rose-700">
      
      {/* Top Banner Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500"></div>

      {/* Main Header / Branding Hero */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-amber-700 uppercase tracking-widest font-display shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chrome Extension Pack • Manifest V3</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900"
        >
          🐱 Catify Web
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 leading-relaxed font-sans"
        >
          An open-source developer tool & playground. Build, preview, and export a Google Chrome extension that instantly replaces webpage images with random cat photos fetched dynamically from a public API.
        </motion.p>
      </header>

      {/* Quick Summary / Highlights Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-xl shrink-0">🛠️</div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-800 font-display">Manifest V3 Approved</h4>
              <p className="text-[10px] text-slate-500">Modern security standards</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-xl shrink-0">🐾</div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-800 font-display">Dynamic Cat API</h4>
              <p className="text-[10px] text-slate-500">Infinite cute cat images</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shrink-0">🧩</div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-800 font-display">Developer Ready</h4>
              <p className="text-[10px] text-slate-500">Loaded in Unpacked Mode</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl shrink-0">📂</div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-slate-800 font-display">One-Click Exporter</h4>
              <p className="text-[10px] text-slate-500">Includes auto-generated PNG icons</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section Nav Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex justify-center">
        <div className="inline-flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-5 py-2.5 rounded-lg transition-all text-xs font-bold flex items-center gap-2 ${
              activeTab === 'sandbox'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>1. Interactive Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-5 py-2.5 rounded-lg transition-all text-xs font-bold flex items-center gap-2 ${
              activeTab === 'video'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>2. Video Demo & Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-5 py-2.5 rounded-lg transition-all text-xs font-bold flex items-center gap-2 ${
              activeTab === 'code'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>3. Source Code & ZIP</span>
          </button>
        </div>
      </nav>

      {/* Main Content Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          {activeTab === 'sandbox' && (
            <div className="space-y-6">
              <div className="text-left max-w-2xl">
                <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-800">
                  Interactive Browser Sandbox
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Try out the extension functionality immediately. Toggle the active switch in the floating **Catify popup** (puzzle/cat icon at top-right of the simulator) and watch the travel blog's image elements swap for cute random cats!
                </p>
              </div>
              <SimulatedBrowser />
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-6">
              <div className="text-left max-w-2xl">
                <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-800">
                  Visual Installation Video & Demo
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Learn how to install your newly created custom extension into Google Chrome. Play the simulated video step-by-step or navigate the slides to follow along easily.
                </p>
              </div>
              <VideoTutorial />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-6">
              <div className="text-left max-w-2xl">
                <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-800">
                  Extension Source Hub
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Inspect the source code files for the extension, copy specific portions, or compile and export the final compiled unpacked extension directly as a `.zip` archive!
                </p>
              </div>
              <CodeExporter />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center items-center gap-1.5 text-xs">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>for Chrome Developer Mode • Manifest V3</span>
          </div>
          <p className="text-[10px] text-slate-400 max-w-md mx-auto">
            This workspace utilizes standard, secure runtime practices. The code relies on Google Chrome's public extensions architecture and utilizes public imagery APIs to serve adorable feline photographs.
          </p>
        </div>
      </footer>

    </div>
  );
}

