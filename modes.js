const ModeSystem = {
    currentMode: 'ENDLESS', // 'ENDLESS' or 'CHALLENGE'
    activeChallenge: null,  // 現在挑戦中のチャレンジデータ
    survivalTime: 0,        // 現在の生存時間（ミリ秒）

    setMode(mode) {
        this.currentMode = mode;
    },

    getMode() {
        return this.currentMode;
    },

    selectChallenge(challengeId) {
        const ach = window.ChallengeSystem.LIST.find(c => c.id === challengeId);
        if (ach) {
            this.activeChallenge = ach;
            this.currentMode = 'CHALLENGE';
        }
    },

    // ゲーム開始時にタイマーを初期化
    initTimer() {
        this.survivalTime = 0;
    },

    // 毎フレームの生存時間を更新し、クリア判定を返す
    updateTimer(dt) {
        if (this.currentMode !== 'CHALLENGE' || !this.activeChallenge) return false;

        this.survivalTime += dt;
        const currentSeconds = this.survivalTime / 1000;

        // 目標時間に到達したらクリア
        if (currentSeconds >= this.activeChallenge.targetTime) {
            return true; 
        }
        return false;
    },

    // 画面に表示するための残り時間を計算する関数
    getRemainingTime() {
        if (!this.activeChallenge) return 0;
        const rem = this.activeChallenge.targetTime - (this.survivalTime / 1000);
        return Math.max(0, rem).toFixed(1);
    }
};

window.ModeSystem = ModeSystem;
