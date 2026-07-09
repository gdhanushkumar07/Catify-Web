/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Play, Pause, ChevronLeft, ChevronRight, Download, 
  Settings, FolderOpen, Puzzle, HelpCircle, Laptop, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Step {
  title: string;
  duration: string;
  description: string;
  badge: string;
}

const STEPS: Step[] = [
  {
    title: "Download & Extract Zip",
    duration: "0:05",
    description: "Click the 'Download Extension' button to receive the full source code packaged inside 'catify-extension.zip'. Locate this file in your Downloads folder and extract it (or unzip it) to a memorable place like your Desktop.",
    badge: "Step 1: File Prep"
  },
  {
    title: "Navigate to Extensions",
    duration: "0:12",
    description: "Open Google Chrome, open a new browser tab, and type 'chrome://extensions' directly into the address bar, then press Enter. Alternatively, you can click the Chrome Menu (three dots) > Extensions > Manage Extensions.",
    badge: "Step 2: Chrome Setup"
  },
  {
    title: "Enable Developer Mode",
    duration: "0:20",
    description: "In the top-right corner of the Chrome Extensions dashboard, find the toggle switch labeled 'Developer Mode'. Toggle it to the ON position. You will see a new action bar appear with extra utilities.",
    badge: "Step 3: Dev Switch"
  },
  {
    title: "Click 'Load unpacked'",
    duration: "0:28",
    description: "Locate and click the button labeled 'Load unpacked' in the newly visible action bar (usually on the upper-left). This is Chrome's feature to compile and install custom local extensions.",
    badge: "Step 4: Install Entry"
  },
  {
    title: "Select Extracted Folder",
    duration: "0:36",
    description: "A system file dialog will appear. Browse to the extracted 'catify-extension' folder (the folder containing manifest.json) and select it. Click Open/Select. The extension will mount instantly!",
    badge: "Step 5: Load Directory"
  },
  {
    title: "Pin & Enjoy Catifying!",
    duration: "0:45",
    description: "Click the Extensions 'Puzzle' icon in Chrome's top bar and pin 'Catify Web'. Now navigate to any image-rich webpage (like Google Images or News) and watch as the extension swaps everything for beautiful cats!",
    badge: "Step 6: Completion"
  }
];

export default function VideoTutorial() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-playing steps slideshow timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Move to next step
            setActiveStep(current => {
              if (current < STEPS.length - 1) {
                return current + 1;
              } else {
                setIsPlaying(false);
                return 0; // Reset
              }
            });
            return 0;
          }
          return prev + 2.5; // Controls pacing speed (100 / 40 ticks = ~4 seconds per step)
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync progress bar to manual step changes
  useEffect(() => {
    if (!isPlaying) {
      setProgress((activeStep / (STEPS.length - 1)) * 100);
    }
  }, [activeStep, isPlaying]);

  const handleStepSelect = (index: number) => {
    setIsPlaying(false);
    setActiveStep(index);
    setProgress((index / (STEPS.length - 1)) * 100);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setActiveStep(current => Math.max(0, current - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setActiveStep(current => Math.min(STEPS.length - 1, current + 1));
  };

  return (
    <div id="video-demo-card" className="bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col lg:flex-row h-auto lg:h-[480px]">
      
      {/* Visual Animation Viewport (Simulating Webpage / Screen) */}
      <div className="flex-1 bg-slate-950 p-6 flex flex-col justify-between relative overflow-hidden h-[300px] lg:h-full">
        {/* Floating watermark */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10 text-[10px] tracking-widest font-black uppercase text-slate-500 font-display">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          Simulated Install Video Demo
        </div>

        {/* Dynamic visual stage */}
        <div className="flex-1 flex items-center justify-center relative mt-6">
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div 
                key="step-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center border-4 border-amber-400 shadow-lg text-4xl"
                  >
                    📦
                  </motion.div>
                  <Download className="absolute -bottom-2 -right-2 w-7 h-7 text-white bg-slate-800 p-1.5 rounded-full border-2 border-slate-950" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-amber-400 font-display">catify-extension.zip</h4>
                  <p className="text-[11px] text-slate-400 font-mono">Size: 42 KB • Fully compiled</p>
                </div>
                {/* Arrow representing extraction */}
                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
                  <FolderOpen className="w-4 h-4 text-rose-400" />
                  <span>Extracting unpacked files...</span>
                </div>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div 
                key="step-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-xl"
              >
                <div className="bg-slate-850 px-3 py-1.5 border-b border-slate-800 flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <div className="ml-2 flex-1 bg-slate-950 px-2 py-0.5 rounded text-left flex items-center gap-1.5 font-mono text-emerald-400">
                    <span>chrome://</span>
                    <motion.span 
                      animate={{ opacity: [1, 0, 1] }} 
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >extensions</motion.span>
                  </div>
                </div>
                <div className="p-4 text-center space-y-2">
                  <Laptop className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-xs text-slate-300">Opening Extensions Portal</p>
                  <p className="text-[10px] text-slate-500">Enable advanced features inside Google Chrome</p>
                </div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div 
                key="step-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between w-72"
              >
                <div>
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">Developer Mode</h4>
                  <p className="text-[10px] text-slate-500">Enable unpacked plugins</p>
                </div>
                
                {/* Toggling Switch animation */}
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-sky-500/20 pointer-events-none"
                  ></motion.div>
                  <div className="w-12 h-6 rounded-full bg-sky-500 p-0.5 flex items-center justify-end">
                    <div className="w-5 h-5 rounded-full bg-white shadow"></div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div 
                key="step-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center space-y-4"
              >
                {/* Simulated Unpacked buttons panel */}
                <div className="flex gap-2.5 bg-slate-900 border border-slate-800 p-3 rounded-lg">
                  <motion.button 
                    animate={{ 
                      backgroundColor: ['rgba(56, 189, 248, 0.1)', 'rgba(56, 189, 248, 0.25)', 'rgba(56, 189, 248, 0.1)']
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="px-3 py-1.5 rounded bg-sky-500/20 text-sky-400 text-xs font-semibold border border-sky-500/30 shadow-md flex items-center gap-1"
                  >
                    📁 Load unpacked
                  </motion.button>
                  <button className="px-3 py-1.5 rounded bg-slate-800 text-slate-400 text-xs border border-slate-700/50">
                    Pack extension
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 text-center max-w-[240px]">
                  Fires the local directories finder to import the root folder.
                </p>
              </motion.div>
            )}

            {activeStep === 4 && (
              <motion.div 
                key="step-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3 shadow-2xl"
              >
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 pb-2 border-b border-slate-800">
                  <span>File Browser: Select Root</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Unpacked folder</span>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center gap-2 p-1 bg-rose-500/10 text-rose-400 rounded border border-rose-500/20">
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>catify-extension-unpacked/</span>
                  </div>
                  <div className="pl-6 text-[10px] text-slate-500 space-y-1">
                    <div>📄 manifest.json</div>
                    <div>📄 content.js</div>
                    <div>📄 popup.html</div>
                    <div>📁 icons/</div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 text-[11px]">
                  <span className="px-2.5 py-1 text-slate-400">Cancel</span>
                  <span className="px-3 py-1 bg-rose-500 text-white rounded font-bold">Select Folder</span>
                </div>
              </motion.div>
            )}

            {activeStep === 5 && (
              <motion.div 
                key="step-5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center space-y-3"
              >
                <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white text-3xl shadow-lg border-2 border-white">
                  🐱
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-center">
                    <CheckCircle className="w-4 h-4" /> 
                    Extension Successfully Loaded!
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Pin 'Catify Web' in the top-right extensions tray and unleash adorable cats on any page.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video Player Bottom Controls bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
          {/* Progress Timeline Scrubber */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer">
            <div 
              style={{ width: `${progress}%` }} 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-100"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            {/* Play/Pause & Navigation buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-white"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button 
                onClick={handlePrev} 
                disabled={activeStep === 0}
                className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext} 
                disabled={activeStep === STEPS.length - 1}
                className="p-1 hover:bg-slate-800 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="font-mono text-[10px] text-slate-500">
                {STEPS[activeStep].duration} / 0:45
              </span>
            </div>

            {/* Quick Step Indicators */}
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span className="text-white font-bold">{activeStep + 1}</span>
              <span className="text-slate-600">/</span>
              <span>{STEPS.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Info Box (Explains step text on the right) */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col justify-between bg-slate-900/50">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider font-bold bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded uppercase">
              {STEPS[activeStep].badge}
            </span>
          </div>

          <h3 className="text-lg font-bold font-display tracking-tight text-white line-clamp-1">
            {STEPS[activeStep].title}
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            {STEPS[activeStep].description}
          </p>
        </div>

        {/* List of step checkpoints */}
        <div className="pt-6 border-t border-slate-800 space-y-1.5 hidden lg:block">
          {STEPS.map((step, idx) => (
            <button
              key={idx}
              onClick={() => handleStepSelect(idx)}
              className={`w-full flex items-center justify-between text-left px-2 py-1.5 rounded transition-all ${
                activeStep === idx 
                  ? 'bg-rose-500/10 text-rose-400 border-l-2 border-rose-500' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-[11px] font-medium truncate">{idx + 1}. {step.title}</span>
              <span className="text-[9px] font-mono opacity-60">{step.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
