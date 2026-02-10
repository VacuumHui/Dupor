import { CARDS_DB } from '../data/cards.js';
import { RELICS_DB } from '../data/relics.js';
import { GameState, createCardInstance } from '../state/GameState.js';

const CARD_PRICES = { common: 50, rare: 100, legendary: 200 };

export class ShopScene extends Phaser.Scene {
  constructor() { super('ShopScene'); }

  create() {
    this.add.rectangle(0,0,this.scale.width,this.scale.height,0x11151c).setOrigin(0);
    this.add.text(this.scale.width/2, 70, 'Shop 🛒', { fontSize: '50px', color: '#fff' }).setOrigin(0.5);
    this.goldText = this.add.text(60, 40, '', { fontSize: '26px', color: '#facc15' });

    const randomCards = Phaser.Utils.Array.Shuffle(Object.values(CARDS_DB)).slice(0, 3);
    randomCards.forEach((card, i) => this.createCardOffer(card, 210 + i * 300, 280));

    const relic = Phaser.Utils.Array.GetRandom(Object.values(RELICS_DB));
    this.createRelicOffer(relic, this.scale.width/2, 500);

    const leave = this.add.text(this.scale.width - 130, this.scale.height - 60, 'Leave', { fontSize: '30px', color: '#ddd' }).setInteractive();
    leave.on('pointerdown', () => this.scene.start('MapScene'));
    this.refreshUI();
  }

  createCardOffer(card, x, y) {
    const price = CARD_PRICES[card.rarity];
    const box = this.add.rectangle(x,y,230,150,0x1f2937).setStrokeStyle(2,0x9ca3af).setInteractive();
    this.add.text(x, y - 30, card.name, { fontSize: '22px', color: '#fff' }).setOrigin(0.5);
    this.add.text(x, y + 8, `${card.desc}`, { fontSize: '14px', color: '#aaa', wordWrap: { width: 200 } }).setOrigin(0.5);
    this.add.text(x, y + 55, `Buy ${price}g`, { fontSize: '18px', color: '#facc15' }).setOrigin(0.5);
    box.on('pointerdown', () => {
      if (GameState.gold < price) return;
      GameState.gold -= price;
      GameState.deck.push(createCardInstance(card.id));
      box.disableInteractive().setAlpha(0.4);
      this.refreshUI();
    });
  }

  createRelicOffer(relic, x, y) {
    const box = this.add.rectangle(x,y,450,120,0x231f35).setStrokeStyle(2,0xa78bfa).setInteractive();
    this.add.text(x, y - 26, `${relic.name} (${relic.price}g)`, { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
    this.add.text(x, y + 18, relic.desc, { fontSize: '16px', color: '#d1d5db' }).setOrigin(0.5);
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
