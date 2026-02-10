import { GameState } from '../state/GameState.js';

export function executeAction(scene, action, source, target) {
  const src = source;
  const trg = action.forceSelf ? source : target;
  if (!trg || !trg.alive) return;

  let value = action.value ?? 0;
  if (action.type === 'damage') {
    value += src.getStatus?.('strength') || 0;
    if ((src.getStatus?.('weak') || 0) > 0) value = Math.floor(value * 0.75);
    trg.takeDamage(value, src);
    scene.effectManager?.floatingText(trg.x, trg.y - 60, `-${value}`, '#ff7777');
  }
  if (action.type === 'block') { trg.addShield(value); scene.effectManager?.floatingText(trg.x, trg.y - 60, `+${value} block`, '#87ceeb'); }
  if (action.type === 'heal') {
    if (trg.isPlayer) GameState.currentHp = Math.min(GameState.maxHp, GameState.currentHp + value);
    trg.heal(value);
    scene.effectManager?.floatingText(trg.x, trg.y - 60, `+${value} hp`, '#77ff99');
  }
  if (action.type === 'apply_status') { trg.applyStatus(action.status, value); }
  if (action.type === 'restore_mana') { scene.currentMana = Math.min(scene.maxMana + 5, scene.currentMana + value); scene.updateBattleUI?.(); }
  if (action.type === 'draw') scene.handManager.draw(value);
  if (action.type === 'increase_max_hp') { GameState.maxHp += value; GameState.currentHp = Math.min(GameState.maxHp, GameState.currentHp + value); if (trg.maxHp) { trg.maxHp += value; trg.heal(value);} }
  if (action.type === 'increase_max_mana') { GameState.maxMana += value; scene.maxMana = GameState.maxMana; scene.currentMana += value; scene.updateBattleUI?.(); }
}
