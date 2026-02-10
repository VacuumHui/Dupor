import { GameState } from '../state/GameState.js';
import { ENCHANTS_DB } from '../data/enchants.js';
import { getResponsiveMetrics } from '../utils/Responsive.js';

export class RestScene extends Phaser.Scene {
  constructor() { super('RestScene'); }

  create() {
    this.metrics = getResponsiveMetrics(this);
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x1a120f).setOrigin(0);
    this.add.text(this.scale.width / 2, this.metrics.value(90), 'Campfire 🔥', { fontSize: this.metrics.font(46), color: '#fff' }).setOrigin(0.5);
    this.button(this.scale.width / 2 - this.metrics.value(220), this.metrics.value(280), 'REST', () => {
      const heal = Math.round(GameState.maxHp * 0.3);
      GameState.currentHp = Math.min(GameState.maxHp, GameState.currentHp + heal);
      this.game.events.emit('UPDATE_UI');
      this.scene.start('MapScene');
    });
    this.button(this.scale.width / 2 + this.metrics.value(220), this.metrics.value(280), 'SMITH', () => this.openSmith());
  }

  openSmith() {
    this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000, 0.8).setInteractive();
    this.add.text(this.scale.width / 2, this.metrics.value(90), 'Choose card to enchant', { fontSize: this.metrics.font(30), color: '#fff' }).setOrigin(0.5);
    GameState.deck.slice(0, 8).forEach((card, i) => {
      const t = this.add.text(
        this.metrics.value(120) + (i % 2) * this.metrics.value(460),
        this.metrics.value(170) + Math.floor(i / 2) * this.metrics.value(84),
        `${card.id} (${card.enchants.length})`,
        { fontSize: this.metrics.font(24), color: '#ddd' },
      ).setInteractive();
      t.on('pointerdown', () => {
        const pool = [...ENCHANTS_DB.common, ...ENCHANTS_DB.rare, ...ENCHANTS_DB.legendary];
        card.enchants.push(Phaser.Utils.Array.GetRandom(pool));
        this.scene.start('MapScene');
        this.game.events.emit('UPDATE_UI');
      });
    });
  }

  button(x, y, label, cb) {
    const b = this.add.rectangle(x, y, this.metrics.value(260), this.metrics.value(92), 0x2d1f14).setStrokeStyle(2, 0xffa).setInteractive();
    this.add.text(x, y, label, { fontSize: this.metrics.font(34), color: '#fff' }).setOrigin(0.5);
    b.on('pointerdown', cb);
    b.on('pointerover', () => this.tweens.add({ targets: b, scale: 1.06, duration: 100 }));
    b.on('pointerout', () => this.tweens.add({ targets: b, scale: 1, duration: 100 }));
    return b;
  }
}
