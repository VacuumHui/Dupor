export const RELICS_DB = {
  strawberry: {
    id: 'strawberry', name: 'Strawberry', price: 120,
    triggers: { onPickup: [{ type: 'increase_max_hp', value: 5 }, { type: 'heal', value: 5, forceSelf: true }] },
    desc: 'Max HP +5 and heal 5 on pickup.',
  },
  dumbbell: {
    id: 'dumbbell', name: 'Dumbbell', price: 140,
    triggers: { onBattleStart: [{ type: 'apply_status', status: 'strength', value: 1, forceSelf: true }] },
    desc: 'Gain 1 Strength at battle start.',
  },
  vampire_amulet: {
    id: 'vampire_amulet', name: 'Vampire Amulet', price: 160,
    triggers: { onKill: [{ type: 'heal', value: 3, forceSelf: true }] },
    desc: 'Heal 3 when you kill an enemy.',
  },
  spiked_shield: {
    id: 'spiked_shield', name: 'Spiked Shield', price: 130,
    triggers: { onTurnStart: [{ type: 'apply_status', status: 'thorns', value: 2, forceSelf: true }] },
    desc: 'Gain 2 Thorns each turn start.',
  },
};
