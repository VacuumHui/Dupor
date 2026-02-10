export const ENEMIES_DB = {
  slime: {
    key: 'slime', name: 'Slime', cost: 1, hp: 40, tier: 'normal',
    moves: [
      { chance: 0.7, name: 'Slam', actions: [{ type: 'damage', value: 6 }] },
      { chance: 0.3, name: 'Harden', actions: [{ type: 'block', value: 7 }] },
    ],
  },
  knight: {
    key: 'knight', name: 'Dark Knight', cost: 3, hp: 80, tier: 'normal',
    moves: [
      { chance: 0.6, name: 'Cleave', actions: [{ type: 'damage', value: 11 }] },
      { chance: 0.4, name: 'Guard', actions: [{ type: 'block', value: 12 }, { type: 'apply_status', status: 'vulnerable', value: 1 }] },
    ],
  },
  boss_dragon: {
    key: 'boss_dragon', name: 'Ash Dragon', cost: 10, hp: 250, tier: 'boss',
    moves: [
      { chance: 0.6, name: 'Inferno', actions: [{ type: 'damage', value: 18 }, { type: 'apply_status', status: 'burn', value: 1 }] },
      { chance: 0.4, name: 'Scale Wall', actions: [{ type: 'block', value: 20 }, { type: 'apply_status', status: 'thorns', value: 2 }] },
    ],
  },
};
