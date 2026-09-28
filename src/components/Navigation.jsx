import React from 'react';
import { Gamepad2, Flame, Sparkles, Heart, User, Search, Smartphone, Monitor, PlusCircle } from 'lucide-react';

export default function Navigation({ 
  currentTab, 
  setCurrentTab, 
  searchQuery, 
  setSearchQuery, 
  isMobileFrame, 
  setIsMobileFrame,
  onOpenSubmitModal
}) {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('catalog')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0b0e17] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg text-white tracking-wide leading-none flex items-center gap-1">
                Gamer<span className="text-gradient">Hub</span>
              </h1>
              <span className="text-[10px] text-cyan-400 font-mono tracking-wider">REACT NATIVE</span>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search 1,000+ mobile games, mini-games, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSubmitModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              Submit Game
            </button>

            {/* Frame View Toggle */}
            <button
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs border border-slate-800 transition-colors"
              title="Toggle Mobile Simulator Frame"
            >
              {isMobileFrame ? (
                <>
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Desktop Mode</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Mobile Frame</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="mt-3 relative sm:hidden">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search mobile games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </header>

      {/* Bottom Tab Bar (Mobile Navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800 px-3 py-2 flex items-center justify-around sm:justify-center sm:gap-8">
        {[
          { id: 'catalog', label: 'Catalog', icon: Gamepad2 },
          { id: 'trending', label: 'Trending', icon: Flame },
          { id: 'minigames', label: 'Instant Mini', icon: Sparkles },
          { id: 'favorites', label: 'Saved', icon: Heart },
          { id: 'profile', label: 'Profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-cyan-400 font-bold scale-105' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
