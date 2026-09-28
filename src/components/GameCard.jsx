import React from 'react';
import { Star, Download, Play, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function GameCard({ game, onSelect, onPlayMiniGame, isFavorite, onToggleFavorite }) {
  return (
    <div className="group relative rounded-2xl glass-card border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 overflow-hidden flex flex-col">
      
      {/* Cover Image Header */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-900">
        <img 
          src={game.cover} 
          alt={game.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141926] via-transparent to-black/30" />

        {/* Badge Tag */}
        {game.badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/90 text-slate-950 backdrop-blur-md shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-slate-950" />
            {game.badge}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-slate-300 hover:text-rose-400 transition-colors"
          title="Add to Favorites"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Instant Play Overlay Button for Mini-Games */}
        {game.isMiniGame && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayMiniGame(game);
            }}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 hover:scale-105 transition-transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            PLAY INSTANT
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between" onClick={() => onSelect(game)}>
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-cyan-400 uppercase tracking-wide text-[11px]">{game.category}</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {game.rating}
            </span>
          </div>

          <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {game.title}
          </h3>
          
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Meta Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{game.downloads}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
            {game.size}
          </span>
        </div>

      </div>

    </div>
  );
}
