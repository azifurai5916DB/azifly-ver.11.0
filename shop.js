const ShopSystem = {
    skins: [
        { id: 'default', name: 'いつものアジフライ', desc: '標準的なアジフライ。揚げたて。', cost: 0, file: 'ajifry.png' },
        { id: 'tartar', name: 'タルタル', desc: 'タルタルソースがかかったアジフライ。', cost: 500, file: 'tartar.png' },
        { id: 'bone', name: '骨', desc: '骨だけになったアジフライ。', cost: 500, file: 'bone.png' },
        { id: 'nori', name: '青のり', desc: '青のりがかかったアジフライ。', cost: 500, file: 'aonori.png' },
        { id: 'shrimp', name: 'エビフライ', desc: 'エビフライになる。', cost: 1000, file: 'shrimp.png' },
        { id: 'bitten', name: '食べかけ', desc: '食べかけ状態のアジフライ。', cost: 1000, file: 'bitten.png' },

        { id: 'himono', name: 'アジの開き', desc: '干物になったアジ。', cost: 1500, file: 'himono.png' },
        { id: 'gold', name: '金のアジフライ', desc: '黄金に輝くレアアジフライ。', cost: 5000, file: 'gold.png' },
        { id: 'king', name: 'キングアジフライ', desc: '王者のアジフライ。', cost: 10000, file: 'king.png' },
    ],
    images: {}, // 各スキンのImageオブジェクトを格納する
    init() {
        // すべてのスキン画像をあらかじめロードしておく
        this.skins.forEach(s => {
            const img = new Image();
            img.src = `assets/${s.file}`;
            this.images[s.id] = img;
        });
    },
    render() {
        const list = document.getElementById('shopList');
        list.innerHTML = '';
        document.getElementById('shopCoin').textContent = SaveSystem.data.coins + ' / 💎' + SaveSystem.data.rubies;
        
        this.skins.forEach(s => {
            const has = SaveSystem.data.skins.includes(s.id);
            const eq = SaveSystem.data.eqSkin === s.id;
            
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="list-info">
                    <div class="list-title">${s.name}</div>
                    <div class="list-desc">${s.desc}</div>
                    <div class="list-desc" style="color:#f57c00; font-weight:bold;">${has ? '' : s.cost + ' コイン'}</div>
                </div>
                <button class="btn list-btn ${eq ? 'btn-blue' : has ? '' : 'btn-orange'}" id="sbtn_${s.id}">
                    ${eq ? '装備中' : has ? '装備する' : '購入'}
                </button>
            `;
            list.appendChild(item);
            document.getElementById(`sbtn_${s.id}`).onclick = () => this.action(s.id);
        });
    },
    action(id) {
        const s = this.skins.find(x => x.id === id);
        const has = SaveSystem.data.skins.includes(id);
        if (has) {
            SaveSystem.data.eqSkin = id;
            SaveSystem.save();
            this.render();
            if (window.drawB) window.drawB(); 
        } else {
            const rubyCost=Math.ceil(s.cost/1000);
            if (SaveSystem.data.coins >= s.cost || SaveSystem.data.rubies >= rubyCost) {
                if (SaveSystem.data.coins >= s.cost) SaveSystem.data.coins -= s.cost;
                else SaveSystem.data.rubies -= rubyCost;
                SaveSystem.data.skins.push(id);
                SaveSystem.save();
                this.render();
                if (window.AchievementSystem) AchievementSystem.check();
            }
        }
    }
};
ShopSystem.init(); // 画像読み込み開始
