import { CARDS_DB } from '../data/cards.js';
import { createCardInstance } from '../state/GameState.js';

export const RewardManager = {
  rollCardChoices() {
    const pool = Object.values(CARDS_DB);
    const choices = [];
    for (let i = 0; i < 3; i += 1) {
      const rarityRoll = Math.random();
      const rarity = rarityRoll < 0.7 ? 'common' : rarityRoll < 0.95 ? 'rare' : 'legendary';
      const candidates = pool.filter((c) => c.rarity === rarity);
      const chosen = Phaser.Utils.Array.GetRandom(candidates);
      choices.push(createCardInstance(chosen.id));
    }
    return choices;
  },
};
