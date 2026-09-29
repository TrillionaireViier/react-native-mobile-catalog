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
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-3 sm:px-6 py-2.5 sm:py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer touch-manipulation shrink-0" onClick={() => setCurrentTab('catalog')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0b0e17] rounded-[9px] flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-base sm:text-xl text-white tracking-wide leading-none flex items-center gap-1">
                Gamer<span className="text-gradient">Hub</span>
              </h1>
              <span className="text-[9px] text-cyan-400 font-mono tracking-wider hidden sm:block">REACT NATIVE</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-bold' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input Bar (Desktop) */}
          <div className="flex-1 max-w-xs relative hidden lg:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:bg-cyan-500/20 active:scale-95 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all touch-manipulation"
              title="Submit your game"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
              <span className="hidden xs:inline">Submit Game</span>
              <span className="xs:hidden">Submit</span>
            </button>

            {/* Frame View Toggle (Desktop Only) */}
            <button
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-slate-300 text-xs border border-slate-800 transition-all touch-manipulation"
              title="Toggle Mobile Simulator Frame"
            >
              {isMobileFrame ? (
                <>
                  <Monitor className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Mobile Frame</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="mt-2 relative lg:hidden">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search games, mini-games, genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </header>

      {/* Bottom Tab Bar (Mobile Navigation - Hidden on md+ desktop screens) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-2 pt-1.5 pb-safe flex items-center justify-around md:hidden shadow-2xl">
        {[
          { id: 'catalog', label: 'Catalog', icon: Gamepad2 },
          { id: 'trending', label: 'Trending', icon: Flame },
          { id: 'minigames', label: 'Mini', icon: Sparkles },
          { id: 'favorites', label: 'Saved', icon: Heart },
          { id: 'profile', label: 'Profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl transition-all touch-manipulation select-none active:scale-95 ${
                isActive 
                  ? 'text-cyan-400 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isActive ? 'text-cyan-400 scale-110 stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight truncate text-center">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}


