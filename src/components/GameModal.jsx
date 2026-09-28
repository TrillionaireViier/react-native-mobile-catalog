import React, { useState } from 'react';
import { X, Star, Download, Play, Shield, CheckCircle2, Heart, Share2, Sparkles, MessageSquare } from 'lucide-react';

export default function GameModal({ game, onClose, onPlayMiniGame, isFavorite, onToggleFavorite }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, screenshots, reviews
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    { id: 1, user: 'CyberGamer_99', rating: 5, date: '2 days ago', text: 'Insane visuals and super responsive controls! One of the best games this year.' },
    { id: 2, user: 'NeonRider', rating: 4, date: '1 week ago', text: 'Great soundtrack and addicting gameplay loop. Highly recommended.' }
  ]);

  if (!game) return null;

  const handleDownload = () => {
    setDownloading(true);
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloading(false), 800);
          return 100;
        }
        return prev + 18;
      });
    }, 250);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviews([
      { id: Date.now(), user: 'You (GamerHub Pro)', rating: userRating, date: 'Just now', text: reviewText },
      ...reviews
    ]);
    setReviewText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-lg animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111625] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl text-slate-100 my-auto">
        
        {/* Banner Image Header */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900">
          <img 
            src={game.banner || game.cover} 
            alt={game.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111625] via-[#111625]/40 to-transparent" />

          {/* Close & Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/90 text-slate-950 backdrop-blur-md">
              {game.badge || 'GAME SPEC'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(game.id)}
                className="p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-white hover:text-rose-400 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Header Content Info */}
        <div className="px-6 -mt-10 relative z-10">
          <div className="flex items-end gap-4">
            <img 
              src={game.cover} 
              alt={game.title} 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-500 shadow-xl shadow-cyan-500/20"
            />
            <div className="flex-1 pb-1">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">{game.title}</h2>
              <p className="text-xs text-cyan-400 font-semibold">{game.developer} • <span className="uppercase">{game.category}</span></p>
            </div>
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-3 gap-2 mt-4 py-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {game.rating}
              </div>
              <span className="text-[10px] text-slate-400">{game.reviewsCount} Reviews</span>
            </div>
            <div className="border-x border-slate-800">
              <span className="font-bold text-sm text-white">{game.downloads}</span>
              <span className="text-[10px] text-slate-400 block">Downloads</span>
            </div>
            <div>
              <span className="font-bold text-sm text-cyan-400 font-mono">{game.size}</span>
              <span className="text-[10px] text-slate-400 block">{game.version}</span>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="flex border-b border-slate-800 mt-5 px-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('screenshots')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'screenshots' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Screenshots
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[280px] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4 text-sm text-slate-300">
              <p className="leading-relaxed">{game.description}</p>
              
              <h4 className="font-display font-bold text-white text-base pt-2">Key Game Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {game.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'screenshots' && (
            <div className="grid grid-cols-2 gap-3">
              {game.screenshots?.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt="Game Screenshot" 
                  className="rounded-xl border border-slate-800 object-cover w-full h-32 hover:scale-105 transition-transform"
                />
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Add Review */}
              <form onSubmit={handleAddReview} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Rate this game</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="text-amber-400"
                      >
                        <Star className={`w-4 h-4 ${star <= userRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a quick gamer review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
                  >
                    Post
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{rev.user}</span>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300">{rev.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {game.isMiniGame && (
            <button
              onClick={() => {
                onClose();
                onPlayMiniGame(game);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              PLAY INSTANT DEMO
            </button>
          )}

          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`w-full ${game.isMiniGame ? 'sm:flex-1' : 'w-full'} py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              downloadProgress === 100
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-cyan-500/20'
            }`}
          >
            {downloading ? (
              downloadProgress === 100 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> INSTALLED / DOWNLOADED!
                </>
              ) : (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  DOWNLOADING ({downloadProgress}%)
                </>
              )
            ) : (
              <>
                <Download className="w-4 h-4" /> DOWNLOAD APK / EXPO ({game.size})
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
