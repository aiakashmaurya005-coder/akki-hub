/* ========================================================
   AKKI'S HUB - Master Interactive Digital Playground Core
   Creator: Akash Maurya (Akki)
   Aesthetic: Cyberpunk / Neon / Futuristic Playground
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Audio SFX Engine (Native Web Audio API Synthesizer)
    const sfx = initAudioEngine();

    // 2. Dynamic Cyber Canvas Particle Background
    initCyberCanvas();

    // 3. Desktop Glowing Mouse Follower
    initGlowCursor();

    // 4. Live Clock & Dynamic Telemetry
    initClockAndTelemetry();

    // 5. Matrix Rain Effect Engine (Triggerable via Terminal / Konami)
    const matrixRain = initMatrixRain();

    // 6. AKKI-CHAN Live Companion & Real Voice System
    const akkiChan = initAkkiChan(sfx);

    // 7. Master Module Modal System (6 Interactive Playground Modules)
    const modalSys = initPlaygroundModules(sfx, matrixRain, akkiChan);

    // 8. Social / Connection Hub (Instagram, Discord, Spotify, Roblox)
    initConnectSection(sfx, akkiChan);

    // 9. Easter Egg "Mess Around" Trigger & Global Konami Code
    initEasterEggs(sfx, matrixRain, akkiChan);
});

/* ========================================================
   1. PROCEDURAL AUDIO SYNTHESIZER ENGINE (Web Audio API)
   ======================================================== */
function initAudioEngine() {
    let audioCtx = null;
    let soundEnabled = true;

    const soundToggleBtn = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const soundLabel = document.getElementById('sound-label');

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundIcon && soundLabel) {
                if (soundEnabled) {
                    soundIcon.textContent = '🔊';
                    soundLabel.textContent = 'AUDIO: SFX ON';
                    showToast('🔊 Audio SFX Enabled');
                    playChime();
                } else {
                    soundIcon.textContent = '🔇';
                    soundLabel.textContent = 'AUDIO: SFX OFF';
                    showToast('🔇 Audio Muted');
                }
            }
        });
    }

    function playBeep(freq = 440, duration = 0.08, type = 'sine', volume = 0.08) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio context not allowed or failed silently
        }
    }

    function playChime() {
        if (!soundEnabled) return;
        setTimeout(() => playBeep(523.25, 0.09, 'triangle', 0.08), 0);   // C5
        setTimeout(() => playBeep(659.25, 0.09, 'triangle', 0.08), 70);  // E5
        setTimeout(() => playBeep(783.99, 0.14, 'triangle', 0.08), 140); // G5
    }

    function playClick() {
        playBeep(850, 0.04, 'sine', 0.06);
    }

    function playHover() {
        playBeep(320, 0.03, 'sine', 0.03);
    }

    function playTerminalBlip() {
        playBeep(1200, 0.025, 'triangle', 0.04);
    }

    function playSnakeEat() {
        if (!soundEnabled) return;
        playBeep(700, 0.05, 'square', 0.07);
        setTimeout(() => playBeep(1050, 0.08, 'square', 0.08), 50);
    }

    function playGameOver() {
        if (!soundEnabled) return;
        playBeep(450, 0.12, 'sawtooth', 0.09);
        setTimeout(() => playBeep(360, 0.15, 'sawtooth', 0.09), 110);
        setTimeout(() => playBeep(240, 0.25, 'sawtooth', 0.1), 240);
    }

    function playBurst() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.35);

            gain.gain.setValueAtTime(0.18, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch (e) {}
    }

    function playSecretUnlock() {
        if (!soundEnabled) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            setTimeout(() => playBeep(freq, 0.15, 'triangle', 0.09), idx * 80);
        });
    }

    function playLockBuzz() {
        playBeep(150, 0.15, 'sawtooth', 0.07);
    }

    return {
        playClick,
        playChime,
        playHover,
        playBeep,
        playTerminalBlip,
        playSnakeEat,
        playGameOver,
        playBurst,
        playSecretUnlock,
        playLockBuzz,
        isEnabled: () => soundEnabled
    };
}

/* ========================================================
   2. INTERACTIVE PARTICLE CANVAS BACKGROUND
   ======================================================== */
function initCyberCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createParticles();
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 1.8 + 0.8;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.color = Math.random() > 0.4 ? 'rgba(0, 243, 255, ' : 'rgba(176, 38, 255, ';
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color + '0.8)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function createParticles() {
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    createParticles();

    // Mouse Tracking for Canvas
    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.025)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw and connect particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 243, 255, ${0.18 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }

            // Connect to Mouse
            const mdx = particles[i].x - mouseX;
            const mdy = particles[i].y - mouseY;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(176, 38, 255, ${0.25 * (1 - mdist / 150)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ========================================================
   3. GLOW CURSOR FOLLOWER
   ======================================================== */
function initGlowCursor() {
    const cursor = document.getElementById('glow-cursor');
    if (!cursor) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function renderCursor() {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();
}

/* ========================================================
   4. LIVE CLOCK & TELEMETRY
   ======================================================== */
function initClockAndTelemetry() {
    const clockEl = document.getElementById('live-clock');
    const pingEl = document.getElementById('ping-val');
    const tickerEl = document.getElementById('system-status-ticker');
    const uptimeEl = document.getElementById('uptime-val');

    const startTime = Date.now();

    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        if (clockEl) clockEl.textContent = `${hrs}:${mins}:${secs}`;

        // Uptime counter in seconds
        if (uptimeEl) {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const m = Math.floor(elapsed / 60);
            const s = elapsed % 60;
            uptimeEl.textContent = `UPTIME: ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Randomize ping slightly for dynamic cyber feel
    setInterval(() => {
        if (pingEl) {
            const randomPing = Math.floor(Math.random() * 8) + 10;
            pingEl.textContent = randomPing;
        }
    }, 4000);

    // Subtle random system status messages in top status bar
    const systemNotes = [
        "NODE: LOCAL ACTIVE",
        "GRID: SYNCHRONIZED",
        "SYS: MEMORY OPTIMAL",
        "PORTAL: V2.0 READY",
        "SYNTH: AUDIO ENGINE LOADED"
    ];
    let noteIdx = 0;
    setInterval(() => {
        if (tickerEl) {
            noteIdx = (noteIdx + 1) % systemNotes.length;
            tickerEl.textContent = systemNotes[noteIdx];
        }
    }, 7000);
}

/* ========================================================
   5. MATRIX RAIN EFFECT ENGINE
   ======================================================== */
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return { trigger: () => {} };
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let isRunning = false;
    let timer = null;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const characters = '01AKKIMATRIXｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾔﾕﾗﾘﾜ98765432';
    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(1);

    function draw() {
        if (!isRunning) return;
        ctx.fillStyle = 'rgba(7, 9, 19, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00ffaa';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        requestAnimationFrame(draw);
    }

    function trigger(durationMs = 7000) {
        columns = Math.floor(width / fontSize);
        drops = Array(columns).fill(1);
        canvas.className = 'matrix-rain-active';
        isRunning = true;
        draw();

        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            canvas.className = 'matrix-rain-hidden';
            isRunning = false;
            ctx.clearRect(0, 0, width, height);
        }, durationMs);
    }

    return { trigger };
}

/* ========================================================
   6. MASTER PLAYGROUND MODULES SYSTEM
   ======================================================== */
function initPlaygroundModules(sfx, matrixRain, akkiChan) {
    const cards = document.querySelectorAll('.hub-card');
    let activeModal = null;

    // Sub-systems references
    const snakeGame = initCyberSnake(sfx, akkiChan);
    const aiNode = initLocalAINode(sfx);
    const techLab = initTechLab(sfx);
    const projectsArchive = initProjectsArchive(sfx);
    const aboutProfile = initAboutProfile(sfx);
    const secretTerminal = initSecretTerminal(sfx, matrixRain, akkiChan);

    // Map each card category to its dedicated modal
    const modalMap = {
        'games': document.getElementById('modal-games'),
        'ai': document.getElementById('modal-ai'),
        'lab': document.getElementById('modal-lab'),
        'projects': document.getElementById('modal-projects'),
        'about': document.getElementById('modal-about'),
        'secret': document.getElementById('modal-secret')
    };

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => sfx.playHover());

        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            const targetModal = modalMap[category];
            if (targetModal) {
                openModal(targetModal, category);
            }
        });
    });

    function openModal(modalEl, category) {
        if (!modalEl) return;
        sfx.playChime();
        modalEl.classList.add('active');
        modalEl.setAttribute('aria-hidden', 'false');
        activeModal = modalEl;

        // Specific sub-system start hooks
        if (category === 'games') {
            snakeGame.onOpen();
        } else if (category === 'lab') {
            techLab.onOpen();
        } else if (category === 'ai') {
            aiNode.onOpen();
        } else if (category === 'secret') {
            secretTerminal.onOpen();
        }

        // AKKI-CHAN live companion reaction hook
        if (akkiChan && akkiChan.onModuleOpen) {
            akkiChan.onModuleOpen(category);
        }
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        sfx.playClick();
        modalEl.classList.remove('active');
        modalEl.setAttribute('aria-hidden', 'true');

        // Specific sub-system pause/cleanup hooks
        if (modalEl.id === 'modal-games') {
            snakeGame.onClose();
        } else if (modalEl.id === 'modal-lab') {
            techLab.onClose();
        }

        activeModal = null;
    }

    // Generic Close Buttons in all modals
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-close');
            const targetModal = document.getElementById(targetId) || activeModal;
            closeModal(targetModal);
        });
    });

    // Backdrop click close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // ESC key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeModal) {
            closeModal(activeModal);
        }
    });

    return { openModal, closeModal };
}

/* ========================================================
   MODULE 01: AKKI ARCADE // CYBER SNAKE ENGINE
   ======================================================== */
function initCyberSnake(sfx, akkiChan) {
    const canvas = document.getElementById('snake-canvas');
    if (!canvas) return { onOpen: () => {}, onClose: () => {} };
    const ctx = canvas.getContext('2d');

    const scoreVal = document.getElementById('snake-score');
    const highScoreVal = document.getElementById('snake-high-score');
    const statusVal = document.getElementById('snake-status');
    const overlay = document.getElementById('snake-overlay');
    const overlayTitle = document.getElementById('snake-overlay-title');
    const overlayDesc = document.getElementById('snake-overlay-desc');
    const startBtn = document.getElementById('snake-start-btn');
    const pauseBtn = document.getElementById('snake-pause-btn');
    const restartBtn = document.getElementById('snake-restart-btn');

    // Grid configuration
    const gridSize = 20;
    const tileCount = canvas.width / gridSize; // 20x20 = 400

    let snake = [];
    let food = { x: 15, y: 15 };
    let dx = 1;
    let dy = 0;
    let nextDx = 1;
    let nextDy = 0;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('akki_snake_highscore') || '0', 10);
    if (highScoreVal) highScoreVal.textContent = highScore;

    let initialSessionHighScore = highScore;
    let hasCelebratedNewRecord = false;

    let isRunning = false;
    let isPaused = false;
    let gameLoopId = null;
    let lastRenderTime = 0;
    let speedMs = 120;

    function resetGame() {
        snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        dx = 1;
        dy = 0;
        nextDx = 1;
        nextDy = 0;
        score = 0;
        speedMs = 120;
        initialSessionHighScore = highScore;
        hasCelebratedNewRecord = false;
        if (scoreVal) scoreVal.textContent = score;
        if (statusVal) statusVal.textContent = 'RUNNING';
        spawnFood();
    }

    function spawnFood() {
        let valid = false;
        while (!valid) {
            food.x = Math.floor(Math.random() * tileCount);
            food.y = Math.floor(Math.random() * tileCount);
            valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
        }
    }

    function update() {
        dx = nextDx;
        dy = nextDy;

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Grid boundaries check (Game Over)
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            handleGameOver();
            return;
        }

        // Tail collision check
        if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            handleGameOver();
            return;
        }

        snake.unshift(head);

        // Check Food
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            if (scoreVal) scoreVal.textContent = score;
            sfx.playSnakeEat();

            if (score > highScore) {
                const wasNewRecord = !hasCelebratedNewRecord && (initialSessionHighScore > 0 ? score > initialSessionHighScore : score >= 10);
                highScore = score;
                localStorage.setItem('akki_snake_highscore', String(highScore));
                if (highScoreVal) highScoreVal.textContent = highScore;
                if (wasNewRecord && akkiChan && akkiChan.onNewHighScore) {
                    hasCelebratedNewRecord = true;
                    akkiChan.onNewHighScore(score);
                }
            }

            // Speed up slightly as score rises
            speedMs = Math.max(65, 120 - Math.floor(score / 30) * 8);
            spawnFood();
        } else {
            snake.pop();
        }
    }

    function draw() {
        ctx.fillStyle = '#04060e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cyber Grid Lines
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= canvas.width; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Draw Pulsing Energy Food
        const pulse = Math.sin(Date.now() / 150) * 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffaa';
        ctx.fillStyle = '#00ffaa';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 3 + pulse,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Snake
        snake.forEach((segment, idx) => {
            if (idx === 0) {
                // Head
                ctx.fillStyle = '#00f3ff';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#00f3ff';
            } else {
                // Body gradient to purple
                const ratio = idx / snake.length;
                ctx.fillStyle = ratio < 0.5 ? '#38bdf8' : '#b026ff';
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#b026ff';
            }

            ctx.fillRect(
                segment.x * gridSize + 1,
                segment.y * gridSize + 1,
                gridSize - 2,
                gridSize - 2
            );
        });
        ctx.shadowBlur = 0;
    }

    function gameLoop(currentTime) {
        if (!isRunning) return;

        if (!isPaused && currentTime - lastRenderTime >= speedMs) {
            update();
            draw();
            lastRenderTime = currentTime;
        }

        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
        resetGame();
        isRunning = true;
        isPaused = false;
        if (overlay) overlay.classList.add('hidden');
        if (statusVal) statusVal.textContent = 'RUNNING';
        lastRenderTime = performance.now();
        cancelAnimationFrame(gameLoopId);
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function togglePause() {
        if (!isRunning) return;
        isPaused = !isPaused;
        if (statusVal) statusVal.textContent = isPaused ? 'PAUSED' : 'RUNNING';
        sfx.playClick();

        if (isPaused) {
            if (overlayTitle) overlayTitle.textContent = 'GAME PAUSED';
            if (overlayDesc) overlayDesc.textContent = `Current Score: ${score} • Press SPACE or RESUME to continue.`;
            if (startBtn) startBtn.textContent = 'RESUME GAME';
            if (overlay) overlay.classList.remove('hidden');
        } else {
            if (overlay) overlay.classList.add('hidden');
        }
    }

    function handleGameOver() {
        isRunning = false;
        sfx.playGameOver();
        if (statusVal) statusVal.textContent = 'GAME OVER';

        if (overlayTitle) overlayTitle.textContent = 'SYSTEM OVERLOAD // GAME OVER';
        if (overlayDesc) overlayDesc.textContent = `Final Score: ${score} • High Score: ${highScore}`;
        if (startBtn) startBtn.textContent = 'RESTART SYSTEM';
        if (overlay) overlay.classList.remove('hidden');
    }

    // Direction handler
    function changeDirection(newDx, newDy) {
        if (newDx !== 0 && dx !== 0) return; // Prevent 180 reverse
        if (newDy !== 0 && dy !== 0) return;
        nextDx = newDx;
        nextDy = newDy;
        sfx.playClick();
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
        const modalGames = document.getElementById('modal-games');
        if (!modalGames || !modalGames.classList.contains('active')) return;

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault(); // Prevent page scroll
        }

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                changeDirection(0, -1);
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                changeDirection(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                changeDirection(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                changeDirection(1, 0);
                break;
            case ' ':
                togglePause();
                break;
        }
    });

    // Touch D-Pad
    const btnUp = document.getElementById('dpad-up');
    const btnDown = document.getElementById('dpad-down');
    const btnLeft = document.getElementById('dpad-left');
    const btnRight = document.getElementById('dpad-right');

    if (btnUp) btnUp.addEventListener('click', () => changeDirection(0, -1));
    if (btnDown) btnDown.addEventListener('click', () => changeDirection(0, 1));
    if (btnLeft) btnLeft.addEventListener('click', () => changeDirection(-1, 0));
    if (btnRight) btnRight.addEventListener('click', () => changeDirection(1, 0));

    if (startBtn) startBtn.addEventListener('click', startGame);
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
    if (restartBtn) restartBtn.addEventListener('click', startGame);

    // Locked slots interactive feedback
    ['slot-game-2', 'slot-game-3'].forEach(id => {
        const slotEl = document.getElementById(id);
        if (slotEl) {
            slotEl.addEventListener('click', () => {
                sfx.playLockBuzz();
                showToast('🔒 MODULE NOT INSTALLED. COMPILATION IN QUEUE.');
            });
        }
    });

    return {
        onOpen: () => {
            draw();
        },
        onClose: () => {
            isRunning = false;
            cancelAnimationFrame(gameLoopId);
        }
    };
}

/* ========================================================
   MODULE 02: AI ZONE // AKKI LOCAL AI NODE
   ======================================================== */
function initLocalAINode(sfx) {
    const terminalLog = document.getElementById('ai-terminal-log');
    const form = document.getElementById('ai-input-form');
    const input = document.getElementById('ai-input');
    const clearBtn = document.getElementById('ai-clear-btn');
    const quickChips = document.querySelectorAll('.ai-chip');

    const history = [];
    let historyIdx = -1;

    // Knowledge & heuristic responses
    const responses = {
        'akki': "Akash Maurya (Akki) — Developer, Gamer, Tech Explorer. Passionate about machine learning pipelines, OpenCV computer vision, and building digital playgrounds just to see what's possible.",
        'who are you': "I am the local simulated node residing in AKKI'S HUB. No cloud servers, no trackers — just pure offline JavaScript running directly in your browser session.",
        'gaming': "Akki's gaming profile: Big fan of high-energy RPGs, immersive mechanics, and competitive matches. Check out the Roblox connection or launch Cyber Snake in Module 01!",
        'anime': "Favorite vibes: Cyberpunk 2077 Edgerunners, Solo Leveling, Steins;Gate, and peak action shonen with high-stakes tension.",
        'tech': "Core technology focus: Python, Scikit-learn, OpenCV computer vision, C++ algorithmic problem-solving, and native modern web creative development.",
        'python': "Python: Akki's primary language for predictive data science, OpenCV image pipelines, and fast backend automation.",
        'javascript': "JavaScript: The engine driving this entire hub! Built with vanilla HTML5 Canvas and native Web Audio synthesis without bloated frameworks.",
        'machine learning': "Machine Learning: Implemented predictive pipelines like Customer Churn Prediction (Scikit-learn) and exploring ocular pattern verification with OpenCV.",
        'projects': "Active project archives: 1. Customer Churn Prediction, 2. Iris Attendance System, 3. Delhi Metro Dijkstra Routing, 4. Interactive Web Playground. Explore Module 04 for full details!",
        'secret': "Curious? Head over to Module 06: Secret Vault or try entering the Konami code on your keyboard...",
        'help': "Available query protocols: 'akki', 'who are you', 'gaming', 'anime', 'tech', 'python', 'javascript', 'projects', 'secret', 'time', 'clear'.",
        'hello': "Greetings, Explorer. Akki Local Node is online. Type 'help' or click any prompt below to explore.",
        'hi': "System link established! How can Akki's local node assist your exploration today?",
        'time': () => `System local time: ${new Date().toLocaleTimeString()} • Portal status: ONLINE.`
    };

    function appendMessage(sender, text, isBot = false) {
        if (!terminalLog) return;

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${isBot ? 'bot' : 'user'}`;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'msg-meta';
        metaDiv.innerHTML = `<span class="msg-author">${isBot ? 'NODE://AKKI-AI' : 'USER://GUEST'}</span> <span class="msg-time">${timeStr}</span>`;

        const textDiv = document.createElement('div');
        textDiv.className = 'msg-text';

        msgDiv.appendChild(metaDiv);
        msgDiv.appendChild(textDiv);
        terminalLog.appendChild(msgDiv);

        if (isBot) {
            // Typing effect
            let charIdx = 0;
            textDiv.textContent = '';
            const interval = setInterval(() => {
                if (charIdx < text.length) {
                    textDiv.textContent += text.charAt(charIdx);
                    charIdx++;
                    terminalLog.scrollTop = terminalLog.scrollHeight;
                } else {
                    clearInterval(interval);
                }
            }, 12);
        } else {
            textDiv.textContent = text;
            terminalLog.scrollTop = terminalLog.scrollHeight;
        }
    }

    function processQuery(rawQuery) {
        const query = rawQuery.trim().toLowerCase();
        if (!query) return;

        appendMessage('user', rawQuery, false);
        sfx.playTerminalBlip();

        history.push(rawQuery);
        historyIdx = history.length;

        // Match keyword
        let reply = null;
        for (const [key, val] of Object.entries(responses)) {
            if (query.includes(key)) {
                reply = typeof val === 'function' ? val() : val;
                break;
            }
        }

        if (!reply) {
            const fallbackPool = [
                "Pattern unmatched in local heuristics. Try querying 'akki', 'projects', or 'gaming'.",
                "Neural vector search returned null. Akki hasn't logged a response for that command yet!",
                "Signal received, but local query filters returned no entry. Type 'help' for available queries."
            ];
            reply = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
        }

        setTimeout(() => {
            appendMessage('bot', reply, true);
        }, 200);
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!input) return;
            const val = input.value;
            input.value = '';
            processQuery(val);
        });
    }

    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                if (historyIdx > 0) {
                    historyIdx--;
                    input.value = history[historyIdx];
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIdx < history.length - 1) {
                    historyIdx++;
                    input.value = history[historyIdx];
                } else {
                    historyIdx = history.length;
                    input.value = '';
                }
            }
        });
    }

    quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (prompt) {
                processQuery(prompt);
            }
        });
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (!terminalLog) return;
            terminalLog.innerHTML = `
                <div class="ai-msg bot">
                    <div class="msg-meta"><span class="msg-author">NODE://AKKI-AI</span> <span class="msg-time">00:00</span></div>
                    <div class="msg-text">Terminal cleared. Ready for inquiry.</div>
                </div>
            `;
            sfx.playClick();
        });
    }

    return {
        onOpen: () => {
            if (input) setTimeout(() => input.focus(), 250);
        }
    };
}

/* ========================================================
   MODULE 03: TECH LAB // PARTICLE GRAVITY LAB
   ======================================================== */
function initTechLab(sfx) {
    const canvas = document.getElementById('lab-canvas');
    if (!canvas) return { onOpen: () => {}, onClose: () => {} };
    const ctx = canvas.getContext('2d');

    const forceSlider = document.getElementById('lab-force-slider');
    const forceVal = document.getElementById('lab-force-val');
    const modeToggle = document.getElementById('lab-mode-toggle');
    const countSlider = document.getElementById('lab-count-slider');
    const countVal = document.getElementById('lab-count-val');
    const distSlider = document.getElementById('lab-dist-slider');
    const distVal = document.getElementById('lab-dist-val');
    const burstBtn = document.getElementById('lab-burst-btn');
    const resetBtn = document.getElementById('lab-reset-btn');

    let isRunning = false;
    let animId = null;

    let width = canvas.width = 680;
    let height = canvas.height = 380;

    let isAttractMode = true;
    let forcePower = 50;
    let targetCount = 100;
    let linkDistance = 110;

    const particles = [];
    const bursts = [];

    // Mouse coordinates relative to lab canvas
    let mouseX = -1000;
    let mouseY = -1000;
    let isHovering = false;

    class LabParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = Math.random() * 2.2 + 1.2;
            this.baseColor = Math.random() > 0.5 ? '#00ffaa' : '#00f3ff';
        }

        update() {
            // Apply mouse gravity/repulsion
            if (isHovering && mouseX > 0 && mouseY > 0) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 5 && dist < 220) {
                    const dir = isAttractMode ? 1 : -1;
                    const force = (forcePower / 1000) * dir * (1 - dist / 220);
                    this.vx += (dx / dist) * force * 1.5;
                    this.vy += (dy / dist) * force * 1.5;
                }
            }

            // Damping to keep stable
            this.vx *= 0.985;
            this.vy *= 0.985;

            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0) { this.x = 0; this.vx *= -1; }
            if (this.x > width) { this.x = width; this.vx *= -1; }
            if (this.y < 0) { this.y = 0; this.vy *= -1; }
            if (this.y > height) { this.y = height; this.vy *= -1; }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.baseColor;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function syncParticles() {
        while (particles.length < targetCount) {
            particles.push(new LabParticle());
        }
        while (particles.length > targetCount) {
            particles.pop();
        }
    }

    function triggerBurst(atX = width / 2, atY = height / 2) {
        sfx.playBurst();
        bursts.push({ x: atX, y: atY, radius: 10, maxRadius: 180, alpha: 1 });

        particles.forEach(p => {
            const dx = p.x - atX;
            const dy = p.y - atY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const power = (1 - dist / 200) * 12;
                p.vx += (dx / (dist || 1)) * power;
                p.vy += (dy / (dist || 1)) * power;
            }
        });
    }

    function loop() {
        if (!isRunning) return;

        ctx.fillStyle = 'rgba(3, 6, 17, 0.28)';
        ctx.fillRect(0, 0, width, height);

        // Update and draw bursts
        for (let b = bursts.length - 1; b >= 0; b--) {
            const burst = bursts[b];
            burst.radius += 6;
            burst.alpha -= 0.035;

            ctx.beginPath();
            ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 170, ${Math.max(0, burst.alpha)})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            if (burst.alpha <= 0) {
                bursts.splice(b, 1);
            }
        }

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < linkDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 255, 170, ${0.25 * (1 - dist / linkDistance)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(loop);
    }

    // Canvas Mouse / Touch events
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (width / rect.width);
        mouseY = (e.clientY - rect.top) * (height / rect.height);
        isHovering = true;
    });

    canvas.addEventListener('mouseleave', () => {
        isHovering = false;
        mouseX = -1000;
        mouseY = -1000;
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (width / rect.width);
        const y = (e.clientY - rect.top) * (height / rect.height);
        triggerBurst(x, y);
    });

    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouseX = (e.touches[0].clientX - rect.left) * (width / rect.width);
            mouseY = (e.touches[0].clientY - rect.top) * (height / rect.height);
            isHovering = true;
        }
    }, { passive: true });

    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.touches[0].clientX - rect.left) * (width / rect.width);
            const y = (e.touches[0].clientY - rect.top) * (height / rect.height);
            triggerBurst(x, y);
        }
    }, { passive: true });

    // Slider Controls
    if (forceSlider) {
        forceSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            forcePower = Math.abs(val);
            isAttractMode = val >= 0;
            if (forceVal) forceVal.textContent = `${isAttractMode ? 'ATTRACT' : 'REPEL'} (${forcePower})`;
            if (modeToggle) modeToggle.textContent = `MODE: ${isAttractMode ? 'ATTRACT' : 'REPEL'}`;
        });
    }

    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            isAttractMode = !isAttractMode;
            modeToggle.textContent = `MODE: ${isAttractMode ? 'ATTRACT' : 'REPEL'}`;
            if (forceSlider) {
                forceSlider.value = isAttractMode ? forcePower : -forcePower;
            }
            if (forceVal) forceVal.textContent = `${isAttractMode ? 'ATTRACT' : 'REPEL'} (${forcePower})`;
            sfx.playClick();
        });
    }

    if (countSlider) {
        countSlider.addEventListener('input', (e) => {
            targetCount = parseInt(e.target.value, 10);
            if (countVal) countVal.textContent = targetCount;
            syncParticles();
        });
    }

    if (distSlider) {
        distSlider.addEventListener('input', (e) => {
            linkDistance = parseInt(e.target.value, 10);
            if (distVal) distVal.textContent = `${linkDistance}px`;
        });
    }

    if (burstBtn) burstBtn.addEventListener('click', () => triggerBurst());
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            isAttractMode = true;
            forcePower = 50;
            targetCount = 100;
            linkDistance = 110;
            if (forceSlider) forceSlider.value = 50;
            if (countSlider) countSlider.value = 100;
            if (distSlider) distSlider.value = 110;
            if (forceVal) forceVal.textContent = 'ATTRACT (50)';
            if (countVal) countVal.textContent = '100';
            if (distVal) distVal.textContent = '110px';
            if (modeToggle) modeToggle.textContent = 'MODE: ATTRACT';
            syncParticles();
            sfx.playChime();
            showToast('↺ Tech Lab Parameters Reset to Default');
        });
    }

    syncParticles();

    return {
        onOpen: () => {
            isRunning = true;
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(loop);
        },
        onClose: () => {
            isRunning = false;
            cancelAnimationFrame(animId);
        }
    };
}

/* ========================================================
   MODULE 04: PROJECTS // INTERACTIVE ARCHIVE
   ======================================================== */
function initProjectsArchive(sfx) {
    const entries = document.querySelectorAll('.project-entry');

    entries.forEach(entry => {
        const summary = entry.querySelector('.project-summary-bar');
        if (summary) {
            summary.addEventListener('click', () => {
                const isActive = entry.classList.contains('active');
                entries.forEach(e => e.classList.remove('active'));
                if (!isActive) {
                    entry.classList.add('active');
                    sfx.playClick();
                }
            });
        }
    });

    return {};
}

/* ========================================================
   MODULE 05: ABOUT AKKI // IDENTITY PROFILE
   ======================================================== */
function initAboutProfile(sfx) {
    const tabs = document.querySelectorAll('.about-tab');
    const panels = document.querySelectorAll('.tab-panel');
    const skillItems = document.querySelectorAll('.skill-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');

            sfx.playClick();
        });
    });

    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            const skill = item.getAttribute('data-skill');
            const focus = item.querySelector('.skill-focus')?.textContent || '';
            sfx.playHover();
            showToast(`⚡ ${skill}: ${focus}`);
        });
    });

    return {};
}

/* ========================================================
   MODULE 06: SECRET VAULT // SECURE TERMINAL
   ======================================================== */
function initSecretTerminal(sfx, matrixRain, akkiChan) {
    const terminalLog = document.getElementById('secret-terminal-log');
    const form = document.getElementById('secret-input-form');
    const input = document.getElementById('secret-input');
    const cmdPills = document.querySelectorAll('.cmd-pill');
    const secretCardBadge = document.getElementById('secret-card-badge');
    const accessTag = document.getElementById('secret-access-tag');

    const history = [];
    let historyIdx = -1;

    function appendLine(text, className = '') {
        if (!terminalLog) return;
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        terminalLog.appendChild(line);
        terminalLog.scrollTop = terminalLog.scrollHeight;
    }

    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        appendLine(`root@akki-hub:~# ${rawCmd}`);
        sfx.playTerminalBlip();

        history.push(rawCmd);
        historyIdx = history.length;

        switch (cmd) {
            case 'help':
                appendLine('AVAILABLE SYSTEM PROTOCOLS:');
                appendLine('  help     - Display this command index');
                appendLine('  whoami   - Display creator credentials');
                appendLine('  status   - Run live system diagnostic scan');
                appendLine('  matrix   - Trigger fullscreen falling code rain');
                appendLine('  theme    - Toggle hyper-neon visual boost');
                appendLine('  hack     - Execute simulated hollywood breach');
                appendLine('  unlock   - Decrypt restricted vault payload');
                appendLine('  konami   - Verify Konami override protocol');
                appendLine('  clear    - Flush terminal console buffer');
                break;

            case 'clear':
                terminalLog.innerHTML = '';
                appendLine('Console buffer cleared.');
                break;

            case 'whoami':
                appendLine('AKASH MAURYA [AKA AKKI]');
                appendLine('ROLE: Creator & Digital Playground Architect');
                appendLine('MOTTO: "I build things just to see what\'s possible."');
                appendLine('LOCATION: Virtual Node // India');
                break;

            case 'status':
                appendLine(`SYSTEM DIAGNOSTIC:`);
                appendLine(`  CLOCK: ${new Date().toLocaleTimeString()}`);
                appendLine(`  HUB STATUS: ONLINE`);
                appendLine(`  AUDIO SYNTH: ${sfx.isEnabled() ? 'ENABLED' : 'MUTED'}`);
                appendLine(`  RESOLUTION: ${window.innerWidth}x${window.innerHeight}`);
                appendLine(`  TERMINAL INTEGRITY: 100% SECURE`);
                break;

            case 'matrix':
                appendLine('INITIATING MATRIX CASCADE OVERLAY...', 'terminal-success');
                matrixRain.trigger(7000);
                sfx.playChime();
                break;

            case 'theme':
                document.body.classList.toggle('hyper-neon');
                const isHyper = document.body.classList.contains('hyper-neon');
                appendLine(`HYPER-NEON MODE: ${isHyper ? 'ACTIVATED' : 'DEACTIVATED'}`, 'terminal-warning');
                showToast(`⚡ Hyper-Neon Theme ${isHyper ? 'Activated' : 'Normal'}`);
                sfx.playChime();
                break;

            case 'hack':
                appendLine('[STARTING HARLESS HOLLYWOOD BREACH PROTOCOL...]', 'terminal-warning');
                setTimeout(() => appendLine('>>> Bypassing main proxy firewall... [OK]'), 200);
                setTimeout(() => appendLine('>>> Injecting quantum algorithms... [OK]'), 450);
                setTimeout(() => appendLine('>>> Downloading coffee supply... [100%]'), 700);
                setTimeout(() => {
                    appendLine('>>> BREACH RESULT: 0 Vulnerabilities. Nice try, Explorer! 👾', 'terminal-success');
                    sfx.playChime();
                }, 950);
                break;

            case 'unlock':
                appendLine('========================================', 'terminal-success');
                appendLine('ACCESS GRANTED // AKKI SECRET MODE', 'terminal-success');
                appendLine('WELCOME, EXPLORER.', 'terminal-success');
                appendLine('"Curiosity is the true engine of discovery."', 'terminal-success');
                appendLine('========================================', 'terminal-success');

                if (secretCardBadge) {
                    secretCardBadge.textContent = 'UNLOCKED // VAULT';
                    secretCardBadge.classList.remove('locked', 'crimson-badge');
                    secretCardBadge.classList.add('cyan-badge');
                }
                if (accessTag) accessTag.textContent = 'ACCESS LEVEL: GRANTED';
                sfx.playSecretUnlock();
                showToast('🎉 Secret Vault Unlocked! Welcome, Explorer.');
                if (akkiChan && akkiChan.onSecretUnlocked) akkiChan.onSecretUnlocked();
                break;

            case 'konami':
                appendLine('OVERRIDE CODE ACCEPTED. GOD MODE ACTIVATED.', 'terminal-success');
                matrixRain.trigger(8000);
                sfx.playSecretUnlock();
                showToast('🎮 Konami Code Override Accepted!');
                if (akkiChan && akkiChan.onSecretUnlocked) akkiChan.onSecretUnlocked();
                break;

            default:
                appendLine(`Command not recognized: '${cmd}'. Type 'help' for protocol list.`, 'banner-line');
                break;
        }
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!input) return;
            const val = input.value;
            input.value = '';
            executeCommand(val);
        });
    }

    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                if (historyIdx > 0) {
                    historyIdx--;
                    input.value = history[historyIdx];
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIdx < history.length - 1) {
                    historyIdx++;
                    input.value = history[historyIdx];
                } else {
                    historyIdx = history.length;
                    input.value = '';
                }
            }
        });
    }

    cmdPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const cmd = pill.getAttribute('data-cmd');
            if (cmd) executeCommand(cmd);
        });
    });

    return {
        onOpen: () => {
            if (input) setTimeout(() => input.focus(), 250);
        }
    };
}

/* ========================================================
   7. SOCIAL / CONNECTION HUB (Instagram, Discord, Spotify, Roblox)
   ======================================================== */
function initConnectSection(sfx, akkiChan) {
    // 1. Instagram
    const instaLink = document.getElementById('connect-insta');
    if (instaLink) {
        instaLink.addEventListener('click', () => {
            sfx.playChime();
            showToast('📸 Opening Instagram Profile: @akki.aia...');
            if (akkiChan && akkiChan.onSocialClick) akkiChan.onSocialClick('instagram');
        });
    }

    // 2. Spotify
    const spotifyLink = document.getElementById('connect-spotify');
    if (spotifyLink) {
        spotifyLink.addEventListener('click', () => {
            sfx.playChime();
            showToast("🎧 Tuning into Akki's Spotify Profile...");
            if (akkiChan && akkiChan.onSocialClick) akkiChan.onSocialClick('spotify');
        });
    }

    // 3. Roblox
    const robloxLink = document.getElementById('connect-roblox');
    if (robloxLink) {
        robloxLink.addEventListener('click', () => {
            sfx.playChime();
            showToast('🎮 Launching Roblox Player Portal...');
            if (akkiChan && akkiChan.onSocialClick) akkiChan.onSocialClick('roblox');
        });
    }

    // 4. Discord Copy Functions
    const copyUserBtn = document.getElementById('copy-discord-user-btn');
    const copyIdBtn = document.getElementById('copy-discord-id-btn');

    function copyToClipboard(text, successMsg, btnEl, originalHtml) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                sfx.playChime();
                showToast(successMsg);
                if (akkiChan && akkiChan.onSocialClick) akkiChan.onSocialClick('discord');
                if (btnEl) {
                    btnEl.innerHTML = '✓ COPIED!';
                    setTimeout(() => {
                        btnEl.innerHTML = originalHtml;
                    }, 2000);
                }
            }).catch(() => {
                fallbackCopy(text, successMsg);
            });
        } else {
            fallbackCopy(text, successMsg);
        }
    }

    function fallbackCopy(text, successMsg) {
        try {
            const temp = document.createElement('textarea');
            temp.value = text;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.focus();
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            sfx.playChime();
            showToast(successMsg);
        } catch (err) {
            prompt('Copy Discord detail manually:', text);
        }
    }

    if (copyUserBtn) {
        const origHtml = copyUserBtn.innerHTML;
        copyUserBtn.addEventListener('click', () => {
            copyToClipboard('justakki1', '📋 Discord Username "justakki1" copied!', copyUserBtn, origHtml);
        });
    }

    if (copyIdBtn) {
        const origIdHtml = copyIdBtn.innerHTML;
        copyIdBtn.addEventListener('click', () => {
            copyToClipboard('1228563784273235998', '📋 Discord ID "1228563784273235998" copied!', copyIdBtn, origIdHtml);
        });
    }
}

/* ========================================================
   8. EASTER EGGS ("Mess Around" & Global Konami Code)
   ======================================================== */
function initEasterEggs(sfx, matrixRain, akkiChan) {
    // Tagline "Mess around" trigger
    const trigger = document.getElementById('mess-around-trigger');
    const secretCard = document.querySelector('.secret-card');
    const secretCardBadge = document.getElementById('secret-card-badge');

    let clickCount = 0;
    const messages = [
        "🕹️ Curiosity engaged! Keep exploring.",
        "⚡ Matrix pulse initiated!",
        "👾 Finding secret easter egg...",
        "🎉 Secret Vault Unlocked temporarily!"
    ];

    if (trigger) {
        trigger.addEventListener('click', () => {
            sfx.playBeep(600 + clickCount * 150, 0.12, 'square');
            const msg = messages[clickCount % messages.length];
            showToast(msg);

            clickCount++;

            if (clickCount >= 3 && secretCard) {
                secretCard.classList.add('unlocked-pulse');
                if (secretCardBadge) {
                    secretCardBadge.textContent = 'DISCOVERED // VAULT';
                    secretCardBadge.classList.remove('locked', 'crimson-badge');
                    secretCardBadge.classList.add('cyan-badge');
                }
                if (akkiChan && akkiChan.onSecretUnlocked) akkiChan.onSecretUnlocked();
            }
        });
    }

    // Global Konami Code Listener: ↑ ↑ ↓ ↓ ← → ← → B A
    const konamiSequence = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiPos = 0;

    window.addEventListener('keydown', (e) => {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        const expected = konamiSequence[konamiPos];

        if (key === expected || key === expected.toLowerCase()) {
            konamiPos++;
            if (konamiPos === konamiSequence.length) {
                konamiPos = 0;
                sfx.playSecretUnlock();
                matrixRain.trigger(8000);
                showToast('🎉 KONAMI CODE UNLOCKED! Welcome to God Mode, Explorer!');
                if (secretCardBadge) {
                    secretCardBadge.textContent = 'UNLOCKED // KONAMI';
                    secretCardBadge.classList.remove('locked', 'crimson-badge');
                    secretCardBadge.classList.add('cyan-badge');
                }
                if (akkiChan && akkiChan.onSecretUnlocked) akkiChan.onSecretUnlocked();
            }
        } else {
            konamiPos = 0;
        }
    });
}

/* ========================================================
   9. AKKI-CHAN LIVE COMPANION & VOICE SYSTEM ENGINE
   ======================================================== */
function initAkkiChan(sfx) {
    const container = document.getElementById('akki-chan-container');
    const bubble = document.getElementById('akki-speech-bubble');
    const bubbleText = document.getElementById('akki-bubble-text');
    const moodBadge = document.getElementById('akki-mood-badge');
    const avatarWrapper = document.getElementById('akki-avatar-wrapper');
    const avatarImg = document.getElementById('akki-avatar-img');
    const sleepIndicator = document.getElementById('akki-sleep-indicator');

    // Controls
    const btnTalk = document.getElementById('akki-btn-talk');
    const btnReact = document.getElementById('akki-btn-react');
    const btnSleep = document.getElementById('akki-btn-sleep');
    const btnFollow = document.getElementById('akki-btn-follow');
    const btnVoice = document.getElementById('akki-btn-voice');
    const btnTest = document.getElementById('akki-btn-test');

    if (!container || !avatarWrapper || !bubble || !bubbleText) {
        return {
            speak: () => {},
            onModuleOpen: () => {},
            onNewHighScore: () => {},
            onSecretUnlocked: () => {},
            onSocialClick: () => {}
        };
    }

    // State Variables
    let voiceEnabled = localStorage.getItem('akki_chan_voice_enabled') !== 'false';
    let followEnabled = localStorage.getItem('akki_chan_follow_enabled') !== 'false';
    let hasUserInteracted = false;
    let isSleeping = false;
    let isSpeaking = false;
    let lastSpokenTime = 0;
    let lastProximityTime = 0;
    let bubbleTimer = null;
    let sleepTimer = null;
    let idleTimer = null;
    let welcomeTriggered = false;

    // Initialize button visual states from storage
    if (btnVoice) {
        btnVoice.textContent = voiceEnabled ? 'VOICE: ON' : 'VOICE: OFF';
        btnVoice.className = `akki-ctrl-btn akki-voice-btn ${voiceEnabled ? 'active' : 'muted'}`;
    }
    if (btnFollow) {
        btnFollow.textContent = followEnabled ? 'FOLLOW: ON' : 'FOLLOW: OFF';
    }

    // Dialogue Data Collections
    const dialogues = {
        welcome: [
            "Welcome to Akki's Hub! ♡"
        ],
        test: [
            "Yuppp, my Akki. ♡"
        ],
        idle: [
            "Hmm... what are you doing there, Akki?",
            "Akki is probably breaking something again.",
            "Akki is very bad.",
            "Yuppp, my Akki. ♡",
            "Click something already.",
            "You're still here? I like that.",
            "Hmm... you're exploring again?",
            "Don't tell Akki I said this... but this place is kinda cool.",
            "Akki made this... so something is probably about to break.",
            "Welcome back, Akki. ♡",
            "Are you actually working or just playing?",
            "Hehe... I know you're curious."
        ],
        proximity: [
            "Why are you staring at me?",
            "You're over here again?",
            "Hmm... what are you doing there, Akki?",
            "Found me, huh?"
        ],
        games: [
            "Ooooh! Let's play! ♡",
            "Game time!",
            "Come on Akki, don't lose.",
            "I know you're gonna try to beat that score.",
            "Okayyy, show me what you've got!"
        ],
        highScore: [
            "WHOA! New high score!",
            "You're actually insane, Akki! ♡",
            "Yuppp! That's my Akki!",
            "Okay... I'm impressed.",
            "That was clean!"
        ],
        ai: [
            "AI Zone?",
            "Need my help, Akki? ♡",
            "Are you talking to another AI?",
            "Hmm... who's smarter, me or the AI?",
            "Don't replace me, okay?"
        ],
        lab: [
            "Whoa... this looks cool!",
            "Don't break the lab, Akki.",
            "Okay, now you're experimenting.",
            "I wanna see what happens!",
            "That particle thing is kinda pretty."
        ],
        projects: [
            "Working on your ideas again?",
            "Look at Akki being productive.",
            "More projects?",
            "You're actually building a lot.",
            "Okay Akki, I see you."
        ],
        about: [
            "Trying to know Akki better?",
            "Hmm... should I reveal his secrets?",
            "I know more than this profile does.",
            "Akki is not telling you everything.",
            "Hehe... maybe there's more."
        ],
        secret: [
            "Hehe... you found this?",
            "Naughty, Akki...",
            "Wait... YOU actually found it?!",
            "Okay, I wasn't supposed to tell you this.",
            "You weren't supposed to be here."
        ],
        secretUnlocked: [
            "Okay... you're officially one of us now.",
            "Hehe... welcome to the secret side."
        ],
        instagram: [
            "Going to see Akki's Instagram?"
        ],
        spotify: [
            "Music time? ♫"
        ],
        roblox: [
            "Game time again?"
        ],
        discord: [
            "Going to bother Akki on Discord?"
        ],
        sleep: [
            "...zzz...",
            "I'll just rest here...",
            "Wake me when you're done..."
        ],
        wake: [
            "Huh?! You're back?!",
            "Oh... you're still here.",
            "Did you miss me?",
            "Okay, I'm awake."
        ],
        react: [
            "Hehe, poke me again and see what happens!",
            "I'm keeping an eye on you, Akki.",
            "Bored already? Explore the Hub!",
            "Sparkles and circuits, that's my style! ✨",
            "You really like clicking on me, don't you? ♡"
        ]
    };

    function getRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    // Dynamic Best English Voice Resolution
    function getBestEnglishVoice() {
        if (!('speechSynthesis' in window)) return null;
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;

        const preferredKeywords = [
            'natural', 'female', 'zira', 'samantha', 'victoria',
            'karen', 'moira', 'tessa', 'serena', 'fiona', 'jenny', 'google uk english female'
        ];

        for (const kw of preferredKeywords) {
            const match = voices.find(v => 
                v.name.toLowerCase().includes(kw) && 
                v.lang.toLowerCase().startsWith('en')
            );
            if (match) return match;
        }

        const anyEnglish = voices.find(v => v.lang.toLowerCase().startsWith('en'));
        if (anyEnglish) return anyEnglish;

        return voices[0] || null;
    }

    // Ensure voices are loaded when ready
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            getBestEnglishVoice();
        };
    }

    // Core Speech & Visual Action Function
    function speak(text, mood = '♡ IDLE', state = 'happy', isImportant = false) {
        const now = Date.now();
        if (!isImportant && now - lastSpokenTime < 3200) {
            return; // Cooldown to prevent spamming
        }
        lastSpokenTime = now;

        // Wake up if sleeping and not a sleep event
        if (isSleeping && state !== 'sleep') {
            isSleeping = false;
            container.classList.remove('sleeping');
            if (sleepIndicator) sleepIndicator.classList.remove('active');
        }

        // Update Mood Badge
        if (moodBadge) moodBadge.textContent = mood;

        // Trigger Visual State Animation
        avatarWrapper.classList.remove('state-excited', 'state-happy', 'state-surprised', 'state-curious', 'state-teasing');
        if (state && state !== 'sleep') {
            avatarWrapper.classList.add(`state-${state}`);
            setTimeout(() => {
                avatarWrapper.classList.remove(`state-${state}`);
            }, 2400);
        }

        // Show Neon Speech Bubble
        bubbleText.textContent = text;
        bubble.classList.add('active');

        if (bubbleTimer) clearTimeout(bubbleTimer);
        const readingDuration = Math.max(4500, text.length * 85);
        bubbleTimer = setTimeout(() => {
            bubble.classList.remove('active');
        }, readingDuration);

        // Native Speech Synthesis
        if (voiceEnabled && hasUserInteracted && ('speechSynthesis' in window)) {
            try {
                window.speechSynthesis.cancel();

                // Clean emojis and decorative punctuation for natural speech flow
                const cleanVoiceText = text
                    .replace(/♡|♥|♫|★|~|\.\.\./g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                const utterance = new SpeechSynthesisUtterance(cleanVoiceText);
                const voice = getBestEnglishVoice();
                if (voice) utterance.voice = voice;

                utterance.pitch = 1.25; // Cute, youthful pitch
                utterance.rate = 1.04;  // Friendly cadence
                utterance.volume = 0.95;

                isSpeaking = true;
                utterance.onend = () => { isSpeaking = false; };
                utterance.onerror = () => { isSpeaking = false; };

                window.speechSynthesis.speak(utterance);
            } catch (err) {
                isSpeaking = false;
            }
        }
    }

    // First User Interaction Gate
    function onFirstUserInteraction() {
        if (!hasUserInteracted) {
            hasUserInteracted = true;
            window.removeEventListener('click', onFirstUserInteraction);
            window.removeEventListener('keydown', onFirstUserInteraction);
            window.removeEventListener('touchstart', onFirstUserInteraction);

            setTimeout(() => {
                if (!welcomeTriggered) {
                    welcomeTriggered = true;
                    speak(getRandom(dialogues.welcome), '♡ WELCOME', 'happy', true);
                }
            }, 350);
        }
        resetSleepTimer();
    }

    window.addEventListener('click', onFirstUserInteraction);
    window.addEventListener('keydown', onFirstUserInteraction);
    window.addEventListener('touchstart', onFirstUserInteraction);

    // Sleep Mode Logic (60-90s inactivity, set to 75s)
    let lastActivityReset = 0;
    function enterSleepMode() {
        if (isSleeping) return;
        isSleeping = true;
        container.classList.add('sleeping');
        if (sleepIndicator) sleepIndicator.classList.add('active');
        speak(getRandom(dialogues.sleep), '~ SLEEPING', 'sleep', true);
    }

    function resetSleepTimer() {
        if (isSleeping) {
            isSleeping = false;
            container.classList.remove('sleeping');
            if (sleepIndicator) sleepIndicator.classList.remove('active');
            speak(getRandom(dialogues.wake), '♡ AWAKE', 'happy', true);
        }

        const now = Date.now();
        if (now - lastActivityReset > 1500 || !sleepTimer) {
            lastActivityReset = now;
            if (sleepTimer) clearTimeout(sleepTimer);
            sleepTimer = setTimeout(enterSleepMode, 75000);
        }
    }

    ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(evt => {
        window.addEventListener(evt, resetSleepTimer, { passive: true });
    });
    resetSleepTimer();

    // Mouse Proximity & Gaze Reaction (Desktop only)
    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;

        const rect = avatarWrapper.getBoundingClientRect();
        const avatarCenterX = rect.left + rect.width / 2;
        const avatarCenterY = rect.top + rect.height / 2;

        const dx = e.clientX - avatarCenterX;
        const dy = e.clientY - avatarCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Proximity dialogue trigger
        if (dist < 130 && Date.now() - lastProximityTime > 18000 && !isSleeping) {
            lastProximityTime = Date.now();
            speak(getRandom(dialogues.proximity), '? PROXIMITY', 'curious');
        }

        // Subtle Cursor Follow Look/Tilt
        if (followEnabled && !isSleeping && avatarImg) {
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const clampedAngle = Math.max(-6, Math.min(6, (dx / window.innerWidth) * 12));
            const clampedOffset = Math.max(-4, Math.min(4, (dx / window.innerWidth) * 8));
            avatarImg.style.transform = `rotate(${clampedAngle}deg) translateX(${clampedOffset}px)`;
        }
    });

    // Idle Periodic Dialogue
    function scheduleIdleDialogue() {
        const nextTime = Math.floor(Math.random() * 20000) + 35000; // 35 to 55s
        idleTimer = setTimeout(() => {
            const hasActiveModal = document.querySelector('.modal-overlay.active');
            if (!isSleeping && !hasActiveModal && !isSpeaking && hasUserInteracted) {
                speak(getRandom(dialogues.idle), '♡ IDLE', 'happy');
            }
            scheduleIdleDialogue();
        }, nextTime);
    }
    scheduleIdleDialogue();

    // Control Dock Button Handlers
    if (btnTalk) {
        btnTalk.addEventListener('click', (e) => {
            e.stopPropagation();
            welcomeTriggered = true;
            sfx.playClick();
            speak(getRandom(dialogues.idle), '♡ TALK', 'happy', true);
        });
    }

    if (btnReact) {
        btnReact.addEventListener('click', (e) => {
            e.stopPropagation();
            welcomeTriggered = true;
            sfx.playClick();
            const reactions = ['happy', 'excited', 'curious', 'surprised', 'teasing'];
            const chosen = reactions[Math.floor(Math.random() * reactions.length)];
            speak(getRandom(dialogues.react), '★ REACT', chosen, true);
        });
    }

    if (btnSleep) {
        btnSleep.addEventListener('click', (e) => {
            e.stopPropagation();
            welcomeTriggered = true;
            sfx.playClick();
            if (isSleeping) {
                resetSleepTimer();
            } else {
                enterSleepMode();
            }
        });
    }

    if (btnFollow) {
        btnFollow.addEventListener('click', (e) => {
            e.stopPropagation();
            sfx.playClick();
            followEnabled = !followEnabled;
            localStorage.setItem('akki_chan_follow_enabled', String(followEnabled));
            btnFollow.textContent = followEnabled ? 'FOLLOW: ON' : 'FOLLOW: OFF';
            if (!followEnabled && avatarImg) {
                avatarImg.style.transform = 'none';
            }
            showToast(`👀 Companion Cursor Follow: ${followEnabled ? 'ON' : 'OFF'}`);
        });
    }

    if (btnVoice) {
        btnVoice.addEventListener('click', (e) => {
            e.stopPropagation();
            sfx.playClick();
            voiceEnabled = !voiceEnabled;
            localStorage.setItem('akki_chan_voice_enabled', String(voiceEnabled));
            btnVoice.textContent = voiceEnabled ? 'VOICE: ON' : 'VOICE: OFF';
            btnVoice.className = `akki-ctrl-btn akki-voice-btn ${voiceEnabled ? 'active' : 'muted'}`;

            if (!voiceEnabled && ('speechSynthesis' in window)) {
                window.speechSynthesis.cancel();
            }
            showToast(`🎙️ Akki-Chan Voice: ${voiceEnabled ? 'ENABLED' : 'MUTED'}`);
        });
    }

    if (btnTest) {
        btnTest.addEventListener('click', (e) => {
            e.stopPropagation();
            welcomeTriggered = true;
            sfx.playClick();
            speak(getRandom(dialogues.test), '♡ VOICE TEST', 'happy', true);
        });
    }

    // Direct Avatar Click
    avatarWrapper.addEventListener('click', () => {
        welcomeTriggered = true;
        sfx.playClick();
        if (isSleeping) {
            resetSleepTimer();
        } else {
            speak(getRandom(dialogues.test), '♡ MY AKKI', 'happy', true);
        }
    });

    // Public API Hook Endpoints
    return {
        speak,
        onModuleOpen: (category) => {
            const list = dialogues[category];
            if (list) {
                const moods = {
                    games: '★ EXCITED',
                    ai: '? CURIOUS',
                    lab: '★ SCIENCE',
                    projects: '⚡ BUILDING',
                    about: '✦ LORE',
                    secret: '! SURPRISED'
                };
                const states = {
                    games: 'excited',
                    ai: 'curious',
                    lab: 'curious',
                    projects: 'happy',
                    about: 'teasing',
                    secret: 'surprised'
                };
                setTimeout(() => {
                    speak(getRandom(list), moods[category] || '♡ READY', states[category] || 'happy', true);
                }, 400);
            }
        },
        onNewHighScore: (newScore) => {
            setTimeout(() => {
                speak(getRandom(dialogues.highScore), '★ NEW RECORD!', 'excited', true);
            }, 250);
        },
        onSecretUnlocked: () => {
            setTimeout(() => {
                speak(getRandom(dialogues.secretUnlocked), '! ACCESS GRANTED', 'excited', true);
            }, 350);
        },
        onSocialClick: (platform) => {
            const list = dialogues[platform];
            if (list) {
                speak(getRandom(list), '↗ PORTAL', 'curious', true);
            }
        }
    };
}

/* ========================================================
   HELPER: TOAST NOTIFICATION SYSTEM
   ======================================================== */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}
