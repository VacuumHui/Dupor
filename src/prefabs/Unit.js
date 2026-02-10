export class Unit extends Phaser.GameObjects.Container {
  constructor(scene, x, y, cfg) {
    super(scene, x, y);
    this.scene = scene;
    this.name = cfg.name;
    this.maxHp = cfg.hp;
    this.hp = cfg.hp;
    this.shield = 0;
    this.alive = true;
    this.statuses = {};
    this.isPlayer = cfg.isPlayer;
    this.unitKey = cfg.unitKey;
    this.moves = cfg.moves || [];
    this.currentIntent = null;

    this.bodyRect = scene.add.rectangle(0, 0, 130, 130, this.isPlayer ? 0x204060 : 0x402020).setStrokeStyle(2, 0xffffff);
    this.nameText = scene.add.text(0, -76, this.name, { fontSize: '14px', color: '#fff' }).setOrigin(0.5);
    this.hpBar = scene.add.rectangle(0, 78, 110, 8, 0xe74c3c).setOrigin(0.5);
    this.hpText = scene.add.text(0, 92, '', { fontSize: '11px', color: '#fff' }).setOrigin(0.5);
    this.shieldText = scene.add.text(0, 58, '', { fontSize: '10px', color: '#7ec8ff' }).setOrigin(0.5);
    this.statusText = scene.add.text(0, 108, '', { fontSize: '10px', color: '#9eff9e' }).setOrigin(0.5);
    this.intentText = scene.add.text(0, -96, '', { fontSize: '12px', color: '#ffd27f' }).setOrigin(0.5);
    this.dropZone = scene.add.zone(0,0,140,140).setRectangleDropZone(140,140);
    this.add([this.bodyRect, this.nameText, this.hpBar, this.hpText, this.shieldText, this.statusText, this.intentText, this.dropZone]);
    this.updateUI();
    scene.add.existing(this);
  }

  applyStatus(name, value) { this.statuses[name] = (this.statuses[name] || 0) + value; this.updateStatusUI(); }
  getStatus(name) { return this.statuses[name] || 0; }
  consumeStatus(name, v = 1) { this.statuses[name] = Math.max(0, (this.statuses[name] || 0) - v); this.updateStatusUI(); }

  takeDamage(amount, source) {
    if (!this.alive) return;
    let dmg = amount;
    if (this.getStatus('vulnerable') > 0) dmg = Math.round(dmg * 1.5);
    const absorbed = Math.min(this.shield, dmg);
    this.shield -= absorbed;
    dmg -= absorbed;
    if (dmg > 0) this.hp -= dmg;
    if (source && this.getStatus('thorns') > 0 && source !== this) source.takeDamage(this.getStatus('thorns'), null);
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.scene.tweens.add({ targets: this, alpha: 0.15, duration: 300 });
    }
    if (this.getStatus('rage') > 0 && dmg > 0) this.applyStatus('strength', this.getStatus('rage'));
    this.updateUI();
  }

  heal(v) { this.hp = Math.min(this.maxHp, this.hp + v); this.updateUI(); }
  addShield(v) { this.shield += v; this.updateUI(); }
  resetShield() { this.shield = 0; this.updateUI(); }

  updateUI() {
    this.hpBar.width = 110 * (this.hp / this.maxHp);
    this.hpText.setText(`${this.hp}/${this.maxHp} HP`);
    this.shieldText.setText(this.shield > 0 ? `🛡 ${this.shield}` : '');
    this.updateStatusUI();
  }

  updateStatusUI() {
    const list = Object.entries(this.statuses).filter(([, v]) => v > 0).map(([k, v]) => `${k}:${v}`);
    this.statusText.setText(list.join(' '));
  }

  chooseIntent() {
    let r = Math.random();
    let acc = 0;
    this.currentIntent = this.moves[0];
    for (const m of this.moves) { acc += m.chance; if (r <= acc) { this.currentIntent = m; break; } }
    this.showIntentUI();
  }

  showIntentUI() {
    if (this.isPlayer || !this.currentIntent) return;
    this.intentText.setText(`Intent: ${this.currentIntent.name}`);
  }

  async executeIntent(playerTarget, executeAction) {
    if (!this.currentIntent || !this.alive) return;
    for (const action of this.currentIntent.actions) {
      executeAction(this.scene, action, this, playerTarget);
    }
  }
}
