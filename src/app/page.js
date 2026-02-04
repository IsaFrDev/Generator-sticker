"use client";

import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const t = {
    title: "AI Sticker Generator",
    subtitle: "Create stunning realistic stickers in seconds",
    placeholder: "Describe your sticker (e.g. 'a happy realistic dog')...",
    button: "Generate",
    download: "Download",
    history: "My Gallery"
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);

    try {
      // Public tunnel URL for mobile compatibility
      const BACKEND_URL = 'https://happy-maps-draw.loca.lt';

      const response = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({ text: prompt, user_id: 'web_user' })
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        const text = await response.text();
        if (text.includes("<html>")) {
          throw new Error("Tunnel security landing page detected. Please open " + BACKEND_URL + " in your browser, click 'Click to Continue', and then come back here.");
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate image');
      }

      if (data.file_url) {
        setImageUrl(`${BACKEND_URL}${data.file_url}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-indigo-500">
      <Head>
        <title>{t.title} | Premium AI Platform</title>
      </Head>

      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          STKR.AI
        </div>
        <div className="flex gap-4 items-center">
          <button className="text-slate-400 hover:text-white transition-colors">{t.history}</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-20 pb-12 flex flex-col items-center">
        {/* Hero Section */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-6 tracking-tight">
          {t.title}
        </h1>
        <p className="text-xl text-slate-400 text-center mb-12 max-w-2xl">
          {t.subtitle}
        </p>

        {/* Generator Box */}
        <div className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder={t.placeholder}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ...
                </div>
              ) : t.button}
            </button>
          </div>

          {/* Preview Area */}
          <div className="relative aspect-square max-w-sm mx-auto bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 group">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Result" className="w-full h-full object-contain" />
                <a
                  href={imageUrl}
                  download
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {t.download}
                </a>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-12 text-center">
                <div className="w-20 h-20 mb-4 opacity-20 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-3xl blur-2xl"></div>
                <p className="relative z-10">{loading ? "Magic is happening..." : "Your creation will appear here"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Features/Styles */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-center">
          <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-2xl">
            <span className="block text-2xl mb-2">📸</span>
            <span className="text-sm font-medium text-slate-400">Ultra Realistic</span>
          </div>
          <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-2xl">
            <span className="block text-2xl mb-2">✂️</span>
            <span className="text-sm font-medium text-slate-400">Clean Edges</span>
          </div>
          <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-2xl">
            <span className="block text-2xl mb-2">⚡</span>
            <span className="text-sm font-medium text-slate-400">Fast Generation</span>
          </div>
          <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-2xl">
            <span className="block text-2xl mb-2">🖼️</span>
            <span className="text-sm font-medium text-slate-400">4K Resolution</span>
          </div>
        </div>
      </main>
    </div>
  );
}
