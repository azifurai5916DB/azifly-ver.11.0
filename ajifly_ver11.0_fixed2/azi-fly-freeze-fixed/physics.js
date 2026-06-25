const PhysicsSystem = {
    // ランダム範囲計算
    rnd(m, x) { return Math.random() * (x - m) + m; },

    // 四角形同士の当たり判定（マージン付き）
    hit(r1, r2) {
        let x1 = r1.width * 0.3, y1 = r1.height * 0.3;
        let x2 = r2.width * 0.3, y2 = r2.height * 0.3;
        return (r1.x + x1) < (r2.x + r2.width - x2) && 
               (r1.x + r1.width - x1) > (r2.x + x2) && 
               (r1.y + y1) < (r2.y + r2.height - y2) && 
               (r1.y + r1.height - y1) > (r2.y + y2);
    },

    // スコアやレベルに応じた背景色の決定
    getBackgroundColor(level, score) {
        if (level === 2 && score >= 10000) return '#d0e0fc';
        if (level === 3 && score >= 5000) return '#fcd0d0';
        return '#f7f7f7';
    },

    // レベルに応じた次の障害物出現までの時間を決定
    getNextObsTime(level) {
        if (level === 2) return this.rnd(600, 1300);
        if (level === 3) return this.rnd(400, 900);
        return this.rnd(1000, 2500);
    },

    // レベルやスコアに応じた障害物の文字（絵文字）を決定
    getObstacleType(level, score) {
        if (level === 1 && score >= 10000 && Math.random() < 0.5) return '🤲';
        if (level === 2 && score >= 10000 && Math.random() < 0.5) return '☝️';
        if (level === 3) return ['✋', '👆', '🤟'][Math.floor(Math.random() * 3)];
        return '✋';
    }
};

window.PhysicsSystem = PhysicsSystem;
