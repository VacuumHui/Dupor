import { GameState } from '../state/GameState.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width/2, height/2, width, height, 0x0f111b);
    this.add.text(width/2, height*0.3, 'DARK AGE', { fontSize: '64px', color: '#f2f2f2' }).setOrigin(0.5);
    const btn = this.add.rectangle(width/2, height*0.6, 240, 70, 0x2c1f46).setStrokeStyle(2,0x9b59b6).setInteractive({ useHandCursor: true });
    this.add.text(btn.x, btn.y, 'NEW GAME', { fontSize: '28px', color: '#fff' }).setOrigin(0.5);
    btn.on('pointerover', () => this.tweens.add({ targets: btn, scale: 1.06, duration: 120 }));
    btn.on('pointerout', () => this.tweens.add({ targets: btn, scale: 1, duration: 120 }));
    btn.on('pointerdown', () => {
      GameState.reset();
      this.scene.start('MapScene');
      if (this.scene.isActive('UIScene')) this.scene.stop('UIScene');
      this.scene.launch('UIScene');
      this.game.events.emit('UPDATE_UI');
    });
  }
}
