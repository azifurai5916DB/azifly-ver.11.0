// state.js - ゲームオーバー・クリア処理
const StateManager = {
    gameOver() {
        window.gameState = 'GAMEOVER';
        if (window.AudioSystem) {
            AudioSystem.playSe('gameover');
        }
        if (window.sounds && window.sounds.g && window.sounds.g.readyState >= 2) {
            window.sounds.g.currentTime = 0;
            window.sounds.g.play().catch(()=>{});
        }
        
        const getCoins = Math.floor(window.score / 10);
        SaveSystem.data.coins += getCoins;
        SaveSystem.data.totalCoins += getCoins;
        
        const gainedXP = Math.floor(100 + window.score * 0.2);
        LevelSystem.addXP(gainedXP);
        
        if (window.score > SaveSystem.data.bestScore) {
            SaveSystem.data.bestScore = window.score;
        }
        
        if (window.currentLevel === 3 && window.score >= 5000) SaveSystem.data.worldClassDone = true;
        SaveSystem.save();
        if (window.AchievementSystem) AchievementSystem.check();
        
        document.getElementById('finalScore').textContent = window.score; 
        document.getElementById('finalBest').textContent = SaveSystem.data.bestScore; 
        document.getElementById('getGold').textContent = getCoins;
        
        document.getElementById('gameOverScreen').classList.remove('hidden'); 
        document.getElementById('jetpackGaugeContainer').classList.add('hidden'); 
    },

    missionClear() {
        window.gameState = 'GAMEOVER';
        
        const getCoins = Math.floor(window.score / 10);
        SaveSystem.data.coins += getCoins;
        SaveSystem.data.totalCoins += getCoins;
        
        const gainedXP = Math.floor(100 + window.score * 0.2);
        LevelSystem.addXP(gainedXP);
        
        if (!SaveSystem.data.challenges.includes(window.activeChallenge.id)) {
            SaveSystem.data.challenges.push(window.activeChallenge.id);
        }
        
        if (window.currentLevel === 3 && window.score >= 5000) SaveSystem.data.worldClassDone = true;
        SaveSystem.save();
        if (window.AchievementSystem) AchievementSystem.check();
        
        document.getElementById('clearMissionName').textContent = window.activeChallenge.name + " クリア！";
        document.getElementById('clearGetGold').textContent = getCoins;
        
        document.getElementById('missionClearScreen').classList.remove('hidden');
        document.getElementById('jetpackGaugeContainer').classList.add('hidden');
    }
};
