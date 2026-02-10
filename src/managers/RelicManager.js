import { RELICS_DB } from '../data/relics.js';
import { GameState } from '../state/GameState.js';
import { executeAction } from './ActionManager.js';

export class RelicManager {
  constructor(scene) { this.scene = scene; }

  addRelic(relicId) {
    if (!GameState.relics.includes(relicId)) GameState.relics.push(relicId);
    this.trigger('onPickup', { source: this.scene.player, target: this.scene.player, relicId });
    this.scene.game.events.emit('UPDATE_UI');
  }

  trigger(eventName, context = {}) {
    for (const relicId of GameState.relics) {
      const relic = RELICS_DB[relicId];
      if (!relic?.triggers?.[eventName]) continue;
      for (const action of relic.triggers[eventName]) this.executeRelicAction(action, context);
    }
  }

  executeRelicAction(action, context) {
    executeAction(this.scene, action, context.source || this.scene.player, context.target || this.scene.player);
  }
}
