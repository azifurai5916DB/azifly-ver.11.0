document.addEventListener('DOMContentLoaded', () => {
    window.isHold = false;
    let lastTouchTime = 0;

    function triggerJump() {
        if (window.gameState !== 'PLAYING' || window.isRule) return;
        if (window.jetEnergy >= 100 || window.isJet) return;

        const p = window.player;
        const maxJumps =
            (window.currentLevel >= 2 ||
             (window.activeChallenge && window.activeChallenge.id === 'ch_60'))
            ? 2 : 1;

        if (p.jCnt < maxJumps) {
            p.vy = -18;
            p.isG = false;
            p.jCnt = Math.min(p.jCnt + 1, maxJumps);
            if (window.AudioSystem) AudioSystem.playSe('jump');
        }
    }

    window.addEventListener('keydown', e => {
        if (['Space', 'ArrowUp'].includes(e.code)) {
            e.preventDefault();
            if (!window.isHold) {
                triggerJump();
                window.isHold = true;
            }
        }
    });

    window.addEventListener('keyup', e => {
        if (['Space', 'ArrowUp'].includes(e.code)) window.isHold = false;
    });

    function isUiElement(target){
        return target.closest('button, .btn, .btn-sub, .list-btn, .lvl-btn, a, input, select');
    }

    window.addEventListener('touchstart', e => {
        lastTouchTime = Date.now();

        if (isUiElement(e.target)) return; // UIはそのまま動かす

        if (!window.isHold) {
            triggerJump();
            window.isHold = true;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        window.isHold = false;
    }, { passive: true });

    window.addEventListener('mousedown', e => {
        if (Date.now() - lastTouchTime < 500) return;
        if (isUiElement(e.target)) return;

        if (!window.isHold) {
            triggerJump();
            window.isHold = true;
        }
    });

    window.addEventListener('mouseup', () => {
        window.isHold = false;
    });
});