import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, X, ArrowLeft, ArrowRight, Shield, Zap, Target } from 'lucide-react';

export default function PlayableMiniGame({ game, onClose }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem(`hs_${game.id}`) || '0', 10);
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Ref to trigger actions directly from mobile touch buttons
  const triggerActionRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let localScore = 0;
    let isGameOver = false;

    // --- MINI-GAME 1: CYBER RUNNER 2099 (runner) ---
    if (game.miniGameType === 'runner') {
      let player = { x: 50, y: 180, width: 30, height: 40, vy: 0, grounded: true };
      let obstacles = [];
      let cores = [];
      let frame = 0;
      let gameSpeed = 5;

      const jump = () => {
        if (player.grounded) {
          player.vy = -12;
          player.grounded = false;
        }
      };

      triggerActionRef.current = {
        action1: () => jump(),
        action2: () => {},
        label1: 'JUMP 🚀',
        label2: null
      };

      const handleKeyDown = (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          if (gameState === 'PLAYING') jump();
        }
      };
      const handleCanvasTouch = (e) => {
        if (e && e.preventDefault && e.cancelable) e.preventDefault();
        if (gameState === 'PLAYING') jump();
      };

      window.addEventListener('keydown', handleKeyDown);
      canvas.addEventListener('touchstart', handleCanvasTouch, { passive: false });
      canvas.addEventListener('click', handleCanvasTouch);

      const loop = () => {
        if (gameState !== 'PLAYING') return;

        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Cyber Grid Background
        ctx.fillStyle = '#0b0e17';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        // Ground line
        const groundY = 220;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(canvas.width, groundY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Player physics
        player.y += player.vy;
        player.vy += 0.65; // Gravity
        if (player.y >= groundY - player.height) {
          player.y = groundY - player.height;
          player.vy = 0;
          player.grounded = true;
        }

        // Draw Player (Cyber Robot/Runner)
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        // Cyber visor
        ctx.fillStyle = '#ff007f';
        ctx.fillRect(player.x + 15, player.y + 8, 12, 6);
        ctx.shadowBlur = 0;

        // Spawn Obstacles
        if (frame % 70 === 0) {
          obstacles.push({ x: canvas.width, y: groundY - 30, width: 20, height: 30 });
        }
        // Spawn Energy Cores
        if (frame % 110 === 0) {
          cores.push({ x: canvas.width, y: groundY - 70, radius: 10 });
        }

        // Update & Draw Obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
          let obs = obstacles[i];
          obs.x -= gameSpeed;

          ctx.fillStyle = '#ff007f';
          ctx.shadowColor = '#ff007f';
          ctx.shadowBlur = 10;
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.shadowBlur = 0;

          // Collision Check
          if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
          ) {
            isGameOver = true;
          }

          if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            localScore += 10;
            setScore(localScore);
          }
        }

        // Update & Draw Energy Cores
        for (let i = cores.length - 1; i >= 0; i--) {
          let c = cores[i];
          c.x -= gameSpeed;

          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();

          // Collect Core
          let dist = Math.hypot(player.x + player.width/2 - c.x, player.y + player.height/2 - c.y);
          if (dist < c.radius + 15) {
            cores.splice(i, 1);
            localScore += 50;
            setScore(localScore);
          } else if (c.x < -10) {
            cores.splice(i, 1);
          }
        }

        // Speed ramp up
        gameSpeed += 0.001;

        if (isGameOver) {
          setGameState('GAMEOVER');
          if (localScore > highScore) {
            setHighScore(localScore);
            localStorage.setItem(`hs_${game.id}`, localScore.toString());
          }
        } else {
          animationFrameId = requestAnimationFrame(loop);
        }
      };

      if (gameState === 'PLAYING') loop();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('keydown', handleKeyDown);
        canvas.removeEventListener('touchstart', handleCanvasTouch);
        canvas.removeEventListener('click', handleCanvasTouch);
      };
    }

    // --- MINI-GAME 2: NEON BREAKOUT ULTRA (breakout) ---
    else if (game.miniGameType === 'breakout') {
      let paddle = { x: canvas.width / 2 - 40, width: 80, height: 12 };
      let ball = { x: canvas.width / 2, y: 180, dx: 3.5, dy: -3.5, radius: 6 };
      let rows = 4, cols = 8;
      let brickWidth = 42, brickHeight = 16, brickPadding = 6, offsetTop = 30, offsetLeft = 20;

      let bricks = [];
      for (let c = 0; c < cols; c++) {
        bricks[c] = [];
        for (let r = 0; r < rows; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }

      triggerActionRef.current = {
        action1: () => { paddle.x = Math.max(0, paddle.x - 25); },
        action2: () => { paddle.x = Math.min(canvas.width - paddle.width, paddle.x + 25); },
        label1: '◀ LEFT',
        label2: 'RIGHT ▶'
      };

      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        let relativeX = e.clientX - rect.left;
        if (relativeX > 0 && relativeX < rect.width) {
          paddle.x = (relativeX / rect.width) * canvas.width - paddle.width / 2;
        }
      };
      const handleTouchMove = (e) => {
        if (e.cancelable) e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        let touch = e.touches[0];
        let relativeX = touch.clientX - rect.left;
        if (relativeX > 0 && relativeX < rect.width) {
          paddle.x = (relativeX / rect.width) * canvas.width - paddle.width / 2;
        }
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchstart', handleTouchMove, { passive: false });

      const loop = () => {
        if (gameState !== 'PLAYING') return;

        ctx.fillStyle = '#0b0e17';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Bricks
        let remainingBricks = 0;
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            if (bricks[c][r].status === 1) {
              remainingBricks++;
              let brickX = c * (brickWidth + brickPadding) + offsetLeft;
              let brickY = r * (brickHeight + brickPadding) + offsetTop;
              bricks[c][r].x = brickX;
              bricks[c][r].y = brickY;

              ctx.fillStyle = r % 2 === 0 ? '#00f0ff' : '#7000ff';
              ctx.shadowColor = ctx.fillStyle;
              ctx.shadowBlur = 6;
              ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
              ctx.shadowBlur = 0;

              // Ball collision
              if (
                ball.x > brickX &&
                ball.x < brickX + brickWidth &&
                ball.y > brickY &&
                ball.y < brickY + brickHeight
              ) {
                ball.dy = -ball.dy;
                bricks[c][r].status = 0;
                localScore += 20;
                setScore(localScore);
              }
            }
          }
        }

        // Draw Paddle
        ctx.fillStyle = '#ff007f';
        ctx.shadowColor = '#ff007f';
        ctx.shadowBlur = 10;
        ctx.fillRect(paddle.x, canvas.height - 20, paddle.width, paddle.height);
        ctx.shadowBlur = 0;

        // Draw Ball
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ball & Wall collision
        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
          ball.dx = -ball.dx;
        }
        if (ball.y + ball.dy < ball.radius) {
          ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - 20 - ball.radius) {
          if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
          } else if (ball.y + ball.dy > canvas.height) {
            isGameOver = true;
          }
        }

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (remainingBricks === 0 || isGameOver) {
          setGameState('GAMEOVER');
          if (localScore > highScore) {
            setHighScore(localScore);
            localStorage.setItem(`hs_${game.id}`, localScore.toString());
          }
        } else {
          animationFrameId = requestAnimationFrame(loop);
        }
      };

      if (gameState === 'PLAYING') loop();

      return () => {
        cancelAnimationFrame(animationFrameId);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchstart', handleTouchMove);
      };
    }

    // --- MINI-GAME 3: GALACTIC HORIZON ZERO (space shooter) ---
    else if (game.miniGameType === 'space') {
      let ship = { x: canvas.width / 2 - 15, y: canvas.height - 40, width: 30, height: 30 };
      let lasers = [];
      let enemies = [];
      let frame = 0;

      const fireLaser = () => {
        lasers.push({ x: ship.x + ship.width / 2 - 2, y: ship.y, width: 4, height: 10 });
      };

      triggerActionRef.current = {
        action1: () => { ship.x = Math.max(10, ship.x - 20); },
        action2: () => { ship.x = Math.min(canvas.width - 40, ship.x + 20); },
        actionFire: () => fireLaser(),
        label1: '◀ LEFT',
        label2: 'RIGHT ▶',
        labelFire: '🔥 FIRE'
      };

      const handleTouchMove = (e) => {
        if (e.cancelable) e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        let touch = e.touches[0];
        let relativeX = touch.clientX - rect.left;
        if (relativeX > 0 && relativeX < rect.width) {
          ship.x = (relativeX / rect.width) * canvas.width - ship.width / 2;
        }
      };

      const handleCanvasClick = () => {
        if (gameState === 'PLAYING') fireLaser();
      };

      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('click', handleCanvasClick);

      const loop = () => {
        if (gameState !== 'PLAYING') return;
        frame++;

        ctx.fillStyle = '#07090e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Starfield Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 20; i++) {
          let sy = (frame * 2 + i * 15) % canvas.height;
          let sx = (i * 37) % canvas.width;
          ctx.fillRect(sx, sy, 2, 2);
        }

        // Auto Fire every 15 frames
        if (frame % 15 === 0) {
          fireLaser();
        }

        // Spawn Enemies / Asteroids
        if (frame % 45 === 0) {
          enemies.push({ 
            x: Math.random() * (canvas.width - 30), 
            y: -20, 
            width: 25, 
            height: 25, 
            speed: 2 + Math.random() * 2 
          });
        }

        // Draw Starship
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(ship.x + ship.width / 2, ship.y);
        ctx.lineTo(ship.x, ship.y + ship.height);
        ctx.lineTo(ship.x + ship.width, ship.y + ship.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Lasers Physics & Drawing
        for (let i = lasers.length - 1; i >= 0; i--) {
          let l = lasers[i];
          l.y -= 7;
          ctx.fillStyle = '#ff007f';
          ctx.shadowColor = '#ff007f';
          ctx.shadowBlur = 8;
          ctx.fillRect(l.x, l.y, l.width, l.height);
          ctx.shadowBlur = 0;

          if (l.y < -10) lasers.splice(i, 1);
        }

        // Enemies Physics, Collision & Drawing
        for (let i = enemies.length - 1; i >= 0; i--) {
          let en = enemies[i];
          en.y += en.speed;

          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(en.x, en.y, en.width, en.height);

          // Ship Collision
          if (
            ship.x < en.x + en.width &&
            ship.x + ship.width > en.x &&
            ship.y < en.y + en.height &&
            ship.y + ship.height > en.y
          ) {
            isGameOver = true;
          }

          // Laser Hits Enemy
          for (let j = lasers.length - 1; j >= 0; j--) {
            let l = lasers[j];
            if (
              l.x < en.x + en.width &&
              l.x + l.width > en.x &&
              l.y < en.y + en.height &&
              l.y + l.height > en.y
            ) {
              enemies.splice(i, 1);
              lasers.splice(j, 1);
              localScore += 30;
              setScore(localScore);
              break;
            }
          }

          if (en && en.y > canvas.height + 20) {
            enemies.splice(i, 1);
          }
        }

        if (isGameOver) {
          setGameState('GAMEOVER');
          if (localScore > highScore) {
            setHighScore(localScore);
            localStorage.setItem(`hs_${game.id}`, localScore.toString());
          }
        } else {
          animationFrameId = requestAnimationFrame(loop);
        }
      };

      if (gameState === 'PLAYING') loop();

      return () => {
        cancelAnimationFrame(animationFrameId);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('click', handleCanvasClick);
      };
    }

    // --- MINI-GAME 4: CYBER SNAKE 2099 (snake) ---
    else if (game.miniGameType === 'snake') {
      let grid = 15;
      let snake = [{ x: 150, y: 150 }, { x: 135, y: 150 }, { x: 120, y: 150 }];
      let dx = grid, dy = 0;
      let food = { x: 225, y: 150 };
      let frame = 0;

      const changeDir = (newDx, newDy) => {
        if (newDx !== -dx && newDy !== -dy) {
          dx = newDx;
          dy = newDy;
        }
      };

      triggerActionRef.current = {
        action1: () => changeDir(0, -grid), // UP
        action2: () => changeDir(0, grid),  // DOWN
        actionLeft: () => changeDir(-grid, 0),
        actionRight: () => changeDir(grid, 0),
        label1: '▲ UP',
        label2: '▼ DOWN',
        labelLeft: '◀ LEFT',
        labelRight: 'RIGHT ▶'
      };

      const loop = () => {
        if (gameState !== 'PLAYING') return;
        frame++;

        // Render every 6 frames for arcade speed
        if (frame % 6 === 0) {
          ctx.fillStyle = '#0b0e17';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Grid lines
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
          for (let x = 0; x < canvas.width; x += grid) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }

          // Move Snake Head
          let head = { x: snake[0].x + dx, y: snake[0].y + dy };

          // Wall Collision check
          if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            isGameOver = true;
          }

          // Self Collision
          for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
              isGameOver = true;
            }
          }

          if (!isGameOver) {
            snake.unshift(head);

            // Food collision
            if (head.x === food.x && head.y === food.y) {
              localScore += 50;
              setScore(localScore);
              food = {
                x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
                y: Math.floor(Math.random() * (canvas.height / grid)) * grid
              };
            } else {
              snake.pop();
            }

            // Draw Food
            ctx.fillStyle = '#ff007f';
            ctx.shadowColor = '#ff007f';
            ctx.shadowBlur = 10;
            ctx.fillRect(food.x, food.y, grid - 1, grid - 1);
            ctx.shadowBlur = 0;

            // Draw Snake
            snake.forEach((segment, idx) => {
              ctx.fillStyle = idx === 0 ? '#00f0ff' : '#7000ff';
              ctx.shadowColor = ctx.fillStyle;
              ctx.shadowBlur = 6;
              ctx.fillRect(segment.x, segment.y, grid - 1, grid - 1);
              ctx.shadowBlur = 0;
            });
          }
        }

        if (isGameOver) {
          setGameState('GAMEOVER');
          if (localScore > highScore) {
            setHighScore(localScore);
            localStorage.setItem(`hs_${game.id}`, localScore.toString());
          }
        } else {
          animationFrameId = requestAnimationFrame(loop);
        }
      };

      if (gameState === 'PLAYING') loop();

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }

    // --- MINI-GAME 5: MEMORY MATRIX HACK (memory) ---
    else if (game.miniGameType === 'memory') {
      let cards = [
        { id: 1, val: '⚡', flipped: false, matched: false },
        { id: 2, val: '⚡', flipped: false, matched: false },
        { id: 3, val: '🔑', flipped: false, matched: false },
        { id: 4, val: '🔑', flipped: false, matched: false },
        { id: 5, val: '💻', flipped: false, matched: false },
        { id: 6, val: '💻', flipped: false, matched: false },
        { id: 7, val: '🛡️', flipped: false, matched: false },
        { id: 8, val: '🛡️', flipped: false, matched: false },
      ].sort(() => Math.random() - 0.5);

      let firstSelected = null;
      let lockBoard = false;

      triggerActionRef.current = {
        action1: null,
        action2: null
      };

      const handleCanvasClick = (e) => {
        if (lockBoard) return;
        const rect = canvas.getBoundingClientRect();
        let clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
        let clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

        // Check card clicks (4 cols x 2 rows)
        cards.forEach((c, idx) => {
          let col = idx % 4;
          let row = Math.floor(idx / 4);
          let cx = 30 + col * 85;
          let cy = 50 + row * 110;

          if (clickX >= cx && clickX <= cx + 70 && clickY >= cy && clickY <= cy + 90) {
            if (c.flipped || c.matched) return;

            c.flipped = true;
            drawBoard();

            if (!firstSelected) {
              firstSelected = c;
            } else {
              if (firstSelected.val === c.val) {
                firstSelected.matched = true;
                c.matched = true;
                firstSelected = null;
                localScore += 100;
                setScore(localScore);

                if (cards.every(cd => cd.matched)) {
                  setTimeout(() => {
                    setGameState('GAMEOVER');
                    if (localScore > highScore) {
                      setHighScore(localScore);
                      localStorage.setItem(`hs_${game.id}`, localScore.toString());
                    }
                  }, 600);
                }
              } else {
                lockBoard = true;
                setTimeout(() => {
                  firstSelected.flipped = false;
                  c.flipped = false;
                  firstSelected = null;
                  lockBoard = false;
                  drawBoard();
                }, 800);
              }
            }
          }
        });
      };

      const drawBoard = () => {
        ctx.fillStyle = '#0b0e17';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('BREACH FIREWALL MATRIX - MATCH SYMBOLS', 40, 30);

        cards.forEach((c, idx) => {
          let col = idx % 4;
          let row = Math.floor(idx / 4);
          let cx = 30 + col * 85;
          let cy = 50 + row * 110;

          if (c.flipped || c.matched) {
            ctx.fillStyle = c.matched ? '#10b981' : '#1e293b';
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.fillRect(cx, cy, 70, 90);
            ctx.strokeRect(cx, cy, 70, 90);

            ctx.font = '32px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(c.val, cx + 35, cy + 55);
            ctx.textAlign = 'left';
          } else {
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#7000ff';
            ctx.lineWidth = 2;
            ctx.fillRect(cx, cy, 70, 90);
            ctx.strokeRect(cx, cy, 70, 90);

            ctx.fillStyle = '#7000ff';
            ctx.font = 'bold 20px monospace';
            ctx.fillText('?', cx + 28, cy + 53);
          }
        });
      };

      if (gameState === 'PLAYING') {
        drawBoard();
        canvas.addEventListener('click', handleCanvasClick);
      }

      return () => {
        canvas.removeEventListener('click', handleCanvasClick);
      };
    }

    // Default Fallback
    else {
      ctx.fillStyle = '#0b0e17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [gameState, game.id, game.miniGameType]);

  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111625] border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-100 flex flex-col items-center max-h-[96vh] my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between w-full pb-2.5 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white leading-tight">{game.title}</h3>
              <p className="text-[10px] sm:text-xs text-cyan-400 font-mono">INSTANT HTML5 DEMO</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Controls Bar */}
        <div className="flex items-center justify-between w-full mb-3 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-slate-400">Score: <strong className="text-cyan-400 font-mono text-sm sm:text-base">{score}</strong></span>
            <span className="text-slate-400">High: <strong className="text-amber-400 font-mono text-sm sm:text-base">{highScore}</strong></span>
          </div>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white touch-manipulation"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
        </div>

        {/* Canvas Screen */}
        <div className="relative w-full aspect-[4/3] bg-[#0b0e17] rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center select-none">
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={300}
            className="w-full h-full object-contain cursor-pointer touch-none"
          />

          {/* Start Screen Overlay */}
          {gameState === 'START' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Play className="w-7 h-7 text-white fill-white ml-0.5" />
              </div>
              <h4 className="font-display text-lg sm:text-xl font-bold text-white mb-1">Ready to Play?</h4>
              <p className="text-xs text-slate-400 mb-5 max-w-xs">
                {game.miniGameType === 'runner' ? 'Tap screen or press Spacebar to Jump & dodge obstacles!' :
                 game.miniGameType === 'breakout' ? 'Drag on canvas or use touch buttons below to control laser paddle!' :
                 game.miniGameType === 'space' ? 'Pilot your starfighter and blast incoming asteroid drones!' :
                 game.miniGameType === 'snake' ? 'Control your light trail snake and collect energy data nodes!' :
                 'Match hacking security cards before matrix lockdown!'}
              </p>
              <button
                onClick={startGame}
                className="px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-cyan-500/30 transition-all active:scale-95 touch-manipulation"
              >
                START GAME
              </button>
            </div>
          )}

          {/* Game Over Screen Overlay */}
          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fadeIn">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mb-2 animate-bounce" />
              <h4 className="font-display text-xl sm:text-2xl font-black text-rose-400 mb-1">GAME OVER</h4>
              <p className="text-xs sm:text-sm text-slate-300 mb-4">
                Final Score: <span className="font-mono text-cyan-400 font-bold text-base sm:text-lg">{score}</span>
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={startGame}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-md flex items-center gap-1.5 touch-manipulation active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" /> PLAY AGAIN
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 sm:py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium text-xs sm:text-sm touch-manipulation"
                >
                  EXIT
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Touch Controls Area */}
        {gameState === 'PLAYING' && triggerActionRef.current && (
          <div className="w-full mt-3">
            {triggerActionRef.current.labelLeft ? (
              <div className="grid grid-cols-4 gap-1.5 w-full">
                <button
                  onClick={() => triggerActionRef.current.actionLeft()}
                  className="py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs active:bg-cyan-600 flex items-center justify-center touch-manipulation"
                >
                  {triggerActionRef.current.labelLeft}
                </button>
                <button
                  onClick={() => triggerActionRef.current.action1()}
                  className="py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs active:bg-cyan-600 flex items-center justify-center touch-manipulation"
                >
                  {triggerActionRef.current.label1}
                </button>
                <button
                  onClick={() => triggerActionRef.current.action2()}
                  className="py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs active:bg-cyan-600 flex items-center justify-center touch-manipulation"
                >
                  {triggerActionRef.current.label2}
                </button>
                <button
                  onClick={() => triggerActionRef.current.actionRight()}
                  className="py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs active:bg-cyan-600 flex items-center justify-center touch-manipulation"
                >
                  {triggerActionRef.current.labelRight}
                </button>
              </div>
            ) : triggerActionRef.current.labelFire ? (
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => triggerActionRef.current.action1()}
                  className="flex-1 py-3 rounded-xl bg-slate-800 active:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1 touch-manipulation"
                >
                  {triggerActionRef.current.label1}
                </button>
                <button
                  onClick={() => triggerActionRef.current.actionFire()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-xs flex items-center justify-center gap-1 touch-manipulation shadow-md"
                >
                  {triggerActionRef.current.labelFire}
                </button>
                <button
                  onClick={() => triggerActionRef.current.action2()}
                  className="flex-1 py-3 rounded-xl bg-slate-800 active:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1 touch-manipulation"
                >
                  {triggerActionRef.current.label2}
                </button>
              </div>
            ) : triggerActionRef.current.label2 ? (
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => triggerActionRef.current.action1()}
                  className="flex-1 py-3 rounded-xl bg-slate-800 active:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 touch-manipulation active:scale-95 select-none"
                >
                  {triggerActionRef.current.label1}
                </button>
                <button
                  onClick={() => triggerActionRef.current.action2()}
                  className="flex-1 py-3 rounded-xl bg-slate-800 active:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 touch-manipulation active:scale-95 select-none"
                >
                  {triggerActionRef.current.label2}
                </button>
              </div>
            ) : triggerActionRef.current.label1 ? (
              <button
                onClick={() => triggerActionRef.current.action1()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 active:scale-98 transition-all touch-manipulation flex items-center justify-center gap-2 select-none"
              >
                <Zap className="w-4 h-4 fill-slate-950" /> {triggerActionRef.current.label1}
              </button>
            ) : null}
          </div>
        )}

        {/* Footer info */}
        <p className="text-[10px] sm:text-[11px] text-slate-500 mt-2.5 text-center">
          Touch or Keyboard inputs active. High score automatically saved locally.
        </p>

      </div>
    </div>
  );
}
