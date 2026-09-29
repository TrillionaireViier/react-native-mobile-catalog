import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, GAMES_DATA } from './data/games';
import { fetchCatalogGames, submitNewGameToFirestore } from './services/gameService';
import GameCard from './components/GameCard';
import GameDetailPage from './components/GameDetailPage';
import PlayableMiniGame from './components/PlayableMiniGame';
import Navigation from './components/Navigation';
import TrendingView from './components/TrendingView';
import ProfileView from './components/ProfileView';
import SubmitGameModal from './components/SubmitGameModal';
import { Flame, Sparkles, Zap, Trophy, Gamepad2, Search, Smartphone, Heart, Database } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState(GAMES_DATA);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('catalog'); // catalog, trending, minigames, favorites, profile
  const [selectedGameSubpage, setSelectedGameSubpage] = useState(null);
  const [activeMiniGame, setActiveMiniGame] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Load games from Firebase Firestore on mount
  useEffect(() => {
    async function loadGames() {
      const remoteGames = await fetchCatalogGames();
      if (remoteGames && remoteGames.length > 0) {
        setGames(remoteGames);
      }
    }
    loadGames();
  }, []);

  // Handle URL Hash Deep Linking (#game=game-id or #play=game-id or ?game=game-id)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '';
      const search = window.location.search || '';

      let targetGameId = null;
      let isPlayMode = false;

      if (hash.includes('play=')) {
        targetGameId = hash.split('play=')[1]?.split('&')[0];
        isPlayMode = true;
      } else if (hash.includes('game=')) {
        targetGameId = hash.split('game=')[1]?.split('&')[0];
      } else if (search.includes('game=')) {
        targetGameId = new URLSearchParams(search).get('game');
      }

      if (targetGameId) {
        const cleanId = decodeURIComponent(targetGameId).trim();
        const found = games.find(g => g.id === cleanId);
        if (found) {
          if (isPlayMode) {
            setActiveMiniGame(found);
          } else {
            setSelectedGameSubpage(found);
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [games]);

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('gamerhub_favs') || '["cyber-runner-2099", "neon-breakout"]');
  });

  const toggleFavorite = (gameId) => {
    setFavorites(prev => {
      const updated = prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId];
      localStorage.setItem('gamerhub_favs', JSON.stringify(updated));
      return updated;
    });
  };

  const openGameSubpage = (game) => {
    setSelectedGameSubpage(game);
    window.location.hash = `game=${game.id}`;
  };

  const closeGameSubpage = () => {
    setSelectedGameSubpage(null);
    window.location.hash = '';
  };

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
    if (selectedGameSubpage) {
      closeGameSubpage();
    }
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // Tab specific filtering
      if (currentTab === 'minigames' && !game.isMiniGame) return false;
      if (currentTab === 'favorites' && !favorites.includes(game.id)) return false;

      // Category filtering
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'minigame' && !game.isMiniGame) return false;
        else if (selectedCategory !== 'minigame' && game.category !== selectedCategory) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          game.title.toLowerCase().includes(q) ||
          game.developer.toLowerCase().includes(q) ||
          game.category.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [games, selectedCategory, searchQuery, currentTab, favorites]);

  const handleAddCustomGame = async (newGame) => {
    setGames(prev => [newGame, ...prev]);
    await submitNewGameToFirestore(newGame);
  };

  const contentMarkup = (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      
      {/* Top Header & Mobile Nav */}
      <Navigation 
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">

        {/* --- DEDICATED GAME SUBPAGE VIEW --- */}
        {selectedGameSubpage ? (
          <GameDetailPage 
            game={selectedGameSubpage}
            allGames={games}
            onBack={closeGameSubpage}
            onPlayMiniGame={setActiveMiniGame}
            isFavorite={favorites.includes(selectedGameSubpage.id)}
            onToggleFavorite={toggleFavorite}
            onSelectOtherGame={openGameSubpage}
          />
        ) : (
          <>
            {/* --- CATALOG TAB --- */}
            {currentTab === 'catalog' && (
              <div className="space-y-5 sm:space-y-6 pb-28 sm:pb-24">
                
                {/* Featured Hero Banner */}
                <div className="relative rounded-3xl overflow-hidden glass-card border border-cyan-500/20 p-5 sm:p-10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e17] via-[#0b0e17]/85 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80" 
                    alt="Featured Game" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 sm:opacity-60"
                  />
                  
                  <div className="relative z-20 max-w-lg space-y-2.5 sm:space-y-3">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 inline-flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-950" /> FEATURED INSTANT GAME
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Database className="w-3 h-3" /> FIREBASE
                      </span>
                    </div>

                    <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-none">
                      Cyber Runner <span className="text-gradient">2099</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      High-speed synthwave parkour in neon megacities. Test your reflexes in this browser & mobile instant mini-game!
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                      <button
                        onClick={() => setActiveMiniGame(games.find(g => g.id === 'cyber-runner-2099') || games[0])}
                        className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-cyan-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
                      >
                        <Zap className="w-4 h-4 fill-slate-950" /> PLAY INSTANT DEMO
                      </button>
                      <button
                        onClick={() => openGameSubpage(games.find(g => g.id === 'cyber-runner-2099') || games[0])}
                        className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900/90 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors flex items-center justify-center touch-manipulation"
                      >
                        View Game Subpage
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Filter Chips Carousel */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1 -mx-1 px-1 touch-pan-x snap-x">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`snap-start px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border touch-manipulation shrink-0 active:scale-95 ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Games Grid Header */}
                <div className="flex items-center justify-between pt-1">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>{selectedCategory === 'all' ? 'All Mobile Games' : CATEGORIES.find(c => c.id === selectedCategory)?.name}</span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">
                      {filteredGames.length}
                    </span>
                  </h3>
                </div>

                {/* Games Grid */}
                {filteredGames.length === 0 ? (
                  <div className="py-12 sm:py-16 text-center space-y-3 glass-card rounded-3xl border border-slate-800 px-4">
                    <Search className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto" />
                    <h4 className="font-display text-base sm:text-lg font-bold text-white">No games found</h4>
                    <p className="text-xs text-slate-400">Try adjusting your search filter or category selection.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {filteredGames.map(game => (
                      <GameCard 
                        key={game.id}
                        game={game}
                        onSelect={openGameSubpage}
                        onPlayMiniGame={setActiveMiniGame}
                        isFavorite={favorites.includes(game.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* --- INSTANT MINI GAMES TAB --- */}
            {currentTab === 'minigames' && (
              <div className="space-y-5 sm:space-y-6 pb-28 sm:pb-24">
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-500/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display font-extrabold text-xl sm:text-3xl text-white">Instant Mini-Games</h2>
                    <p className="text-xs text-slate-300 mt-1">Play HTML5 playable demos right inside your browser without installing!</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-cyan-500 text-slate-950 shrink-0">NO INSTALL REQUIRED</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {games.filter(g => g.isMiniGame).map(game => (
                    <GameCard 
                      key={game.id}
                      game={game}
                      onSelect={openGameSubpage}
                      onPlayMiniGame={setActiveMiniGame}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* --- TRENDING TAB --- */}
            {currentTab === 'trending' && (
              <TrendingView 
                games={games}
                onSelect={openGameSubpage}
                onPlayMiniGame={setActiveMiniGame}
              />
            )}

            {/* --- FAVORITES TAB --- */}
            {currentTab === 'favorites' && (
              <div className="space-y-5 sm:space-y-6 pb-28 sm:pb-24">
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 fill-rose-500 shrink-0" /> Saved Favorites ({filteredGames.length})
                </h2>

                {filteredGames.length === 0 ? (
                  <div className="py-12 sm:py-16 text-center space-y-3 glass-card rounded-3xl border border-slate-800 px-4">
                    <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto" />
                    <h4 className="font-display text-base sm:text-lg font-bold text-white">No saved games yet</h4>
                    <p className="text-xs text-slate-400">Click the heart icon on any game card to add it to your collection.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {filteredGames.map(game => (
                      <GameCard 
                        key={game.id}
                        game={game}
                        onSelect={openGameSubpage}
                        onPlayMiniGame={setActiveMiniGame}
                        isFavorite={true}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- PROFILE TAB --- */}
            {currentTab === 'profile' && (
              <ProfileView 
                favoriteGames={favorites}
                onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
              />
            )}
          </>
        )}

      </main>

      {/* Playable Mini-Game Modal */}
      {activeMiniGame && (
        <PlayableMiniGame 
          game={activeMiniGame}
          onClose={() => setActiveMiniGame(null)}
        />
      )}

      {/* Developer Submit Game Modal */}
      {isSubmitModalOpen && (
        <SubmitGameModal 
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitGame={handleAddCustomGame}
        />
      )}

    </div>
  );

  // If Mobile Frame mode is enabled (Desktop preview mode only)
  if (isMobileFrame && typeof window !== 'undefined' && window.innerWidth >= 768) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Mobile Frame Container */}
        <div className="relative w-full max-w-[420px] h-[850px] max-h-[90vh] bg-slate-900 border-[8px] border-slate-800 rounded-[50px] shadow-2xl overflow-hidden flex flex-col ring-1 ring-cyan-500/30">
          
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center pointer-events-none">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800" />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pt-2">
            {contentMarkup}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-4">Mobile Device Preview Active • Click "Desktop View" in header to exit</p>
      </div>
    );
  }

  return contentMarkup;
}
