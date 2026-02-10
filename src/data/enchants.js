export const ENCHANTS_DB = {
  common: [
    { id: 'sharpen', kind: 'stat_modifier', target: 'damage', value: 2, desc: 'Damage +2' },
    { id: 'rivet', kind: 'add_action', action: { type: 'block', value: 2 }, desc: 'Add Block 2' },
  ],
  rare: [
    { id: 'lightweight', kind: 'stat_modifier', target: 'cost', value: -1, desc: 'Cost -1' },
    { id: 'fire_rune', kind: 'add_action', action: { type: 'apply_status', status: 'poison', value: 2 }, desc: 'Apply Poison 2' },
    { id: 'ice_rune', kind: 'add_action', action: { type: 'apply_status', status: 'weak', value: 1 }, desc: 'Apply Weak 1' },
    { id: 'stone_rune', kind: 'add_action', action: { type: 'apply_status', status: 'vulnerable', value: 1 }, desc: 'Apply Vulnerable 1' },
  ],
  legendary: [
    { id: 'vampire_rune', kind: 'add_action', action: { type: 'heal', value: 2, forceSelf: true }, desc: 'Self heal 2' },
    { id: 'midas_touch', kind: 'add_action', action: { type: 'restore_mana', value: 1 }, desc: 'Restore 1 mana' },
  ],
};
