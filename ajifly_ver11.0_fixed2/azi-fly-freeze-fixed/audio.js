const AudioSystem = {
    bgm: {
        menu: null,
        endless_lv1: null,
        endless_lv2: null,
        endless_lv3: null,
        challenge_30: null,
        challenge_60: null
    },
    se: {
        jump: null,
        jetpack: null,
        gameover: null,
        button: null
    },
    currentBgm: null,
    masterVolume: 0.5,
    isMuted: false,

    init() {
        this.bgm.menu = new Audio('昼下がり気分.mp3');
        this.bgm.endless_lv1 = new Audio('8-bit_Aggressive1.mp3');
        this.bgm.endless_lv2 = new Audio('弔い合戦.mp3');
        this.bgm.endless_lv3 = new Audio('情動カタルシス.mp3');
        this.bgm.challenge_30 = new Audio('090_long_BPM100.mp3');
        this.bgm.challenge_60 = new Audio('Will_you_still_cry_.mp3');

        this.se.jump = new Audio('ニュッ2.mp3');
        this.se.jetpack = new Audio('火炎魔法2.mp3');
        this.se.gameover = new Audio('「ぐああっ！」.mp3');
        this.se.button = new Audio('カーソル移動1.mp3');

        Object.values(this.bgm).forEach(bgm => {
            bgm.loop = true;
            bgm.volume = this.masterVolume;
        });

        Object.values(this.se).forEach(se => {
            se.loop = false;
            se.volume = this.masterVolume * 0.7;
        });

        const savedVolume = localStorage.getItem('ajifry_masterVolume');
        const savedMuted = localStorage.getItem('ajifry_isMuted');
        if (savedVolume) this.setVolume(parseFloat(savedVolume));
        if (savedMuted) this.isMuted = JSON.parse(savedMuted);
    },

    playBgm(bgmKey) {
        if (this.currentBgm === bgmKey) return;

        if (this.currentBgm && this.bgm[this.currentBgm]) {
            this.bgm[this.currentBgm].pause();
            this.bgm[this.currentBgm].currentTime = 0;
        }

        this.currentBgm = bgmKey;
        if (this.bgm[bgmKey]) {
            this.bgm[bgmKey].currentTime = 0;
            if (!this.isMuted) {
                this.bgm[bgmKey].play().catch(() => {});
            }
        }
    },

    playSe(seKey) {
        if (this.isMuted || !this.se[seKey]) return;
        try {
            const snd = this.se[seKey].cloneNode();
            snd.volume = this.se[seKey].volume;
            snd.play().catch(() => {});
        } catch (e) {}
    },

    playMenuBgm() {
        this.playBgm('menu');
    },

    playEndlessBgm(level) {
        if (level === 1) this.playBgm('endless_lv1');
        else if (level === 2) this.playBgm('endless_lv2');
        else if (level === 3) this.playBgm('endless_lv3');
    },

    playChallengeBgm(challengeId) {
        if (challengeId === 'ch_30') this.playBgm('challenge_30');
        else if (challengeId === 'ch_60') this.playBgm('challenge_60');
    },

    stopBgm() {
        if (this.currentBgm && this.bgm[this.currentBgm]) {
            this.bgm[this.currentBgm].pause();
            this.bgm[this.currentBgm].currentTime = 0;
        }
        this.currentBgm = null;
    },

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        Object.values(this.bgm).forEach(bgm => {
            bgm.volume = this.masterVolume;
        });
        Object.values(this.se).forEach(se => {
            se.volume = this.masterVolume * 0.7;
        });
        localStorage.setItem('ajifry_masterVolume', this.masterVolume);
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('ajifry_isMuted', this.isMuted);

        if (this.isMuted) {
            if (this.currentBgm && this.bgm[this.currentBgm]) {
                this.bgm[this.currentBgm].pause();
            }
        } else {
            if (this.currentBgm && this.bgm[this.currentBgm]) {
                this.bgm[this.currentBgm].play().catch(() => {});
            }
        }
    },

    isMutedState() {
        return this.isMuted;
    }
};

window.AudioSystem = AudioSystem;


// ver10 optimization patch
window.addEventListener('load',()=>{
 try{
   document.querySelectorAll('audio').forEach(a=>a.preload='auto');
 }catch(e){}
});
