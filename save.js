const SaveSystem = {
    data: {
        bestScore: 0, coins: 0, totalCoins: 0, rubies: 0,
        eqSkin: 'default', skins: ['default'],
        achieves: [], challenges: [], worldClassDone:false
    },
    load() {
        this.data.bestScore = parseInt(localStorage.getItem('ajifry_bestScore')) || 0;
        this.data.coins = parseInt(localStorage.getItem('ajifry_coins')) || 0;
        this.data.totalCoins = parseInt(localStorage.getItem('ajifry_totalCoins')) || 0;
        this.data.rubies = parseInt(localStorage.getItem('ajifry_rubies')) || 0;
        this.data.eqSkin = localStorage.getItem('ajifry_eqSkin') || 'default';
        try {
            this.data.skins = JSON.parse(localStorage.getItem('ajifry_skins')) || ['default'];
            this.data.achieves = JSON.parse(localStorage.getItem('ajifry_achieves')) || [];
            this.data.challenges = JSON.parse(localStorage.getItem('ajifry_challenges')) || [];
            this.data.worldClassDone = localStorage.getItem('ajifry_worldClassDone') === '1';
        } catch(e) {
            this.reset();
        }
    },
    save() {
        localStorage.setItem('ajifry_bestScore', this.data.bestScore);
        localStorage.setItem('ajifry_coins', this.data.coins);
        localStorage.setItem('ajifry_totalCoins', this.data.totalCoins);
        localStorage.setItem('ajifry_rubies', this.data.rubies);
        localStorage.setItem('ajifry_eqSkin', this.data.eqSkin);
        localStorage.setItem('ajifry_skins', JSON.stringify(this.data.skins));
        localStorage.setItem('ajifry_achieves', JSON.stringify(this.data.achieves));
        localStorage.setItem('ajifry_challenges', JSON.stringify(this.data.challenges));
        localStorage.setItem('ajifry_worldClassDone', this.data.worldClassDone ? '1':'0');
    },
    reset() {
        this.data = { bestScore:0, coins:0, totalCoins:0, rubies:0, eqSkin:'default', skins:['default'], achieves:[], challenges:[] };
        this.save();
    }
};
SaveSystem.load();


// ver10 optimization patch
window.__saveDirty=false;
window.markGameDirty=function(){window.__saveDirty=true;}
setInterval(()=>{try{
 if(window.__saveDirty && window.SaveSystem?.save){
   window.SaveSystem.save();
   window.__saveDirty=false;
 }
}catch(e){}},10000);
