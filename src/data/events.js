export const EVENTS_DB = [
  {
    id: 'mysterious_fountain',
    title: 'Mysterious Fountain',
    text: 'An eerie fountain glows with pale light.',
    options: [
      { id: 'heal_full', label: 'Drink (heal to full)', outcome: { type: 'heal_full' } },
      { id: 'get_potion', label: 'Bottle essence (get potion card)', outcome: { type: 'add_card', cardId: 'heal_potion' } },
      { id: 'leave', label: 'Leave', outcome: { type: 'none' } },
    ],
  },
  {
    id: 'scary_thief',
    title: 'Scary Thief',
    text: 'A masked thief offers a risky gamble.',
    options: [
      { id: 'steal_gold', label: 'Rob the stash (60%)', chance: 0.6, success: { type: 'gold', value: 50 }, fail: { type: 'damage', value: 10 } },
      { id: 'fight', label: 'Fight the thief', outcome: { type: 'fight_bonus', value: 30 } },
      { id: 'leave', label: 'Leave', outcome: { type: 'none' } },
    ],
  },
];
