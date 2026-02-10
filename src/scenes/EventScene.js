import { EVENTS_DB } from '../data/events.js';
import { GameState, createCardInstance } from '../state/GameState.js';
import { getResponsiveMetrics } from '../utils/Responsive.js';

export class EventScene extends Phaser.Scene {
  constructor() { super('EventScene'); }

  create() {
    this.metrics = getResponsiveMetrics(this);
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x121218).setOrigin(0);
    this.eventData = Phaser.Utils.Array.GetRandom(EVENTS_DB);
    this.add.text(this.metrics.value(70), this.metrics.value(70), this.eventData.title, { fontSize: this.metrics.font(42), color: '#fff' });
    this.log = this.add.text(this.metrics.value(70), this.metrics.value(150), this.eventData.text, {
      fontSize: this.metrics.font(22),
      color: '#aaa',
      wordWrap: { width: this.scale.width - this.metrics.value(140) },
    });

    this.eventData.options.forEach((opt, idx) => {
      const y = this.metrics.value(300) + idx * this.metrics.value(102);
      const b = this.add.rectangle(this.scale.width / 2, y, this.metrics.value(620), this.metrics.value(82), 0x2c2c40).setInteractive();
      this.add.text(this.scale.width / 2, y, opt.label, { fontSize: this.metrics.font(24), color: '#fff' }).setOrigin(0.5);
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
