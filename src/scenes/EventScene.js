import { EVENTS_DB } from '../data/events.js';
import { GameState, createCardInstance } from '../state/GameState.js';

export class EventScene extends Phaser.Scene {
  constructor() { super('EventScene'); }

  create() {
    this.add.rectangle(0,0,this.scale.width,this.scale.height,0x121218).setOrigin(0);
    this.eventData = Phaser.Utils.Array.GetRandom(EVENTS_DB);
    this.add.text(80, 60, this.eventData.title, { fontSize: '42px', color: '#fff' });
    this.log = this.add.text(80, 130, this.eventData.text, { fontSize: '20px', color: '#aaa', wordWrap: { width: this.scale.width - 160 } });
    this.eventData.options.forEach((opt, idx) => {
      const b = this.add.rectangle(300, 240 + idx * 90, 460, 66, 0x2c2c40).setInteractive();
      this.add.text(300, 240 + idx * 90, opt.label, { fontSize: '22px', color: '#fff' }).setOrigin(0.5);
      b.on('pointerdown', () => this.choose(opt));
    });
  }

  choose(opt) {
    if (opt.chance) {
      if (Math.random() <= opt.chance) this.resolve(opt.success);
      else this.resolve(opt.fail);
    } else this.resolve(opt.outcome);
  }

  resolve(outcome) {
    if (outcome.type === 'heal_full') GameState.currentHp = GameState.maxHp;
    if (outcome.type === 'add_card') GameState.deck.push(createCardInstance(outcome.cardId));
    if (outcome.type === 'gold') GameState.gold += outcome.value;
    if (outcome.type === 'damage') GameState.currentHp = Math.max(1, GameState.currentHp - outcome.value);
    if (outcome.type === 'fight_bonus') {
      GameState.eventFightBonusGold = outcome.value;
      this.game.events.emit('UPDATE_UI');
      return this.scene.start('BattleScene');
    }
    this.game.events.emit('UPDATE_UI');
    this.scene.start('MapScene');
  }
}
