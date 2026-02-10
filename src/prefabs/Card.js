import { RARITY_COLORS } from '../data/cards.js';
import { CardLogic } from '../utils/CardLogic.js';

export class Card extends Phaser.GameObjects.Container {
  constructor(scene, x, y, cardInstance) {
    super(scene, x, y);
    this.scene = scene;
    this.cardInstance = cardInstance;
    this.cardData = CardLogic.getComputedCard(cardInstance);
    this.isZoomed = false;

    this.bg = scene.add.rectangle(0, 0, 110, 160, 0x1f2430, 1).setStrokeStyle(2, RARITY_COLORS[this.cardData.rarity] || 0xffffff);
    this.enchantFrame = scene.add.rectangle(0, 0, 116, 166).setStrokeStyle(cardInstance.enchants?.length ? 2 : 0, 0x9b59b6);
    this.title = scene.add.text(0, -66, this.cardData.name, { fontSize: '12px', color: '#fff' }).setOrigin(0.5);
    this.desc = scene.add.text(0, -8, this.cardData.desc, { fontSize: '11px', color: '#ddd', align: 'center', wordWrap: { width: 95 } }).setOrigin(0.5);
    this.fullDesc = scene.add.text(0, 36, this.cardData.generatedDesc, { fontSize: '9px', color: '#9ad', align: 'center', wordWrap: { width: 95 } }).setOrigin(0.5).setVisible(false);
    this.costCircle = scene.add.circle(-40, -66, 14, 0x111).setStrokeStyle(2, 0xf1c40f);
    this.costText = scene.add.text(-40, -66, String(this.cardData.cost), { fontSize: '13px', color: '#fff' }).setOrigin(0.5);

    this.add([this.enchantFrame, this.bg, this.title, this.desc, this.fullDesc, this.costCircle, this.costText]);
    this.setSize(110, 160);
    this.setInteractive({ draggable: true, useHandCursor: true });
    scene.add.existing(this);
  }

  toggleMode(isZoomed) {
    this.isZoomed = isZoomed;
    this.fullDesc.setVisible(isZoomed);
    this.scene.tweens.add({ targets: this, scale: isZoomed ? 1.5 : 1, duration: 120 });
  }
}
