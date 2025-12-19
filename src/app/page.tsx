'use client';

import React from 'react';
import DragDropZone from '@/components/DragDropZone';
import UnifiedPlayer from '@/components/UnifiedPlayer';
import PlaylistQueue from '@/components/PlaylistQueue';
import SearchBar from '@/components/SearchBar';
import { Mic2, Music2, Cast, SkipForward, PlayCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto h-[calc(100vh-3rem)] grid grid-rows-[auto_1fr] gap-6">
        {/* Header */}
        <header className="flex items-center justify-between py-2 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <Mic2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Antigravity Karaoke
              </h1>
              <span className="text-xs text-primary font-medium tracking-wider uppercase">Pro Edition</span>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Toolbars could go here */}
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">

          {/* Left/Top: Player Stage */}
          <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
            <div className="flex-1 bg-black/40 rounded-2xl border border-white/10 p-1 flex flex-col justify-center relative overflow-hidden group">
              {/* Spotlight effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <UnifiedPlayer />
            </div>

            {/* Controls Area (Reduced) */}
            <div className="h-20 glass-panel rounded-xl p-4 flex items-center justify-center">
              <div className="text-center text-gray-500 text-sm">
                Playback Controls Coming Soon
              </div>
            </div>
          </div>

          {/* Right: Playlist */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col min-h-0 bg-black/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Music2 size={20} className="text-primary" />
                Up Next
              </h2>
              <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">Queue</span>
            </div>

            <SearchBar />

            <div className="flex-1 min-h-0 mb-4">
              <PlaylistQueue />
            </div>

            <div className="mt-auto pt-4 border-t border-white/10">
              <DragDropZone compact={true} />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
