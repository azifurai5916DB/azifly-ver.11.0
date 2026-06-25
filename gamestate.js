const GameState = {
    state: 'TITLE',      // 'TITLE', 'PLAYING', 'GAMEOVER', 'CLEAR'
    mode: 'ENDLESS',     // 'ENDLESS', 'CHALLENGE'
    level: 1,
    score: 0,
    bestScore: 0,
    gameSpeed: 6,
    lastTime: 0,
    jetEnergy: 0,
    isJet: false,
    challengeTimer: 0,
    nextObs: 1500,
    bgCol: '#f7f7f7',
    
    player: {},
    obstacles: [],
    activeChallenge: null,
    timers: { score: 0, speed: 0, obs: 0 },

    init(lvl, mode, chData, canvasHeight, canvasWidth) {
        this.score = this.timers.score = this.timers.speed = this.timers.obs = this.jetEnergy = 0;
        this.level = lvl;
        this.mode = mode;
        this.activeChallenge = chData;
        this.obstacles = [];
        this.bgCol = '#f7f7f7';
        this.gameSpeed = lvl === 3 ? 9 : 6;
        this.isJet = false;

        if (mode === 'CHALLENGE' && chData) {
            this.challengeTimer = chData.duration * 1000;
        }

        let gY = canvasHeight * 0.8;
        let s = Math.min(canvasWidth, canvasHeight) * 0.12;
        this.player = { x: canvasWidth * 0.15, y: gY - s, width: s, height: s, vy: 0, isG: true, groundY: gY, jCnt: 0 };
        this.nextObs = window.PhysicsSystem ? window.PhysicsSystem.getNextObsTime(lvl) : 1500;
    }
};

window.GameState = GameState;
