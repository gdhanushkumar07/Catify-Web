/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import JSZip from 'jszip';
import { 
  FileCode, Copy, Check, Download, AlertCircle, 
  Terminal, ShieldCheck, Heart, Sparkles, FolderArchive 
} from 'lucide-react';
import { extensionFiles, generateCatIconBlob } from '../data/extensionFiles';

export default function CodeExporter() {
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const activeFile = extensionFiles[activeFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setZipping(true);
    setZipSuccess(false);
    try {
      const zip = new JSZip();

      // Add text files
      extensionFiles.forEach((file) => {
        zip.file(file.name, file.code);
      });

      // Draw and add custom PNG icons
      const iconsFolder = zip.folder("icons");
      if (iconsFolder) {
        const sizes = [16, 48, 128];
        for (const size of sizes) {
          const iconBlob = await generateCatIconBlob(size);
          iconsFolder.file(`cat_${size}.png`, iconBlob);
        }
      }

      // Generate the ZIP
      const content = await zip.generateAsync({ type: "blob" });
      
      // Trigger a direct browser download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "catify-extension.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (error) {
      console.error("ZIP Generation Failed:", error);
      alert("Could not generate ZIP bundle. Please copy the files manually.");
    } finally {
      setZipping(false);
    }
  };

  return (
    <div id="code-exporter-container" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* File Browser and Overview */}
      <div className="lg:col-span-1 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
            <FolderArchive className="w-4 h-4" />
            <span>Developer Source Hub</span>
          </div>
          <h3 className="text-2xl font-bold font-display tracking-tight text-slate-800">
            Chrome Extension Files
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            This extension is self-contained, uses modern Chrome Manifest V3 APIs, and has zero external dependencies. Choose a file below to inspect its source code.
          </p>
        </div>

        {/* File Navigator Buttons */}
        <div className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
          {extensionFiles.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => {
                setActiveFileIdx(idx);
                setCopied(false);
              }}
              className={`w-full flex items-center justify-between text-left p-3 rounded-lg transition-all ${
                activeFileIdx === idx
                  ? 'bg-gradient-to-r from-rose-50 to-amber-50 text-slate-800 border-l-4 border-rose-500 font-semibold shadow-sm'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCode className={`w-4 h-4 shrink-0 ${activeFileIdx === idx ? 'text-rose-500' : 'text-slate-400'}`} />
                <span className="text-xs font-mono truncate">{file.name}</span>
              </div>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-100 font-bold tracking-wider text-slate-400 shrink-0">
                {file.language}
              </span>
            </button>
          ))}
        </div>

        {/* One-Click Main Download CTA */}
        <div className="bg-gradient-to-tr from-rose-500 to-amber-500 text-white rounded-xl p-6 shadow-md space-y-4 relative overflow-hidden">
          {/* Subtle decorations */}
          <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 pointer-events-none select-none">🐱</div>
          
          <div className="space-y-2">
            <h4 className="font-bold text-base font-display flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 fill-white" />
              Build & Pack Extension
            </h4>
            <p className="text-xs text-white/90 leading-relaxed">
              Downloads the complete package including dynamic, browser-drawn vector icons (`/icons/cat_*.png`) packed perfectly for direct developer installation.
            </p>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={zipping}
            className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-80 py-3 rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
          >
            {zipping ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-800" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Compiling Pack...
              </>
            ) : zipSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Extension ZIP Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download unpacked extension (.zip)
              </>
            )}
          </button>

          {zipSuccess && (
            <div className="text-[10px] text-emerald-100 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Manifest V3 verified, ready to load in Chrome.</span>
            </div>
          )}
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="lg:col-span-2 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden h-[540px]">
        {/* Editor Tab Header */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-rose-500" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold font-mono text-slate-200">{activeFile.name}</span>
              <span className="text-[9px] text-slate-500 font-sans">{activeFile.description}</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 text-xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-auto p-5 font-mono text-xs text-slate-300 leading-relaxed text-left select-text scrollbar-thin">
          <pre className="whitespace-pre">
            <code>
              {activeFile.code}
            </code>
          </pre>
        </div>

        {/* Editor Footer / Info Alert */}
        <div className="bg-slate-950 border-t border-slate-850 px-5 py-2.5 flex items-center gap-2 text-[10px] text-slate-500 font-sans">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>This script queries standard chromium local storage and parses any static/dynamic nodes with type `HTMLImageElement`.</span>
        </div>
      </div>
    </div>
  );
}
