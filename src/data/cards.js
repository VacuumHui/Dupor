export const CARDS_DB = {
  strike: { id: 'strike', name: 'Strike', cost: 1, rarity: 'common', target: 'enemy', color: 0xc0392b, desc: 'Deal 4 damage.', fullDesc: 'Basic attack.', actions: [{ type: 'damage', value: 4 }] },
  defend: { id: 'defend', name: 'Defend', cost: 1, rarity: 'common', target: 'self', color: 0x2980b9, desc: 'Gain 5 block.', fullDesc: 'Basic defense.', actions: [{ type: 'block', value: 5 }] },
  heavy_strike: { id: 'heavy_strike', name: 'Heavy Strike', cost: 2, rarity: 'common', target: 'enemy', color: 0xe67e22, desc: 'Deal 10 damage.', fullDesc: 'Slow and brutal.', actions: [{ type: 'damage', value: 10 }] },
  dirty_trick: { id: 'dirty_trick', name: 'Dirty Trick', cost: 2, rarity: 'common', target: 'enemy', color: 0x8e44ad, desc: 'Deal 2 + Weak 2.', fullDesc: 'Dishonorable but effective.', actions: [{ type: 'damage', value: 2 }, { type: 'apply_status', status: 'weak', value: 2 }] },
  iron_barrier: { id: 'iron_barrier', name: 'Iron Barrier', cost: 4, rarity: 'common', target: 'self', color: 0x34495e, desc: 'Gain 15 block.', fullDesc: 'Fortify your stance.', actions: [{ type: 'block', value: 15 }] },

  heal_potion: { id: 'heal_potion', name: 'Heal Potion', cost: 1, rarity: 'rare', target: 'any', color: 0x2ecc71, desc: 'Heal 6.', fullDesc: 'Drink to recover.', actions: [{ type: 'heal', value: 6 }] },
  blood_ritual: { id: 'blood_ritual', name: 'Blood Ritual', cost: 0, rarity: 'rare', target: 'self', color: 0x9b59b6, desc: 'Take 5. Restore 2 mana.', fullDesc: 'Pain for power.', actions: [{ type: 'damage', value: 5, forceSelf: true }, { type: 'restore_mana', value: 2 }] },
  spiked_armor: { id: 'spiked_armor', name: 'Spiked Armor', cost: 2, rarity: 'rare', target: 'self', color: 0x16a085, desc: 'Gain 5 block + Thorns 3.', fullDesc: 'Punish attackers.', actions: [{ type: 'block', value: 5 }, { type: 'apply_status', status: 'thorns', value: 3 }] },

  mana_crystal: { id: 'mana_crystal', name: 'Mana Crystal', cost: 3, rarity: 'legendary', target: 'self', color: 0x3498db, desc: 'Max mana +1. Consume.', fullDesc: 'Permanently expands mana.', actions: [{ type: 'increase_max_mana', value: 1 }], consume: true },
  vampirism: { id: 'vampirism', name: 'Vampirism', cost: 2, rarity: 'legendary', target: 'enemy', color: 0xe74c3c, desc: 'Deal 4 and heal 4.', fullDesc: 'Drain life essence.', actions: [{ type: 'damage', value: 4 }, { type: 'heal', value: 4, forceSelf: true }] },
  adrenaline: { id: 'adrenaline', name: 'Adrenaline', cost: 0, rarity: 'legendary', target: 'self', color: 0xf1c40f, desc: 'Draw 2 and take 5.', fullDesc: 'Burst of speed.', actions: [{ type: 'draw', value: 2 }, { type: 'damage', value: 5, forceSelf: true }] },
};

export const RARITY_COLORS = {
  common: 0x95a5a6,
  rare: 0x3498db,
  legendary: 0xf1c40f,
};
