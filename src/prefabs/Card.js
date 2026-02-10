import { RARITY_COLORS } from '../data/cards.js';
import { CardLogic } from '../utils/CardLogic.js';
import { getResponsiveMetrics } from '../utils/Responsive.js';

export class Card extends Phaser.GameObjects.Container {
  constructor(scene, x, y, cardInstance) {
    super(scene, x, y);
    this.scene = scene;
    this.cardInstance = cardInstance;
    this.cardData = CardLogic.getComputedCard(cardInstance);
    this.isZoomed = false;
    this.metrics = getResponsiveMetrics(scene);
    const cardScale = scene.cardScale || (this.metrics.isMobile ? 1.15 : 1);
    const width = Math.round(110 * cardScale);
    const height = Math.round(160 * cardScale);
    const titleY = Math.round(-66 * cardScale);
    const wrapWidth = Math.round(95 * cardScale);
    const font = (v) => this.metrics.font(v * cardScale);

    this.bg = scene.add.rectangle(0, 0, width, height, 0x1f2430, 1).setStrokeStyle(2, RARITY_COLORS[this.cardData.rarity] || 0xffffff);
    this.enchantFrame = scene.add.rectangle(0, 0, width + Math.round(6 * cardScale), height + Math.round(6 * cardScale)).setStrokeStyle(cardInstance.enchants?.length ? 2 : 0, 0x9b59b6);
    this.title = scene.add.text(0, titleY, this.cardData.name, { fontSize: font(12), color: '#fff' }).setOrigin(0.5);
    this.desc = scene.add.text(0, Math.round(-8 * cardScale), this.cardData.desc, { fontSize: font(11), color: '#ddd', align: 'center', wordWrap: { width: wrapWidth } }).setOrigin(0.5);
    this.fullDesc = scene.add.text(0, Math.round(36 * cardScale), this.cardData.generatedDesc, { fontSize: font(9), color: '#9ad', align: 'center', wordWrap: { width: wrapWidth } }).setOrigin(0.5).setVisible(false);
    this.costCircle = scene.add.circle(Math.round(-40 * cardScale), titleY, Math.round(14 * cardScale), 0x111).setStrokeStyle(2, 0xf1c40f);
    this.costText = scene.add.text(Math.round(-40 * cardScale), titleY, String(this.cardData.cost), { fontSize: font(13), color: '#fff' }).setOrigin(0.5);

    this.add([this.enchantFrame, this.bg, this.title, this.desc, this.fullDesc, this.costCircle, this.costText]);
    this.setSize(width, height);
    this.setInteractive({ draggable: true, useHandCursor: true });
    scene.add.existing(this);
  }

  toggleMode(isZoomed) {
    this.isZoomed = isZoomed;
    this.fullDesc.setVisible(isZoomed);
    this.scene.tweens.add({ targets: this, scale: isZoomed ? 1.5 : 1, duration: 120 });
  }
}
