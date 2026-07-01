document.addEventListener('DOMContentLoaded', () => {
    const screens = ['titleScreen', 'endlessScreen', 'challengeScreen', 'shopScreen', 'achieveScreen', 'statusScreen', 'historyScreen', 'ruleScreen', 'gameOverScreen', 'missionClearScreen'];
    
    function show(id) {
        screens.forEach(s => document.getElementById(s)?.classList.add('hidden'));
        document.getElementById(id)?.classList.remove('hidden');
        if (id === 'titleScreen') {
            document.getElementById('titleCoin').textContent = SaveSystem.data.coins;
            if (window.AudioSystem) AudioSystem.playMenuBgm();
        }
        if (id === 'statusScreen') {
            const nextXP = LevelSystem.getRequiredXP(SaveSystem.data.level);
            document.getElementById('statusLevel').textContent = SaveSystem.data.level;
            document.getElementById('statusXP').textContent = SaveSystem.data.xp;
            document.getElementById('statusNextXP').textContent = nextXP;
            document.getElementById('statusLevelCap').textContent = SaveSystem.data.levelCap;
            document.getElementById('statusCoins').textContent = SaveSystem.data.coins;
            document.getElementById('statusBestScore').textContent = SaveSystem.data.bestScore;
            document.getElementById('statusSkins').textContent = SaveSystem.data.skins.length;
            document.getElementById('statusAchievements').textContent = SaveSystem.data.achieves.length;
            document.getElementById('capPrice').textContent = LevelSystem.getLevelCapPrice();
        }
        if (window.AudioSystem && !id.includes('Screen')) {
            AudioSystem.playSe('button');
        }
    }

    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn, .btn-sub, .list-btn, .lvl-btn') && window.AudioSystem) {
            AudioSystem.playSe('button');
        }
    });

    document.getElementById('toModeEndlessBtn').onclick = () => show('endlessScreen');
    document.getElementById('toModeChallengeBtn').onclick = () => { ChallengeSystem.render(); show('challengeScreen'); };
    document.getElementById('shopOpenBtn').onclick = () => { ShopSystem.render(); show('shopScreen'); };
    document.getElementById('achieveOpenBtn').onclick = () => { AchievementSystem.render(); show('achieveScreen'); };
    document.getElementById('statusOpenBtn').onclick = () => show('statusScreen');
    document.getElementById('ruleOpenBtn').onclick = () => { show('ruleScreen'); window.isRule = true; };
    document.getElementById('ruleCloseBtn').onclick = () => { show('titleScreen'); window.isRule = false; };
    
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) {
        muteBtn.onclick = () => {
            if (window.AudioSystem) {
                AudioSystem.toggleMute();
                muteBtn.textContent = AudioSystem.isMutedState() ? '🔇' : '🔊';
            }
        };
    }
    
    document.getElementById('historyOpenBtn').onclick = () => {
        const list = document.getElementById('historyList');
        list.innerHTML = '';
        GameVersion.history.forEach(h => {
            const div = document.createElement('div');
            div.className = 'hist-item';
            div.innerHTML = `<div class="hist-ver">${h.ver}</div><div class="hist-body">${h.body}</div>`;
            list.appendChild(div);
        });
        show('historyScreen');
    };
    document.getElementById('historyCloseBtn').onclick = () => show('titleScreen');

    document.getElementById('unlockCapBtn').onclick = () => {
        if (LevelSystem.unlockLevelCap()) {
            document.getElementById('capPrice').textContent = LevelSystem.getLevelCapPrice();
            document.getElementById('statusCoins').textContent = SaveSystem.data.coins;
            document.getElementById('statusLevelCap').textContent = SaveSystem.data.levelCap;
        }
    };

    document.querySelectorAll('.backToTitleBtn').forEach(b => {
        b.onclick = () => { show('titleScreen'); window.gameState = 'TITLE'; if (window.drawB) window.drawB(); };
    });

    window.uiShow = show;
});
