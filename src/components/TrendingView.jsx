import React from 'react';
import { Flame, Trophy, Star, Download, Play, TrendingUp } from 'lucide-react';

export default function TrendingView({ games, onSelect, onPlayMiniGame }) {
  const sortedGames = [...games].sort((a, b) => b.rating - a.rating);

  return (
    <div className="space-y-5 sm:space-y-6 animate-fadeIn pb-28 sm:pb-24">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-5 sm:p-8 overflow-hidden bg-gradient-to-r from-purple-900/60 via-slate-900 to-cyan-900/60 border border-purple-500/30">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5 sm:mb-2">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 shrink-0" /> TOP CHARTS THIS WEEK
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Most Played & Trending
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 sm:mt-2 leading-relaxed">
            Real-time player stats, community ratings, and top downloaded mobile titles across iOS, Android, and Web.
          </p>
        </div>
        <Trophy className="absolute right-4 sm:right-6 bottom-2 sm:bottom-4 w-24 h-24 sm:w-36 sm:h-36 text-amber-400/10 pointer-events-none" />
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2.5 sm:space-y-3">
        {sortedGames.map((game, index) => (
          <div
            key={game.id}
            onClick={() => onSelect(game)}
            className="group relative flex items-center gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-2xl glass-card border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all cursor-pointer active:scale-[0.99] touch-manipulation"
          >
            {/* Rank Badge */}
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-sm sm:text-lg shrink-0 ${
              index === 0 ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30' :
              index === 1 ? 'bg-slate-300 text-slate-950' :
              index === 2 ? 'bg-amber-700 text-amber-100' :
              'bg-slate-800 text-slate-400'
            }`}>
              #{index + 1}
            </div>

            {/* Thumbnail */}
            <img 
              src={game.cover} 
              alt={game.title} 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-700 group-hover:scale-105 transition-transform shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-sm sm:text-base text-white truncate group-hover:text-cyan-400 transition-colors">
                  {game.title}
                </h3>
                {game.badge && (
                  <span className="hidden xs:inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-cyan-500/20 text-cyan-300 uppercase shrink-0">
                    {game.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">{game.developer} • {game.category}</p>
              
              <div className="flex items-center gap-2.5 sm:gap-4 mt-1.5 text-[11px] sm:text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" /> {game.rating}
                </span>
                <span>{game.downloads} dl</span>
                <span className="hidden sm:inline text-slate-500">{game.size}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {game.isMiniGame && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayMiniGame(game);
                  }}
                  className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-transform touch-manipulation flex items-center gap-1"
                  title="Play Instant"
                >
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
                  <span className="hidden sm:inline text-slate-950 font-extrabold text-xs">PLAY</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

