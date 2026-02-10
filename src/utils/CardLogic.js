import { CARDS_DB } from '../data/cards.js';

export const CardLogic = {
  getComputedCard(cardInstance) {
    const base = structuredClone(CARDS_DB[cardInstance.id]);
    const bonusLines = [];
    for (const enchant of (cardInstance.enchants || [])) {
      if (enchant.kind === 'stat_modifier') {
        if (enchant.target === 'cost') base.cost = Math.max(0, base.cost + enchant.value);
        if (enchant.target === 'damage') {
          base.actions = base.actions.map((a) => a.type === 'damage' ? { ...a, value: a.value + enchant.value } : a);
        }
        bonusLines.push(`[+] ${enchant.desc}`);
      }
      if (enchant.kind === 'add_action') {
        base.actions.push(structuredClone(enchant.action));
        bonusLines.push(`[+] ${enchant.desc}`);
      }
    }
    base.generatedDesc = [base.desc, ...bonusLines].join('\n');
    return base;
  },
};
