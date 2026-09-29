import React, { useState } from 'react';
import { X, Send, PlusCircle, CheckCircle2, Gamepad2, AlertCircle } from 'lucide-react';

export default function SubmitGameModal({ onClose, onSubmitGame }) {
  const [formData, setFormData] = useState({
    title: '',
    developer: '',
    category: 'action',
    size: '150 MB',
    description: '',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    badge: 'NEW RELEASE'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.developer) return;

    const newGame = {
      id: `custom-${Date.now()}`,
      title: formData.title,
      developer: formData.developer,
      category: formData.category,
      isMiniGame: false,
      rating: 5.0,
      reviewsCount: '1',
      downloads: '100+',
      size: formData.size,
      version: 'v1.0.0',
      badge: formData.badge,
      cover: formData.cover,
      banner: formData.cover,
      description: formData.description || 'Newly published mobile title on GamerHub catalog!',
      features: ['React Native Expo Tested', '60 FPS Mobile Performance'],
      screenshots: [formData.cover]
    };

    onSubmitGame(newGame);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111625] border-t sm:border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 my-0 sm:my-auto max-h-[92vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-base sm:text-lg text-white">Submit Mobile Game</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-display text-lg sm:text-xl font-bold text-white">Game Published Successfully!</h4>
            <p className="text-xs text-slate-400">Your title is now live in the mobile catalog!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Game Title *</label>
              <input 
                type="text"
                required
                placeholder="e.g., Cyber Strike 2"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Studio / Developer *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Pixel Wave Studios"
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                >
                  <option value="action">Action</option>
                  <option value="arcade">Arcade</option>
                  <option value="rpg">RPG</option>
                  <option value="racing">Racing</option>
                  <option value="puzzle">Puzzle</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Short Description</label>
              <textarea
                rows={3}
                placeholder="Describe your game's mechanics, storyline, and graphics..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-cyan-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 touch-manipulation pb-safe"
            >
              <Send className="w-4 h-4" /> PUBLISH TO CATALOG
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

