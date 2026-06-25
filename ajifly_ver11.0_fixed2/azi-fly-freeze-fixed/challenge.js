const ChallengeSystem = {
    list: [
        { id: 'ch_30', name: '30秒生き残れ！', desc: '条件：30秒間生存する', limit: 30000, lvl: 1 },
        { id: 'ch_60', name: '60秒生き残れ！', desc: '条件：60秒間生存する', limit: 60000, lvl: 2 }
    ],
    render() {
        const el = document.getElementById('challengeList');
        el.innerHTML = '';
        
        this.list.forEach(ch => {
            const cleared = SaveSystem.data.challenges.includes(ch.id);
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <div class="list-info">
                    <div class="list-title">${cleared ? '✅ ' : ''}${ch.name}</div>
                    <div class="list-desc">${ch.desc} (難易度:☆${ch.lvl})</div>
                </div>
                <button class="btn list-btn ${cleared ? 'btn-blue' : ''}" id="cbtn_${ch.id}">
                    ${cleared ? 'クリア済' : '挑戦する'}
                </button>
            `;
            el.appendChild(item);
            document.getElementById(`cbtn_${ch.id}`).onclick = () => this.start(ch.id);
        });
    },
    start(id) {
        const ch = this.list.find(x => x.id === id);
        document.getElementById('challengeScreen').classList.add('hidden');
        if (window.startChallengeGame) {
            window.startChallengeGame(ch);
        }
    }
};
