export const CATEGORIES = [
  { id: 'all', name: 'All Games', icon: 'Gamepad2' },
  { id: 'action', name: 'Action & Cyber', icon: 'Zap' },
  { id: 'arcade', name: 'Retro Arcade', icon: 'Flame' },
  { id: 'puzzle', name: 'Puzzle & Brain', icon: 'Brain' },
  { id: 'racing', name: 'Nitro Racing', icon: 'Trophy' },
  { id: 'rpg', name: 'Sci-Fi RPG', icon: 'Shield' },
  { id: 'strategy', name: 'Tactical Strategy', icon: 'Target' },
  { id: 'minigame', name: 'Instant Mini-Games', icon: 'Sparkles' }
];

export const GAMES_DATA = [
  {
    id: 'cyber-runner-2099',
    title: 'Cyber Runner 2099',
    developer: 'Neon Pulse Studios',
    category: 'action',
    isMiniGame: true,
    miniGameType: 'runner',
    rating: 4.9,
    reviewsCount: '12.4K',
    downloads: '1.2M+',
    size: '142 MB',
    version: 'v2.4.1',
    badge: 'EDITOR CHOICE',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    description: 'Race through neon-drenched futuristic megacities in this high-speed parkour cyber runner. Dodge plasma obstacles, collect energy cores, and upgrade your cybernetic implants!',
    features: [
      'High-FPS Synthwave Soundtrack',
      'Dynamic Cybernetic Abilities',
      'Global Leaderboards & Seasons',
      'Full Offline Mode Support'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'neon-breakout',
    title: 'Neon Breakout Ultra',
    developer: 'Viper Byte Games',
    category: 'arcade',
    isMiniGame: true,
    miniGameType: 'breakout',
    rating: 4.8,
    reviewsCount: '8.9K',
    downloads: '850K+',
    size: '88 MB',
    version: 'v1.8.0',
    badge: 'PLAY INSTANTLY',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'The ultimate laser brick breaker experience! Harness multi-ball powerups, explosive plasma lasers, and battle boss bricks across 100+ neon levels.',
    features: [
      '100+ Custom Arcade Stages',
      '15+ Haptic Power-Ups',
      'Boss Battle Encounters',
      'Retro Synthesizer FX'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'space-invaders-zero',
    title: 'Galactic Horizon: Zero',
    developer: 'Astro Interactive',
    category: 'arcade',
    isMiniGame: true,
    miniGameType: 'space',
    rating: 4.7,
    reviewsCount: '15.1K',
    downloads: '2.5M+',
    size: '210 MB',
    version: 'v3.1.2',
    badge: 'TOP TRENDING',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    description: 'Pilot elite starfighters against alien mothership armadas. Upgrade photon blasters, deploy shields, and dominate deep space dogfights.',
    features: [
      'Intense Bullet-Hell Wave Gameplay',
      'Customizable Starfighter Fleets',
      'Epic Boss Encounters',
      '60 FPS Smooth Touch Controls'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'valkyrie-odyssey-mobile',
    title: 'Valkyrie Odyssey: Rebirth',
    developer: 'NEXUS RPG Network',
    category: 'rpg',
    isMiniGame: true,
    miniGameType: 'rpg',
    rating: 4.9,
    reviewsCount: '45.2K',
    downloads: '5.0M+',
    size: '2.4 GB',
    version: 'v4.0.5',
    badge: 'AAA MOBILE',
    cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'An open-world unreal-engine fantasy action RPG built specifically for high-end mobile devices. Explore mythical realms, conquer dungeon raids with friends, and forge legendary gear.',
    features: [
      'Console-Quality Graphics with Ray Tracing',
      'Real-Time Multiplayer Guild Raids',
      'Deep Skill Tree & Artifact Customization',
      'Cross-Platform Save Progress'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'drift-overdrive-nitro',
    title: 'Drift Overdrive: Nitro X',
    developer: 'Apex Speedworks',
    category: 'racing',
    isMiniGame: true,
    miniGameType: 'racing',
    rating: 4.8,
    reviewsCount: '28.9K',
    downloads: '3.1M+',
    size: '890 MB',
    version: 'v2.1.0',
    badge: 'MUST PLAY',
    cover: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    description: 'Burn rubber through mountain passes and coastal highways. Tune supercar engines, customize vinyl wraps, and challenge live players in global PvP drift battles.',
    features: [
      '50+ Real Licensed Supercars',
      'Realistic Vehicle Physics & Smoke FX',
      'Live Asynchronous & Ranked Multiplayer',
      'Gyroscope & Touch Steering Controls'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'mind-maze-chronicles',
    title: 'Mind Maze 3D: Quantum',
    developer: 'Paradox Logic Lab',
    category: 'puzzle',
    isMiniGame: true,
    miniGameType: 'puzzle',
    rating: 4.6,
    reviewsCount: '6.7K',
    downloads: '600K+',
    size: '120 MB',
    version: 'v1.5.2',
    badge: 'INDIE GEM',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    description: 'Solve mind-bending spatial geometry puzzles in a zero-gravity environment. Rotate gravity planes and manipulate light lasers to unlock mysterious ancient monoliths.',
    features: [
      '80+ Handcrafted Spatial Puzzles',
      'Atmospheric Ambient Soundscapes',
      'No Timers or Microtransactions',
      'Haptic Touch Feedback'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'cyber-snake-2099',
    title: 'Cyber Snake 2099',
    developer: 'Grid Master Studios',
    category: 'arcade',
    isMiniGame: true,
    miniGameType: 'snake',
    rating: 4.6,
    reviewsCount: '6.4K',
    downloads: '420K+',
    size: '45 MB',
    version: 'v1.2.0',
    badge: 'NEW MINI GAME',
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    description: 'Guide your cybernetic light snake through an encrypted matrix grid. Consume data nodes, expand your photon tail, and avoid laser barriers!',
    features: [
      'Neon Light Trail Effects',
      'Smooth Touch & Swipe Controls',
      'Multi-Speed Cyber Grid',
      'Instant Web & Mobile Play'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'memory-matrix-hack',
    title: 'Memory Matrix: Cyber Hack',
    developer: 'Neural Logic Lab',
    category: 'puzzle',
    isMiniGame: true,
    miniGameType: 'memory',
    rating: 4.8,
    reviewsCount: '9.3K',
    downloads: '680K+',
    size: '55 MB',
    version: 'v1.4.0',
    badge: 'BRAIN CHALLENGE',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    description: 'Test your photographic memory and hacking speed! Match encrypted security nodes before time expires to breach mega-corp firewalls.',
    features: [
      'Dynamic Hacker Cyber Deck UI',
      'Progressive Speed Difficulty',
      'Memory Pattern Combos',
      'Haptic Feedback Sound Effects'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'shadow-realm-ninja',
    title: 'Shadow Realm: Ninja Protocol',
    developer: 'Kurogane Interactive',
    category: 'action',
    isMiniGame: true,
    miniGameType: 'ninja',
    rating: 4.9,
    reviewsCount: '34.8K',
    downloads: '4.2M+',
    size: '1.6 GB',
    version: 'v3.0.1',
    badge: 'HARDCORE ACTION',
    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    description: 'Unleash cybernetic katana combat in a dark futuristic Neo-Tokyo. Execute lightning-fast parries, wall-run across skyscrapers, and vanquish rogue AI bosses.',
    features: [
      'Precision Parry & Slash Combat Mechanics',
      'Cyberware Augment Upgrades',
      'Boss Rush Arena Mode',
      'DualShock & Xbox Controller Support'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'iron-defense-command',
    title: 'Iron Defense: Siege Command',
    developer: 'Titan Warfare Games',
    category: 'strategy',
    isMiniGame: true,
    miniGameType: 'turret',
    rating: 4.7,
    reviewsCount: '19.5K',
    downloads: '1.8M+',
    size: '640 MB',
    version: 'v2.2.4',
    badge: 'TACTICAL TOP',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    description: 'Construct impenetrable defense turrets, deploy orbital strike cannons, and command armored mech divisions against alien horde sieges.',
    features: [
      '40+ Campaign Mission Maps',
      'Real-Time Tactical Unit Micro',
      'Co-op Base Defense Mode',
      'Extensive Tech Tree Upgrades'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'hyper-horizon-velocity',
    title: 'Hyper Horizon: Turbo Velocity',
    developer: 'Volt Racers Inc.',
    category: 'racing',
    isMiniGame: true,
    miniGameType: 'racing',
    rating: 4.8,
    reviewsCount: '21.3K',
    downloads: '2.1M+',
    size: '720 MB',
    version: 'v1.9.5',
    badge: 'SPEED DEMON',
    cover: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    description: 'Anti-gravity magnetic hovercraft racing at Mach-3 speeds! Fly through futuristic tube tracks, trigger warp boosts, and blast rival craft with EMP missiles.',
    features: [
      'Anti-Gravity 360-Degree Tracks',
      'EMP & Plasma Weaponry pickups',
      'Smooth 120 FPS High Refresh Support',
      'Online Ranked Tournaments'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80'
    ]
  }
];
