import { GameState } from '../state/GameState.js';

export class UIScene extends Phaser.Scene {
  constructor() { super('UIScene'); this.handler = null; }

  create() {
    const { width } = this.scale;
    this.panel = this.add.rectangle(width/2, 24, width, 48, 0x000000, 0.55).setOrigin(0.5);
    this.stats = this.add.text(20, 10, '', { fontSize: '18px', color: '#fff' });

    this.summaryBg = this.add.rectangle(width + 140, 240, 280, 420, 0x111827, 0.95).setStrokeStyle(2, 0x9ca3af);
    this.summaryText = this.add.text(width + 20, 60, '', { fontSize: '14px', color: '#ddd', wordWrap: { width: 240 } });
    const tab = this.add.rectangle(width - 12, 220, 24, 140, 0x374151).setInteractive({ useHandCursor: true });
    tab.on('pointerdown', () => {
      const open = this.summaryBg.x < width;
      this.tweens.add({ targets: [this.summaryBg, this.summaryText], x: open ? width + 140 : width - 140, duration: 180 });
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
