export class EffectManager {
  constructor(scene) { this.scene = scene; }

  floatingText(x, y, text, color = '#fff') {
    const t = this.scene.add.text(x, y, text, { fontSize: '16px', color }).setOrigin(0.5);
    this.scene.tweens.add({ targets: t, y: y - 45, alpha: 0, duration: 500, onComplete: () => t.destroy() });
  }

  hit(x, y) { this.burst(x, y, 0xff5555); }
  block(x, y) { this.burst(x, y, 0x7ec8ff); }
  heal(x, y) { this.burst(x, y, 0x76ff8b); }
  poison(x, y) { this.burst(x, y, 0x9b59b6); }
  buff(x, y) { this.burst(x, y, 0xf1c40f); }

  burst(x, y, color) {
    for (let i = 0; i < 10; i += 1) {
      const p = this.scene.add.circle(x, y, 2, color);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(10, 40);
      this.scene.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        duration: 300,
        onComplete: () => p.destroy(),
      });
    }
  }
}
