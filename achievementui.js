const AchievementUI = {
    init() {
        // ボタンイベントの紐付け
        const openBtn = document.getElementById('achOpenBtn');
        const closeBtn = document.getElementById('achCloseBtn');
        
        if (openBtn) openBtn.addEventListener('click', () => this.openScreen());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeScreen());
    },

    openScreen() {
        const achScreen = document.getElementById('achievementScreen');
        const titleScreen = document.getElementById('titleScreen');
        if (!achScreen || !titleScreen) return;

        achScreen.classList.remove('hidden');
        titleScreen.classList.add('hidden');
        this.renderList();
    },

    closeScreen() {
        const achScreen = document.getElementById('achievementScreen');
        const titleScreen = document.getElementById('titleScreen');
        if (achScreen) achScreen.classList.add('hidden');
        if (titleScreen) titleScreen.classList.remove('hidden');
    },

    // 実績一覧の描画（獲得済み・未獲得ルール適用）
    renderList() {
        const listContainer = document.getElementById('achievementList');
        if (!listContainer) return;
        listContainer.innerHTML = '';

        const unlocked = SaveSystem.getUnlockedAchievements();

        window.AchievementSystem.LIST.forEach(ach => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'ach-item';

            const isUnlocked = unlocked.includes(ach.id);

            if (isUnlocked) {
                itemDiv.classList.add('unlocked');
                itemDiv.innerHTML = `
                    <div class="ach-icon">🏆</div>
                    <div class="ach-info">
                        <div class="ach-name">${ach.name}</div>
                        <div class="ach-desc">${ach.desc}</div>
                    </div>
                `;
            } else {
                itemDiv.classList.add('locked');
                itemDiv.innerHTML = `
                    <div class="ach-icon">🔒</div>
                    <div class="ach-info">
                        <div class="ach-name">？？？</div>
                        <div class="ach-desc">（未解除の実績です）</div>
                    </div>
                `;
            }
            listContainer.appendChild(itemDiv);
        });
    },

    // 実績解除の通知演出（ポップアップ）
    showNotification(ach) {
        const pop = document.getElementById('achPopup');
        if (!pop) return;

        // すでに表示中の場合は一度リセットして上書き
        pop.classList.remove('show');
        
        // 中身の書き換え
        document.getElementById('achPopupName').textContent = ach.name;
        document.getElementById('achPopupDesc').textContent = ach.desc;

        // 数ミリ秒空けてクラスを追加してアニメーション表示
        setTimeout(() => {
            pop.classList.add('show');
        }, 50);

        // 4秒後に自動的に閉じる
        if (this.popupTimer) clearTimeout(this.popupTimer);
        this.popupTimer = setTimeout(() => {
            pop.classList.remove('show');
        }, 4000);
    }
};

window.AchievementUI = AchievementUI;
