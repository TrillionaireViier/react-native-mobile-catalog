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

    // --- MINI-GAME 4: NITRO HIGHWAY RACER (racing) ---
    else if (game.miniGameType === 'racing') {
      let car = { x: canvas.width / 2 - 15, y: canvas.height - 50, width: 30, height: 45 };
      let traffic = [];
      let nitroCores = [];
      let frame = 0;
      let roadSpeed = 4;

      triggerActionRef.current = {
        action1: () => { car.x = Math.max(60, car.x - 30); },
        action2: () => { car.x = Math.min(canvas.width - 90, car.x + 30); },
        actionFire: () => { roadSpeed += 2; setTimeout(() => roadSpeed = Math.max(4, roadSpeed - 2), 1500); },
        label1: '◀ STEER LEFT',
        label2: 'STEER RIGHT ▶',
        labelFire: '⚡ NITRO BOOST'
      };

      const handleKeyDown = (e) => {
        if (e.code === 'ArrowLeft') car.x = Math.max(60, car.x - 30);
        if (e.code === 'ArrowRight') car.x = Math.min(canvas.width - 90, car.x + 30);
      };

      window.addEventListener('keydown', handleKeyDown);

      const loop = () => {
        if (gameState !== 'PLAYING') return;
        frame++;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Highway Asphalt
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(50, 0, canvas.width - 100, canvas.height);

        // Road Lines
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
        ctx.setLineDash([20, 15]);
        ctx.lineDashOffset = -frame * roadSpeed;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Spawn Traffic & Nitro Cores
        if (frame % 55 === 0) {
          let laneX = 70 + Math.floor(Math.random() * 3) * 80;
          traffic.push({ x: laneX, y: -50, width: 28, height: 45, color: '#ef4444' });
        }
        if (frame % 90 === 0) {
          let laneX = 70 + Math.floor(Math.random() * 3) * 80;
          nitroCores.push({ x: laneX + 5, y: -20, radius: 10 });
        }

        // Draw Player Car (Supercar)
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fillRect(car.x, car.y, car.width, car.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(car.x + 5, car.y + 10, car.width - 10, 10);
        ctx.shadowBlur = 0;

        // Traffic Physics & Drawing
        for (let i = traffic.length - 1; i >= 0; i--) {
          let tr = traffic[i];
          tr.y += roadSpeed;

          ctx.fillStyle = tr.color;
          ctx.fillRect(tr.x, tr.y, tr.width, tr.height);

          // Collision Check
          if (
            car.x < tr.x + tr.width &&
            car.x + car.width > tr.x &&
            car.y < tr.y + tr.height &&
            car.y + car.height > tr.y
          ) {
            isGameOver = true;
          }

          if (tr.y > canvas.height + 50) {
            traffic.splice(i, 1);
            localScore += 15;
            setScore(localScore);
          }
        }

        // Nitro Physics
        for (let i = nitroCores.length - 1; i >= 0; i--) {
          let nc = nitroCores[i];
          nc.y += roadSpeed;

          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(nc.x, nc.y, nc.radius, 0, Math.PI * 2);
          ctx.fill();

          let dist = Math.hypot(car.x + car.width/2 - nc.x, car.y + car.height/2 - nc.y);
          if (dist < nc.radius + 20) {
            nitroCores.splice(i, 1);
            localScore += 60;
            setScore(localScore);
          } else if (nc.y > canvas.height + 20) {
            nitroCores.splice(i, 1);
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
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

    // --- MINI-GAME 5: VALKYRIE RPG SLASH (rpg) ---
    else if (game.miniGameType === 'rpg') {
      let player = { x: 50, y: 140, hp: 100 };
      let monsters = [];
      let frame = 0;

      const slashAction = () => {
        for (let i = monsters.length - 1; i >= 0; i--) {
          if (monsters[i].x < 220) {
            monsters.splice(i, 1);
            localScore += 40;
            setScore(localScore);
          }
        }
      };

      const magicAction = () => {
        monsters = [];
        localScore += 100;
        setScore(localScore);
      };

      triggerActionRef.current = {
        action1: () => slashAction(),
        action2: () => magicAction(),
        label1: '⚔️ KATANA SLASH',
        label2: '⚡ SPELL BLAST'
      };

      const handleCanvasClick = () => {
        if (gameState === 'PLAYING') slashAction();
      };

      canvas.addEventListener('click', handleCanvasClick);

      const loop = () => {
        if (gameState !== 'PLAYING') return;
        frame++;

        ctx.fillStyle = '#0b0e17';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Hero Valkyrie Avatar
        ctx.fillStyle = '#7000ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(player.x, player.y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('HERO VALKYRIE', 10, player.y + 45);

        // Spawn Monster Wave
        if (frame % 45 === 0) {
          monsters.push({ x: canvas.width + 20, y: 140, speed: 2.5 + Math.random() * 2 });
        }

        // Monsters Physics & Drawing
        for (let i = monsters.length - 1; i >= 0; i--) {
          let m = monsters[i];
          m.x -= m.speed;

          ctx.fillStyle = '#ff007f';
          ctx.shadowColor = '#ff007f';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(m.x, m.y, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          if (m.x <= player.x + 30) {
            isGameOver = true;
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
        canvas.removeEventListener('click', handleCanvasClick);
      };
    }

    // --- FALLBACK / DEFAULT ARCADE MINI-GAME ---
    else {
      let targets = [];
      let frame = 0;

      triggerActionRef.current = {
        action1: null,
        action2: null
      };

      const handleCanvasClick = (e) => {
        const rect = canvas.getBoundingClientRect();
        let clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
        let clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

        for (let i = targets.length - 1; i >= 0; i--) {
          let t = targets[i];
          let dist = Math.hypot(clickX - t.x, clickY - t.y);
          if (dist < t.radius + 10) {
            targets.splice(i, 1);
            localScore += 50;
            setScore(localScore);
            break;
          }
        }
      };

      canvas.addEventListener('click', handleCanvasClick);

      const loop = () => {
        if (gameState !== 'PLAYING') return;
        frame++;

        ctx.fillStyle = '#0b0e17';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (frame % 30 === 0) {
          targets.push({
            x: 40 + Math.random() * (canvas.width - 80),
            y: 40 + Math.random() * (canvas.height - 80),
            radius: 20,
            life: 120
          });
        }

        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('TAP NEON NODES TO SCORE!', 100, 30);

        for (let i = targets.length - 1; i >= 0; i--) {
          let t = targets[i];
          t.life -= 1;

          ctx.fillStyle = '#00f0ff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          if (t.life <= 0) {
            targets.splice(i, 1);
          }
        }

        if (frame > 900) { // 30 second rounds
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
        canvas.removeEventListener('click', handleCanvasClick);
      };
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
                 game.miniGameType === 'racing' ? 'Steer left and right to dodge traffic and hit nitro cores!' :
                 game.miniGameType === 'rpg' ? 'Slash monster waves with your katana or blast them with spells!' :
                 'Tap screen or buttons below to score points!'}
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
            {triggerActionRef.current.labelFire ? (
              <div className="flex gap-2 w-full">
                <button
                  onClick={() => triggerActionRef.current.action1()}
                  className="flex-1 py-3 rounded-xl bg-slate-800 active:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1 touch-manipulation"
                >
                  {triggerActionRef.current.label1}
                </button>
                <button
                  onClick={() => triggerActionRef.current.actionFire()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1 touch-manipulation shadow-md"
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
