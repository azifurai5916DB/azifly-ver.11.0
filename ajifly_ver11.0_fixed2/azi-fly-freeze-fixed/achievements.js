const AchievementSystem = {
    list: [
        { id: 'run_1000', name: '駆け出し飛行士', desc: '1000スコア達成' },
        { id: 'run_10000', name: '食べ残り', desc: '10000スコア達成' },
        { id: 'coin_10000', name: '高級フライ', desc: '累計10000コイン獲得' },
        { id: 'skin_shrimp', name: 'アジフライ…？', desc: 'エビフライスキンを入手' },
        { id: 'skin_count3', name: 'コレクター', desc: 'スキンを3つ入手' },
        { id:'king', name:'キング', desc:'キングアジフライを入手する' },
        { id:'idle_30000', name:'暇人', desc:'スコア30000を達成する' },
        { id:'michelin', name:'ミシュラン', desc:'累計30000コイン入手する' },
        { id:'challenger', name:'チャレンジャー', desc:'チャレンジモードを2つクリアする' },
        { id:'world_class', name:'ワールドクラス', desc:'☆☆☆3で5000スコアまで生き残る' }
    ],
    check() {
        if (SaveSystem.data.bestScore >= 1000 && !SaveSystem.data.achieves.includes('run_1000')) this.unlock('run_1000');
        if (SaveSystem.data.bestScore >= 10000 && !SaveSystem.data.achieves.includes('run_10000')) this.unlock('run_10000');
        if (SaveSystem.data.totalCoins >= 10000 && !SaveSystem.data.achieves.includes('coin_10000')) this.unlock('coin_10000');
        if (SaveSystem.data.skins.includes('shrimp') && !SaveSystem.data.achieves.includes('skin_shrimp')) this.unlock('skin_shrimp');
        if (SaveSystem.data.skins.length >= 3 && !SaveSystem.data.achieves.includes('skin_count3')) this.unlock('skin_count3');
        if (SaveSystem.data.skins.includes('king') && !SaveSystem.data.achieves.includes('king')) this.unlock('king');
        if (SaveSystem.data.bestScore >= 30000 && !SaveSystem.data.achieves.includes('idle_30000')) this.unlock('idle_30000');
        if (SaveSystem.data.totalCoins >= 30000 && !SaveSystem.data.achieves.includes('michelin')) this.unlock('michelin');
        if ((SaveSystem.data.challenges||[]).length >= 2 && !SaveSystem.data.achieves.includes('challenger')) this.unlock('challenger');
        if (SaveSystem.data.worldClassDone && !SaveSystem.data.achieves.includes('world_class')) this.unlock('world_class');
    },
    unlock(id) {
        if (SaveSystem.data.achieves.includes(id)) return;
        SaveSystem.data.achieves.push(id);
        SaveSystem.save();
        const ac = this.list.find(x => x.id === id);
        this.showToast(ac.name, ac.desc);
    },
    showToast(name, desc) {
        const container = document.getElementById('toastContainer');
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerHTML = `
            <div class="toast-h">🏆 実績解除！</div>
            <div class="toast-t">${name}</div>
            <div class="toast-d">${desc}</div>
        `;
        container.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    },
    render() {
        const el = document.getElementById('achieveList');
        el.innerHTML = '';
        this.list.forEach(ac => {
            const has = SaveSystem.data.achieves.includes(ac.id);
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="list-info">
                    <div class="list-title">${has ? '🏆 ' + ac.name : '🔒 ？？？'}</div>
                    <div class="list-desc">${has ? ac.desc : '未達成の実績です'}</div>
                </div>
            `;
            el.appendChild(item);
        });
    }
};

window.addEventListener('load',()=>{setTimeout(()=>{try{AchievementSystem.check();AchievementSystem.render();}catch(e){console.error(e)}},300);});
