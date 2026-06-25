const RenderSystem = {
    draw(ctx, canvas, images, loaded) {
        const s = window.GameState;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. 背景の描画
        if (loaded.b && s.level === 1 && s.score < 10000) {
            ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = s.bgCol;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 2. 地面の描画
        ctx.strokeStyle = '#333333'; ctx.lineWidth = 3; ctx.beginPath();
        const groundY = canvas.height * 0.8;
        ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY); ctx.stroke();

        // 3. ジェットパックエフェクト
        let isHold = window.InputSystem ? window.InputSystem.isHold : false;
        if (s.isJet && isHold) {
            ctx.font = `${s.player.width * 0.6}px sans-serif`; ctx.textBaseline = 'top';
            ctx.fillText('🔥', s.player.x - s.player.width * 0.4, s.player.y + s.player.height * 0.4);
        }

        // 4. プレイヤー描画（選択中のスキンは shop.js 側と連動）
        if (loaded.p) {
            ctx.drawImage(images.player, s.player.x, s.player.y, s.player.width, s.player.height);
        } else {
            ctx.font = s.player.width + 'px sans-serif'; ctx.textBaseline = 'top';
            ctx.fillText('🍤', s.player.x, s.player.y);
        }

        // 5. 障害物の描画
        for (let o of s.obstacles) {
            if (loaded.o && o.type === '✋') ctx.drawImage(images.obstacle, o.x, o.y, o.width, o.height);
            else { ctx.font = o.width + 'px sans-serif'; ctx.textBaseline = 'top'; ctx.fillText(o.type, o.x, o.y); }
        }

        // 6. スコア表示（プレイ中のみ）
        if (s.state === 'PLAYING') {
            ctx.fillStyle = '#535353'; ctx.font = "bold 20px monospace"; ctx.textAlign = 'right';
            if (s.mode === 'ENDLESS') {
                ctx.fillText(`${['☆1','☆☆2','☆☆☆3'][s.level-1]} BEST ${String(s.bestScore).padStart(5,'0')} SCORE ${String(s.score).padStart(5,'0')}`, canvas.width - 30, 40);
            } else {
                ctx.fillText(`CHALLENGE MISSION`, canvas.width - 30, 40);
            }
        }

        // 7. 【最重要】右下のクリエイター名とバージョン情報の固定描画
        ctx.fillStyle = '#888888';
        ctx.font = "14px Arial, sans-serif";
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('ver.10.0 | Created by あじふらい', canvas.width - 20, canvas.height - 20);
    }
};

window.RenderSystem = RenderSystem;
