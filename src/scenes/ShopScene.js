import { CARDS_DB } from '../data/cards.js';
import { RELICS_DB } from '../data/relics.js';
import { GameState, createCardInstance } from '../state/GameState.js';
import { getResponsiveMetrics } from '../utils/Responsive.js';

const CARD_PRICES = { common: 50, rare: 100, legendary: 200 };

export class ShopScene extends Phaser.Scene {
  constructor() { super('ShopScene'); }

  create() {
    this.metrics = getResponsiveMetrics(this);
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x11151c).setOrigin(0);
    this.add.text(this.scale.width / 2, this.metrics.value(80), 'Shop 🛒', { fontSize: this.metrics.font(50), color: '#fff' }).setOrigin(0.5);
    this.goldText = this.add.text(this.metrics.value(46), this.metrics.value(38), '', { fontSize: this.metrics.font(28), color: '#facc15' });

    const randomCards = Phaser.Utils.Array.Shuffle(Object.values(CARDS_DB)).slice(0, 3);
    randomCards.forEach((card, i) => this.createCardOffer(card, this.metrics.value(180) + i * this.metrics.value(315), this.metrics.value(320)));

    const relic = Phaser.Utils.Array.GetRandom(Object.values(RELICS_DB));
    this.createRelicOffer(relic, this.scale.width / 2, this.metrics.value(560));

    const leave = this.add.text(this.scale.width - this.metrics.value(150), this.scale.height - this.metrics.value(80), 'Leave', { fontSize: this.metrics.font(34), color: '#ddd' }).setInteractive();
    leave.on('pointerdown', () => this.scene.start('MapScene'));
    this.refreshUI();
  }

  createCardOffer(card, x, y) {
    const price = CARD_PRICES[card.rarity];
    const box = this.add.rectangle(x, y, this.metrics.value(250), this.metrics.value(180), 0x1f2937).setStrokeStyle(2, 0x9ca3af).setInteractive();
    this.add.text(x, y - this.metrics.value(42), card.name, { fontSize: this.metrics.font(24), color: '#fff' }).setOrigin(0.5);
    this.add.text(x, y + this.metrics.value(6), `${card.desc}`, { fontSize: this.metrics.font(15), color: '#aaa', wordWrap: { width: this.metrics.value(220) } }).setOrigin(0.5);
    this.add.text(x, y + this.metrics.value(64), `Buy ${price}g`, { fontSize: this.metrics.font(20), color: '#facc15' }).setOrigin(0.5);

    box.on('pointerdown', () => {
      if (GameState.gold < price) return;
      GameState.gold -= price;
      GameState.deck.push(createCardInstance(card.id));
      box.disableInteractive().setAlpha(0.4);
      this.refreshUI();
    });
  }

  createRelicOffer(relic, x, y) {
    const box = this.add.rectangle(x, y, this.metrics.value(520), this.metrics.value(150), 0x231f35).setStrokeStyle(2, 0xa78bfa).setInteractive();
    this.add.text(x, y - this.metrics.value(30), `${relic.name} (${relic.price}g)`, { fontSize: this.metrics.font(27), color: '#fff' }).setOrigin(0.5);
    this.add.text(x, y + this.metrics.value(22), relic.desc, { fontSize: this.metrics.font(17), color: '#d1d5db', wordWrap: { width: this.metrics.value(460) } }).setOrigin(0.5);
    box.on('pointerdown', () => {
      if (GameState.gold < relic.price || GameState.relics.includes(relic.id)) return;
      GameState.gold -= relic.price;
      GameState.relics.push(relic.id);
      box.disableInteractive().setAlpha(0.45);
      this.refreshUI();
    });
  }

  refreshUI() { this.goldText.setText(`Gold: ${GameState.gold}`); this.game.events.emit('UPDATE_UI'); }
}
