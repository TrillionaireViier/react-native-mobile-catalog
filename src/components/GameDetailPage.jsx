import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, Download, Play, Heart, Share2, Shield, CheckCircle2, 
  Sparkles, MessageSquare, Smartphone, Cpu, HardDrive, Check, Copy, Gamepad2 
} from 'lucide-react';
import GameCard from './GameCard';

export default function GameDetailPage({ 
  game, 
  allGames, 
  onBack, 
  onPlayMiniGame, 
  isFavorite, 
  onToggleFavorite,
  onSelectOtherGame 
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, screenshots, reviews, specs
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeImageLightbox, setActiveImageLightbox] = useState(null);

  const [reviews, setReviews] = useState([
    { id: 1, user: 'CyberGamer_99', rating: 5, date: '2 days ago', text: 'Insane visuals and super responsive controls! One of the best mobile titles this year.' },
    { id: 2, user: 'NeonRider', rating: 4, date: '1 week ago', text: 'Great soundtrack and addicting gameplay loop. Plays flawlessly on React Native.' },
    { id: 3, user: 'ViperX_Gamer', rating: 5, date: '3 weeks ago', text: 'Downloaded instantly. 60 FPS performance and great touch controls!' }
  ]);

  // Scroll to top when game subpage opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [game.id]);

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

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#game=${game.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filter related games in the same category
  const relatedGames = allGames
    .filter(g => g.id !== game.id && (g.category === game.category || g.isMiniGame === game.isMiniGame))
    .slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-28 sm:pb-24 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb & Action Controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all active:scale-95 touch-manipulation shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 touch-manipulation"
            title="Share Game Link"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-400 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2.5 sm:px-3.5 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 touch-manipulation ${
              isFavorite 
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' 
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Toggle Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Cinematic Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-cyan-500/30 shadow-2xl">
        
        {/* Banner Cover Backdrop */}
        <div className="relative h-48 sm:h-80 w-full bg-slate-900">
          <img 
            src={game.banner || game.cover} 
            alt={game.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-[#0b0e17]/60 to-transparent" />
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 backdrop-blur-md shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              {game.badge || 'GAME SPEC'}
            </span>
            {game.isMiniGame && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                INSTANT HTML5 DEMO
              </span>
            )}
          </div>
        </div>

        {/* Hero Title & Main Actions Info */}
        <div className="px-5 sm:px-8 -mt-12 sm:-mt-16 relative z-10 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            
            {/* Game Cover Icon */}
            <img 
              src={game.cover} 
              alt={game.title} 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-cyan-500 shadow-2xl shadow-cyan-500/30 shrink-0"
            />

            {/* Title & Metadata */}
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[11px] font-bold text-cyan-400 uppercase tracking-wide">
                  {game.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">By {game.developer}</span>
              </div>
              
              <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
                {game.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {game.rating} ({game.reviewsCount} reviews)
                </span>
                <span className="text-slate-500">•</span>
                <span>{game.downloads} Downloads</span>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-cyan-400">{game.size}</span>
              </div>
            </div>

          </div>

          {/* Action Buttons Row */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row gap-3">
            {game.isMiniGame && (
              <button
                onClick={() => onPlayMiniGame(game)}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-600/30 flex flex-col items-center justify-center hover:brightness-110 active:scale-95 transition-all touch-manipulation"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 fill-white" />
                  <span>PLAY INSTANT DEMO</span>
                </div>
                <span className="text-[10px] text-pink-200 font-normal">0 MB • Runs directly in browser</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex flex-col items-center justify-center shadow-lg transition-all active:scale-95 touch-manipulation ${
                downloadProgress === 100
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-cyan-500/30'
              }`}
            >
              {downloading ? (
                downloadProgress === 100 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> <span>INSTALLED!</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>DOWNLOADING ({downloadProgress}%)</span>
                    </div>
                  </>
                )
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5" /> <span>DOWNLOAD FULL GAME</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-normal">Full Mobile APK / Expo ({game.size})</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Key Specs Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center space-y-1">
          <Star className="w-5 h-5 text-amber-400 mx-auto fill-amber-400/20" />
          <span className="font-display font-extrabold text-lg text-white block">{game.rating} / 5.0</span>
          <span className="text-[11px] text-slate-400 block truncate">{game.reviewsCount} User Reviews</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center space-y-1">
          <Download className="w-5 h-5 text-cyan-400 mx-auto" />
          <span className="font-display font-extrabold text-lg text-white block">{game.downloads}</span>
          <span className="text-[11px] text-slate-400 block truncate">Total Installs</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center space-y-1">
          <HardDrive className="w-5 h-5 text-purple-400 mx-auto" />
          <span className="font-display font-extrabold text-lg text-cyan-400 font-mono block">{game.size}</span>
          <span className="text-[11px] text-slate-400 block truncate">Version {game.version}</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-center space-y-1">
          <Shield className="w-5 h-5 text-emerald-400 mx-auto" />
          <span className="font-display font-extrabold text-lg text-emerald-400 block">VERIFIED</span>
          <span className="text-[11px] text-slate-400 block truncate">React Native Expo</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 px-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Storyline' },
          { id: 'screenshots', label: `Media & Gallery (${game.screenshots?.length || 0})` },
          { id: 'reviews', label: `User Reviews (${reviews.length})` },
          { id: 'specs', label: 'Tech Specifications' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all touch-manipulation ${
              activeTab === tab.id 
                ? 'border-cyan-400 text-cyan-400 font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Body Content */}
      <div className="glass-card rounded-3xl p-5 sm:p-8 border border-slate-800">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 text-sm text-slate-300">
            <div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Game Description</h3>
              <p className="leading-relaxed text-slate-300 text-sm sm:text-base">{game.description}</p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-white mb-3">Key Features & Gameplay Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {game.features?.map((feat, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="font-medium text-xs sm:text-sm text-slate-200">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCREENSHOTS GALLERY */}
        {activeTab === 'screenshots' && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white mb-2">High-Res Media Gallery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {game.screenshots?.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImageLightbox(img)}
                  className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video cursor-pointer"
                >
                  <img 
                    src={img} 
                    alt={`Screenshot ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 text-cyan-400 font-bold text-xs border border-cyan-500/40">
                      Click to Enlarge 🔍
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: USER REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Gamer Community Reviews</h3>
                <p className="text-xs text-slate-400">Share your gameplay experience with fellow mobile gamers.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-sm text-white">{game.rating} out of 5.0</span>
              </div>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Leave your review</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="text-amber-400 p-0.5"
                    >
                      <Star className={`w-4 h-4 ${star <= userRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share details about performance, graphics, controls..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs hover:bg-cyan-400 active:scale-95 touch-manipulation"
                >
                  Post Review
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3 pt-2">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{rev.user}</span>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TECH SPECS */}
        {activeTab === 'specs' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <h3 className="font-display font-bold text-lg text-white mb-2">Technical Specifications & Requirements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-xs block font-mono">Framework & Engine</span>
                <span className="font-bold text-white block text-sm">React Native Expo SDK 51 / Canvas</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-xs block font-mono">Target Performance</span>
                <span className="font-bold text-cyan-400 block text-sm">60 - 120 FPS High Refresh</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-xs block font-mono">Minimum OS</span>
                <span className="font-bold text-white block text-sm">iOS 14.0+ / Android 8.0+ / HTML5 Browser</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-xs block font-mono">Inputs & Hardware</span>
                <span className="font-bold text-white block text-sm">Touch Screen, Gyro, Gamepad Bluetooth</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Recommended / Related Games Section */}
      {relatedGames.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            More Titles You Might Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {relatedGames.map(relGame => (
              <GameCard 
                key={relGame.id}
                game={relGame}
                onSelect={() => onSelectOtherGame(relGame)}
                onPlayMiniGame={onPlayMiniGame}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Screenshot Lightbox Modal */}
      {activeImageLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn" onClick={() => setActiveImageLightbox(null)}>
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-cyan-500/40">
            <img src={activeImageLightbox} alt="Full Screenshot" className="w-full h-full object-contain" />
            <button className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/80 text-white hover:text-cyan-400">
              Close ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
