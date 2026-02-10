import { GameState } from '../state/GameState.js';
import { getResponsiveMetrics } from '../utils/Responsive.js';

export class UIScene extends Phaser.Scene {
  constructor() { super('UIScene'); this.handler = null; }

  create() {
    this.metrics = getResponsiveMetrics(this);
    const { width } = this.scale;
    this.panel = this.add.rectangle(width / 2, this.metrics.value(32), width, this.metrics.value(64), 0x000000, 0.6).setOrigin(0.5);
    this.stats = this.add.text(this.metrics.value(20), this.metrics.value(11), '', { fontSize: this.metrics.font(20), color: '#fff' });

    this.summaryBg = this.add.rectangle(width + this.metrics.value(170), this.metrics.value(310), this.metrics.value(340), this.metrics.value(520), 0x111827, 0.95).setStrokeStyle(2, 0x9ca3af);
    this.summaryText = this.add.text(width + this.metrics.value(28), this.metrics.value(70), '', { fontSize: this.metrics.font(16), color: '#ddd', wordWrap: { width: this.metrics.value(290) } });
    const tab = this.add.rectangle(width - this.metrics.value(16), this.metrics.value(280), this.metrics.value(32), this.metrics.value(180), 0x374151).setInteractive({ useHandCursor: true });

    tab.on('pointerdown', () => {
      const open = this.summaryBg.x < width;
      this.tweens.add({
        targets: [this.summaryBg, this.summaryText],
        x: open ? width + this.metrics.value(170) : width - this.metrics.value(170),
        duration: 180,
      });
    });

    this.handler = () => this.updateUI();
    this.game.events.on('UPDATE_UI', this.handler);
    this.events.on('shutdown', () => this.game.events.off('UPDATE_UI', this.handler));
    this.updateUI();
  }

  updateUI() {
    this.stats.setText(`❤ ${GameState.currentHp}/${GameState.maxHp}    💰 ${GameState.gold}    Lvl ${GameState.level}`);
    this.summaryText.setText([
      'Hero Summary',
      `Act: ${GameState.act}`,
      `Deck size: ${GameState.deck.length}`,
      `Relics: ${GameState.relics.join(', ') || 'None'}`,
      `Max Mana: ${GameState.maxMana}`,
    ].join('\n'));
  }
}
