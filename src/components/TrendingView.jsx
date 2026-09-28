import React from 'react';
import { Flame, Trophy, Star, Download, Play, TrendingUp } from 'lucide-react';

export default function TrendingView({ games, onSelect, onPlayMiniGame }) {
  const sortedGames = [...games].sort((a, b) => b.rating - a.rating);

  return (
    <div className="space-y-6 animate-fadeIn pb-24">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-purple-900/60 via-slate-900 to-cyan-900/60 border border-purple-500/30">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> TOP CHARTS THIS WEEK
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
            Most Played & Trending
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Real-time player stats, community ratings, and top downloaded mobile titles across iOS, Android, and Web.
          </p>
        </div>
        <Trophy className="absolute right-6 bottom-4 w-36 h-36 text-amber-400/10 pointer-events-none" />
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {sortedGames.map((game, index) => (
          <div
            key={game.id}
            onClick={() => onSelect(game)}
            className="group relative flex items-center gap-4 p-4 rounded-2xl glass-card border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all cursor-pointer"
          >
            {/* Rank Badge */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-lg flex-shrink-0 ${
              index === 0 ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30' :
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
              className="w-16 h-16 rounded-xl object-cover border border-slate-700 group-hover:scale-105 transition-transform"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white truncate group-hover:text-cyan-400 transition-colors">
                  {game.title}
                </h3>
                {game.badge && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 uppercase">
                    {game.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{game.developer} • {game.category}</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {game.rating}
                </span>
                <span>{game.downloads} dl</span>
                <span className="hidden sm:inline text-slate-500">{game.size}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {game.isMiniGame && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayMiniGame(game);
                  }}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md hover:scale-105 transition-transform"
                  title="Play Instant"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
