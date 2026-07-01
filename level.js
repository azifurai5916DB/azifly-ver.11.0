// level.js - レベルシステム
const LevelSystem = {
    getRequiredXP(level) {
        return Math.floor(100 * Math.pow(1.2, level - 1));
    },
    
    addXP(amount) {
        if (typeof SaveSystem.data.xp === 'undefined') SaveSystem.data.xp = 0;
        SaveSystem.data.xp += amount;
        
        while (SaveSystem.data.xp >= this.getRequiredXP(SaveSystem.data.level) && SaveSystem.data.level < SaveSystem.data.levelCap) {
            SaveSystem.data.xp -= this.getRequiredXP(SaveSystem.data.level);
            SaveSystem.data.level++;
        }
        
        SaveSystem.save();
    },
    
    unlockLevelCap() {
        const price = this.getLevelCapPrice();
        
        if (SaveSystem.data.coins < price) {
            return false;
        }
        
        SaveSystem.data.coins -= price;
        SaveSystem.data.levelCap += 20;
        SaveSystem.data.levelCapUnlockCount++;
        SaveSystem.save();
        
        return true;
    },
    
    getLevelCapPrice() {
        return 5000 * (SaveSystem.data.levelCapUnlockCount + 1);
    },
    
    isLevelCapReached() {
        return SaveSystem.data.level >= SaveSystem.data.levelCap;
    }
};
