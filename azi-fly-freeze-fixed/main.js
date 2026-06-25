const canvas = document.getElementById('gameCanvas'), ctx = canvas.getContext('2d');
const scr = { j: document.getElementById('jetpackGaugeContainer'), b: document.getElementById('jetpackGaugeBar'), p: document.getElementById('gaugePercent') };
const images = { obstacle: new Image(), background: new Image() };

images.obstacle.src = 'assets/hand.png'; images.background.src = 'assets/background.png';
window.sounds = { j: new Audio('sounds/jump.mp3'), g: new Audio('sounds/gameover.mp3') };

let loaded = {};
images.obstacle.onload = () => loaded.o = true; images.background.onload = () => loaded.b = true;

window.score = 0; window.gameState = 'TITLE'; window.player = {}; window.currentLevel = 1; window.isRule = false;
window.jetEnergy = 0; window.isJet = false; window.activeChallenge = null;

let obstacles = [], gameSpeed = 6, lastTime = 0, challengeTimer = 0, lastJetSound = 0;
let timers = { score: 0, speed: 0, obs: 0 }, nextObs = 1500, bgCol = '#f7f7f7';

function drawV() { 
    ctx.fillStyle = '#888888'; ctx.font = "14px monospace"; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; 
    ctx.fillText(GameVersion.current, canvas.width - 30, canvas.height - 30); 
    ctx.fillText(GameVersion.author, canvas.width - 30, canvas.height - 12); 
}

function drawB() { 
    ctx.fillStyle = '#f7f7f7'; ctx.fillRect(0, 0, canvas.width, canvas.height); 
    ctx.strokeStyle = '#333333'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, canvas.height * 0.8); ctx.lineTo(canvas.width, canvas.height * 0.8); ctx.stroke(); 
    drawV(); 
}

function resize() { 
    canvas.width = window.innerWidth; canvas.height = window.innerHeight; 
    if (window.gameState === 'PLAYING') { window.player.groundY = canvas.height * 0.8; window.player.x = canvas.width * 0.15; } else drawB(); 
}
window.addEventListener('resize', resize);

function init(lvl) {
    window.score = timers.score = timers.speed = timers.obs = window.jetEnergy = challengeTimer = 0; 
    window.currentLevel = lvl; obstacles = []; bgCol = '#f7f7f7'; gameSpeed = lvl === 3 ? 9 : 6; window.isJet = false;
    let gY = canvas.height * 0.8, s = Math.min(canvas.width, canvas.height) * 0.12;
    window.player = { x: canvas.width * 0.15, y: gY - s, width: s, height: s, vy: 0, isG: true, groundY: gY, jCnt: 0 };
    nextObs = lvl === 2 ? rnd(700, 1500) : lvl === 3 ? rnd(400, 1000) : rnd(1000, 2500); upG();
}

function start(lvl) {
    window.activeChallenge = null; init(lvl); window.gameState = 'PLAYING';
    document.getElementById('endlessScreen').classList.add('hidden');
    if (window.AudioSystem) AudioSystem.playEndlessBgm(lvl);
    scr.j.classList.remove('hidden'); lastTime = performance.now(); requestAnimationFrame(loop);
}

window.startChallengeGame = function(ch) {
    init(ch.lvl); window.activeChallenge = ch; window.gameState = 'PLAYING';
    if (window.AudioSystem) AudioSystem.playChallengeBgm(ch.id);
    scr.j.classList.remove('hidden'); lastTime = performance.now(); requestAnimationFrame(loop);
};

let lastGaugeValue = -1, lastGaugeCharged = null;
function upG() {
    let p = Math.floor(window.jetEnergy);
    const charged = p >= 100;
    if (p !== lastGaugeValue) {
        scr.p.textContent = p;
        scr.b.style.width = p + '%';
        lastGaugeValue = p;
    }
    if (charged !== lastGaugeCharged) {
        scr.j.classList.toggle('charged', charged);
        lastGaugeCharged = charged;
    }
}
const rnd = (m, x) => Math.random() * (x - m) + m;
function hit(r1, r2) { let x1 = r1.width * 0.3, y1 = r1.height * 0.3, x2 = r2.width * 0.3, y2 = r2.height * 0.3; return (r1.x + x1) < (r2.x + r2.width - x2) && (r1.x + r1.width - x1) > (r2.x + x2) && (r1.y + y1) < (r2.y + r2.height - y2) && (r1.y + r1.height - y1) > (r2.y + y2); }
function loop(t) { if (window.gameState !== 'PLAYING') return; let dt = t - lastTime; if (dt > 100) dt = 16.66; lastTime = t; update(dt); draw(); requestAnimationFrame(loop); }

function update(dt) {
    if ((timers.score += dt) >= 1000) { window.score += 100; timers.score -= 1000; }
    if (window.activeChallenge) { challengeTimer += dt; if (challengeTimer >= window.activeChallenge.limit) { StateManager.missionClear(); return; } }

    bgCol = (window.currentLevel === 2 && window.score >= 10000) ? '#d0e0fc' : (window.currentLevel === 3 && window.score >= 5000) ? '#fcd0d0' : '#f7f7f7';
    if (window.currentLevel === 3 && window.score >= 5000) gameSpeed = Math.max(gameSpeed, 12);
    else if ((timers.speed += dt) >= 10000) { if (gameSpeed < 18) gameSpeed += 0.5; timers.speed -= 10000; }

    if (window.jetEnergy >= 100 && window.isHold) window.isJet = true;
    if (window.isJet && window.isHold && window.jetEnergy > 0) {
        window.player.vy = -8;
        window.player.isG = false;
        window.jetEnergy = Math.max(0, window.jetEnergy - (dt / 1000) * 20);
        if (window.AudioSystem && (performance.now() - lastJetSound > 120)) {
            AudioSystem.playSe('jetpack');
            lastJetSound = performance.now();
        }
    }
    else { window.isJet = false; if (window.jetEnergy < 100) window.jetEnergy = Math.min(100, window.jetEnergy + (dt / 1000) * (100 / 30)); }
    upG();

    window.player.vy += 0.8; window.player.y += window.player.vy;
    if (window.player.y < 0) { window.player.y = 0; window.player.vy = 0; }
    if (window.player.y >= window.player.groundY - window.player.height) { window.player.y = window.player.groundY - window.player.height; window.player.vy = 0; window.player.isG = true; window.player.jCnt = 0; }

    if ((timers.obs += dt) >= nextObs) {
        let s = Math.min(canvas.width, canvas.height) * 0.09, t = '✋';
        if (window.currentLevel === 1 && window.score >= 10000 && Math.random() < 0.5) t = '🤲';
        else if (window.currentLevel === 2 && window.score >= 10000 && Math.random() < 0.5) t = '☝️';
        else if (window.currentLevel === 3) t = ['✋', '👆', '🤟'][Math.floor(Math.random() * 3)];
        if(Math.random()<0.05){obstacles.push({x:canvas.width,y:window.player.groundY-s,width:s,height:s,type:'💎',ruby:true});}
        else{obstacles.push({ x: canvas.width, y: window.player.groundY - s, width: s, height: s, type: t });}
        timers.obs = 0;
        nextObs = window.currentLevel === 2 ? rnd(600, 1300) : window.currentLevel === 3 ? rnd(400, 900) : rnd(1000, 2500);
    }
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        if (obstacles[i].x + obstacles[i].width < 0) { obstacles.splice(i, 1); continue; }
        if (hit(window.player, obstacles[i])) { if(obstacles[i].ruby){SaveSystem.data.rubies=(SaveSystem.data.rubies||0)+1;SaveSystem.save();obstacles.splice(i,1);continue;} StateManager.gameOver(); return; }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (loaded.b && window.currentLevel === 1 && window.score < 10000) ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
    else { ctx.fillStyle = bgCol; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.strokeStyle = '#333333'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, window.player.groundY); ctx.lineTo(canvas.width, window.player.groundY); ctx.stroke();

    if (window.isJet && window.isHold) { ctx.font = `${window.player.width * 0.6}px sans-serif`; ctx.textBaseline = 'top'; ctx.fillText('🔥', window.player.x - window.player.width * 0.4, window.player.y + window.player.height * 0.4); }
    
    const activeSkinId = SaveSystem.data.eqSkin;
    const skinImg = ShopSystem.images[activeSkinId];
    if (skinImg && skinImg.complete) {
        ctx.drawImage(skinImg, window.player.x, window.player.y, window.player.width, window.player.height);
    } else {
        ctx.font = window.player.width + 'px sans-serif'; ctx.textBaseline = 'top'; ctx.fillText('🍤', window.player.x, window.player.y);
    }

    for (let o of obstacles) {
        if (loaded.o && o.type === '✋') ctx.drawImage(images.obstacle, o.x, o.y, o.width, o.height);
        else { ctx.font = o.width + 'px sans-serif'; ctx.textBaseline = 'top'; ctx.fillText(o.type, o.x, o.y); }
    }
    
    ctx.fillStyle = '#535353'; ctx.font = "bold 20px monospace"; ctx.textAlign = 'right';
    if (window.activeChallenge) {
        let rem = Math.max(0, Math.ceil((window.activeChallenge.limit - challengeTimer) / 1000));
        ctx.fillText(`⏱️ CLEAR UNTIL: ${rem}s  SCORE ${String(window.score).padStart(5,'0')}`, canvas.width - 30, 40);
    } else {
        ctx.fillText(`${['☆1','☆☆2','☆☆☆3'][window.currentLevel-1]} BEST ${String(SaveSystem.data.bestScore).padStart(5,'0')} SCORE ${String(window.score).padStart(5,'0')}`, canvas.width - 30, 40);
    }
    drawV();
}

document.querySelectorAll('.lvl-btn').forEach(b => b.addEventListener('click', e => start(parseInt(e.target.getAttribute('data-lvl')))));
document.getElementById('playAgainButton').addEventListener('click', () => { document.getElementById('gameOverScreen').classList.add('hidden'); if(window.activeChallenge) window.startChallengeGame(window.activeChallenge); else start(window.currentLevel); });
document.getElementById('clearToTitleButton').addEventListener('click', () => { window.gameState = 'TITLE'; document.getElementById('missionClearScreen').classList.add('hidden'); document.getElementById('titleScreen').classList.remove('hidden'); ctx.clearRect(0, 0, canvas.width, canvas.height); drawB(); if(window.AudioSystem) AudioSystem.playMenuBgm(); if(window.uiShow) window.uiShow('titleScreen'); });
document.getElementById('toTitleButton').addEventListener('click', () => { window.gameState = 'TITLE'; document.getElementById('gameOverScreen').classList.add('hidden'); document.getElementById('titleScreen').classList.remove('hidden'); ctx.clearRect(0, 0, canvas.width, canvas.height); drawB(); if(window.AudioSystem) AudioSystem.playMenuBgm(); if(window.uiShow) window.uiShow('titleScreen'); });

window.onload = () => { resize(); drawB(); if(window.AudioSystem) { AudioSystem.init(); AudioSystem.playMenuBgm(); } }; window.drawB = drawB;


// ver10 optimization patch
(function(){
let resizeTimer;
window.addEventListener('resize',()=>{
 clearTimeout(resizeTimer);
 resizeTimer=setTimeout(()=>{
   if(typeof resize==='function') resize();
 },100);
});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){
   try{ if(window.AudioSystem?.stopBgm) AudioSystem.stopBgm(); }catch(e){}
 }
});
})();
