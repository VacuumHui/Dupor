import { GameState } from '../state/GameState.js';
import { MapManager } from '../managers/MapManager.js';
import { Card } from '../prefabs/Card.js';
import { getResponsiveMetrics } from '../utils/Responsive.js';

export class MapScene extends Phaser.Scene {
  constructor() { super('MapScene'); }

  create() {
    this.metrics = getResponsiveMetrics(this);
    if (!GameState.mapGenerated || !GameState.mapData) {
      GameState.mapData = MapManager.generateMap();
      GameState.mapGenerated = true;
    }

    this.add.rectangle(0, 0, 4000, Math.max(900, this.scale.height), 0x10131c).setOrigin(0);
    this.cameras.main.setBounds(0, 0, 4000, this.scale.height);

    this.mapContainer = this.add.container(0, 0);
    this.drawMap();

    this.input.on('pointermove', (p) => {
      if (p.isDown) this.cameras.main.scrollX -= (p.x - p.prevPosition.x);
    });

    const deckBtn = this.add.rectangle(this.scale.width - this.metrics.value(110), this.metrics.value(70), this.metrics.value(180), this.metrics.value(62), 0x223)
      .setScrollFactor(0)
      .setInteractive();
    this.add.text(deckBtn.x, deckBtn.y, 'View Deck', { fontSize: this.metrics.font(18), color: '#fff' }).setOrigin(0.5).setScrollFactor(0);
    deckBtn.on('pointerdown', () => this.showDeckOverlay());
  }

  drawMap() {
    const floorSpacing = this.metrics.value(280);
    const ySpacing = this.metrics.value(120);
    for (const floor of GameState.mapData.floors) {
      for (const node of floor) {
        const x = this.metrics.value(180) + node.floor * floorSpacing;
        const y = this.metrics.value(120) + node.idx * ySpacing + (node.floor % 2) * this.metrics.value(30);
        node.pos = { x, y };
      }
    }

    for (const floor of GameState.mapData.floors) {
      for (const node of floor) {
        for (const linkId of node.links) {
          const nextNode = GameState.mapData.floors.flat().find((n) => n.id === linkId);
          const visible = node.visible || nextNode.visible;
          this.mapContainer.add(this.add.line(0, 0, node.pos.x, node.pos.y, nextNode.pos.x, nextNode.pos.y, visible ? 0x5e6472 : 0x222831).setOrigin(0));
        }
      }
    }

    for (const node of GameState.mapData.floors.flat()) {
      const color = node.available ? 0x22c55e : node.visible ? 0x64748b : 0x222;
      const c = this.add.circle(node.pos.x, node.pos.y, this.metrics.value(32), color).setStrokeStyle(2, 0xffffff);
      const icon = this.add.text(node.pos.x, node.pos.y, this.iconFor(node.type), { fontSize: this.metrics.font(24) }).setOrigin(0.5);
      if (node.available && !node.locked) c.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.enterNode(node));
      this.mapContainer.add([c, icon]);
    }
  }

  iconFor(type) { return ({ start: '🜂', battle: '⚔', event: '❓', shop: '💰', rest: '🔥', boss: '👑' }[type] || '•'); }

  enterNode(node) {
    GameState.currentNode = node;
    GameState.currentFloor = node.floor;
    MapManager.unlockNextLayer(GameState.mapData, node.id);
    if (node.type === 'battle' || node.type === 'boss') this.scene.start('BattleScene', { boss: node.type === 'boss' });
    if (node.type === 'event') this.scene.start('EventScene');
    if (node.type === 'shop') this.scene.start('ShopScene');
    if (node.type === 'rest') this.scene.start('RestScene');
    if (node.type === 'start') this.scene.restart();
  }

  showDeckOverlay() {
    const overlay = this.add.rectangle(this.cameras.main.scrollX + this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000, 0.82)
      .setScrollFactor(0)
      .setInteractive();

    const cards = GameState.deck.slice(0, 10).map((ci, i) => {
      const x = this.metrics.value(180) + (i % 5) * this.metrics.value(140) + this.cameras.main.scrollX;
      const y = this.metrics.value(170) + Math.floor(i / 5) * this.metrics.value(220);
      return new Card(this, x, y, ci);
    });
    cards.forEach((c) => c.toggleMode(true));

    overlay.on('pointerdown', () => {
      cards.forEach((c) => c.destroy());
      overlay.destroy();
    });
  }
}
