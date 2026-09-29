import React, { useState } from 'react';
import { User, Shield, Award, Sparkles, Heart, Gamepad2, Settings, PlusCircle, CheckCircle2 } from 'lucide-react';

export default function ProfileView({ favoriteGames, onOpenSubmitModal }) {
  const user = {
    username: 'Alex_Viper',
    tag: '#9984',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    level: 42,
    xp: 8450,
    nextLevelXp: 10000,
    rank: 'Cyber Legend',
    gamesPlayed: 148,
    achievements: [
      { title: 'Synthwave Master', desc: 'Score 500+ in Cyber Runner 2099', icon: '⚡' },
      { title: 'Arcade Destroyer', desc: 'Break 100 bricks in Neon Breakout', icon: '🧱' },
      { title: 'Catalog Explorer', desc: 'Save 5+ mobile titles to favorites', icon: '❤️' }
    ]
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fadeIn pb-28 sm:pb-24 max-w-4xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="relative rounded-3xl glass-card p-5 sm:p-8 border border-slate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left relative z-10">
          
          {/* Avatar */}
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.username} 
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-cyan-500 shadow-xl shadow-cyan-500/20"
            />
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] sm:text-xs font-mono shadow-md">
              LVL {user.level}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-display font-extrabold text-xl sm:text-3xl text-white">
                  {user.username} <span className="text-slate-500 font-mono text-sm sm:text-base">{user.tag}</span>
                </h2>
                <span className="inline-block px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-purple-500/20 text-purple-300 uppercase mt-1 border border-purple-500/30">
                  {user.rank}
                </span>
              </div>

              <button
                onClick={onOpenSubmitModal}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 touch-manipulation"
              >
                <PlusCircle className="w-4 h-4" /> SUBMIT YOUR GAME
              </button>
            </div>

            {/* XP Progress */}
            <div className="pt-1">
              <div className="flex justify-between text-[11px] sm:text-xs text-slate-400 mb-1">
                <span>Gamer XP Progress</span>
                <span className="font-mono text-cyan-400">{user.xp} / {user.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2.5 sm:h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-1000"
                  style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Gamer Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="p-3 sm:p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mx-auto mb-1" />
          <span className="font-display font-extrabold text-lg sm:text-xl text-white block">{user.gamesPlayed}</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">Played</span>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 mx-auto mb-1 fill-rose-500/20" />
          <span className="font-display font-extrabold text-lg sm:text-xl text-white block">{favoriteGames.length}</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">Saved</span>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl glass-card border border-slate-800 text-center">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mx-auto mb-1" />
          <span className="font-display font-extrabold text-lg sm:text-xl text-white block">{user.achievements.length}</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 block truncate">Badges</span>
        </div>
      </div>

      {/* Badges / Achievements List */}
      <div className="rounded-3xl glass-card p-5 sm:p-6 border border-slate-800 space-y-3 sm:space-y-4">
        <h3 className="font-display font-bold text-base sm:text-lg text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400 shrink-0" /> Gamer Badges & Milestones
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {user.achievements.map((ach, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3">
              <span className="text-xl sm:text-2xl shrink-0">{ach.icon}</span>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">{ach.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

